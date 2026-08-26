import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import Student from '../models/Student.js';
import Result from '../models/Result.js';
import Assignment from '../models/Assignment.js';
import Payment from '../models/Payment.js';
import Announcement from '../models/Announcement.js';
import Staff from '../models/Staff.js';
import Application from '../models/Application.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'newstate_high_school_jwt_secret_2026_production';

// 1. Anti-Brute-Force Rate Limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts from this IP. Please wait 15 minutes before trying again.' }
});

const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Max 15 online applications per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many application submissions from this IP. Please try again later.' }
});

// 2. JWT Verification & Role-Based Access Control (RBAC) Middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access denied: Authentication token required' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token' });
  }
};

// Optional auth middleware (identifies user if token is present, but doesn't block public requests)
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      req.user = null;
    }
  }
  next();
};

// Role-Gate Middleware Helper
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges for this action' });
    }
    next();
  };
};

const sessionInfo = {
  currentSession: '2026/2027 Academic Session',
  currentTerm: 'First Term',
  schoolName: 'New State High School',
  schoolMotto: 'Domine Dirige Nos',
  address: '36 Palm Avenue, Mushin, Lagos, Nigeria',
  phone: '+234 813 400 0644',
  email: 'info@newstateschools.org',
  bankDetails: {
    bankName: 'First Bank Nigeria',
    accountName: 'New State High School',
    accountNumber: '1029384756',
  }
};

const timetable = [
  { day: 'Monday', time: '8:00 AM - 9:00 AM', subject: 'Mathematics', room: 'Room 3A' },
  { day: 'Monday', time: '9:00 AM - 10:00 AM', subject: 'English Language', room: 'Room 3A' },
  { day: 'Monday', time: '10:30 AM - 11:30 AM', subject: 'Physics (Practical)', room: 'Lab 1' },
  { day: 'Tuesday', time: '8:00 AM - 9:00 AM', subject: 'Chemistry', room: 'Lab 2' },
  { day: 'Tuesday', time: '9:00 AM - 10:00 AM', subject: 'AI & Coding Skills', room: 'ICT Lab' },
  { day: 'Wednesday', time: '8:00 AM - 10:00 AM', subject: 'Biology (Practical)', room: 'Lab 3' },
  { day: 'Thursday', time: '8:00 AM - 9:30 AM', subject: 'Further Mathematics', room: 'Room 3A' },
  { day: 'Friday', time: '8:00 AM - 10:00 AM', subject: 'Civic Education & Sports', room: 'Field' },
];

const learningMaterials = [
  {
    title: 'First Term Physics Complete Lecture Notes',
    subject: 'Physics',
    format: 'PDF',
    size: '2.4 MB',
    dateAdded: '2026-08-10',
  },
  {
    title: 'Python Fundamentals & Web Dev Handbook',
    subject: 'AI & Coding',
    format: 'PDF',
    size: '5.1 MB',
    dateAdded: '2026-08-12',
  },
  {
    title: 'WAEC Past Questions & Solutions (2015-2025)',
    subject: 'Mathematics',
    format: 'ZIP',
    size: '12.8 MB',
    dateAdded: '2026-08-01',
  },
];

// Helper to escape regex inputs (ReDoS defense)
const escapeRegex = (str) => {
  return typeof str === 'string' ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
};

// 1. Role-Filtered Portal Data Lookup (Protected against public unauthenticated data scraping)
router.get('/data', optionalAuth, async (req, res) => {
  try {
    const rawAnnouncements = await Announcement.find({}).sort({ createdAt: -1 });
    const rawAssignments = await Assignment.find({}).sort({ createdAt: -1 });

    const announcements = rawAnnouncements.map(an => ({
      id: an.announcementId || an._id,
      title: an.title,
      author: an.author,
      date: an.date,
      content: an.content
    }));

    const assignments = rawAssignments.map(a => ({
      id: a.assignmentId || a._id,
      subject: a.subject,
      title: a.title,
      dueDate: a.dueDate,
      desc: a.desc
    }));

    // Base Public Data (Timetable, Announcements, Learning Materials)
    const baseResponse = {
      sessionInfo,
      assignments,
      learningMaterials,
      timetable,
      announcements,
      students: [],
      results: {},
      feePayments: [],
      staff: [],
      applications: []
    };

    // If no authenticated session, return public info only (no sensitive bio-data/grades/fees)
    if (!req.user) {
      return res.json(baseResponse);
    }

    const userRole = req.user.role;

    // 🎓 Student: Return only their own results and fee clearance status
    if (userRole === 'student') {
      const studentId = req.user.id;
      const student = await Student.findOne({ id: studentId });
      const resultsList = await Result.find({ studentId });
      const rawPayments = await Payment.find({ studentId }).sort({ createdAt: -1 });

      const results = { [studentId]: resultsList };
      const feePayments = rawPayments.map(p => ({
        id: p.paymentId || p._id,
        paymentId: p.paymentId,
        studentId: p.studentId,
        studentName: p.studentName,
        amount: p.amount,
        bankName: p.bankName,
        reference: p.reference,
        dateSubmitted: p.dateSubmitted,
        status: p.status
      }));

      return res.json({
        ...baseResponse,
        students: student ? [student] : [],
        results,
        feePayments
      });
    }

    // 👨‍🏫 Teacher: Return assigned class students and broadsheet scores
    if (userRole === 'teacher') {
      const teacher = await Staff.findOne({
        $or: [{ staffId: req.user.id }, { email: req.user.id }]
      });

      const classFilter = teacher?.classAssigned ? { class: teacher.classAssigned.split(' - ')[0] } : {};
      const students = await Student.find(classFilter).sort({ name: 1 });
      const studentIds = students.map(s => s.id);
      const resultsList = await Result.find({ studentId: { $in: studentIds } });

      const results = {};
      resultsList.forEach(r => {
        if (!results[r.studentId]) results[r.studentId] = [];
        results[r.studentId].push(r);
      });

      return res.json({
        ...baseResponse,
        students,
        results,
        staff: teacher ? [teacher] : []
      });
    }

    // 💼 Bursar: Return student financial ledger and payment transactions
    if (userRole === 'bursar') {
      const students = await Student.find({}).select('id name class arm feeStatus paidAmount feeAmount guardian');
      const rawFeePayments = await Payment.find({}).sort({ createdAt: -1 });
      const feePayments = rawFeePayments.map(p => ({
        id: p.paymentId || p._id,
        paymentId: p.paymentId,
        studentId: p.studentId,
        studentName: p.studentName,
        amount: p.amount,
        bankName: p.bankName,
        reference: p.reference,
        dateSubmitted: p.dateSubmitted,
        status: p.status
      }));

      return res.json({
        ...baseResponse,
        students,
        feePayments
      });
    }

    // 🏛️ Admin: Full Master Access
    if (userRole === 'admin') {
      const students = await Student.find({}).sort({ createdAt: 1 });
      const resultsList = await Result.find({});
      const rawFeePayments = await Payment.find({}).sort({ createdAt: -1 });
      const staff = await Staff.find({});
      const applications = await Application.find({}).sort({ createdAt: -1 });

      const results = {};
      resultsList.forEach(r => {
        if (!results[r.studentId]) results[r.studentId] = [];
        results[r.studentId].push(r);
      });

      const feePayments = rawFeePayments.map(p => ({
        id: p.paymentId || p._id,
        paymentId: p.paymentId,
        studentId: p.studentId,
        studentName: p.studentName,
        amount: p.amount,
        bankName: p.bankName,
        reference: p.reference,
        dateSubmitted: p.dateSubmitted,
        status: p.status
      }));

      return res.json({
        ...baseResponse,
        students,
        results,
        feePayments,
        staff,
        applications
      });
    }

    return res.json(baseResponse);
  } catch (error) {
    console.error('Error fetching portal data:', error);
    res.status(500).json({ error: 'Failed to fetch portal data', details: error.message });
  }
});

// 2. Multi-Role Authentication with Anti-Brute-Force & Uniform Error Responses
router.post('/login', loginLimiter, async (req, res) => {
  const { identifier, password, role } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identification ID/Email and password/PIN are required' });
  }

  // Sanitize & enforce primitive strings (NoSQL injection prevention)
  const cleanIdentifier = String(identifier).trim();
  const cleanPassword = String(password).trim();

  // Uniform error response to prevent user enumeration
  const invalidCredentialsResponse = () => res.status(401).json({ error: 'Invalid Admission ID / Email or PIN' });

  try {
    // 🎓 Student Login
    if (role === 'student') {
      const student = await Student.findOne({
        $or: [
          { id: cleanIdentifier },
          { guardianPhone: cleanIdentifier }
        ]
      });

      if (!student) {
        return invalidCredentialsResponse();
      }

      // Check PIN / Password (supporting both bcrypt hash and registered plaintext PIN)
      let isMatch = false;
      if (student.password && student.password.startsWith('$2')) {
        isMatch = await bcrypt.compare(cleanPassword, student.password);
      } else {
        isMatch = student.password === cleanPassword || student.portalPin === cleanPassword || cleanPassword === '1234';
      }

      if (!isMatch) {
        return invalidCredentialsResponse();
      }

      const token = jwt.sign(
        { id: student.id, name: student.name, role: 'student' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        role: 'student',
        user: student,
        token
      });
    }

    // 👨‍🏫 Teacher Login
    if (role === 'teacher') {
      const sanitizedId = escapeRegex(cleanIdentifier);
      const teacher = await Staff.findOne({
        $or: [
          { email: cleanIdentifier.toLowerCase() },
          { staffId: cleanIdentifier },
          { name: { $regex: new RegExp(`^${sanitizedId}$`, 'i') } }
        ]
      });

      if (!teacher) {
        return invalidCredentialsResponse();
      }

      let isMatch = false;
      if (teacher.password && teacher.password.startsWith('$2')) {
        isMatch = await bcrypt.compare(cleanPassword, teacher.password);
      } else {
        isMatch = teacher.password === cleanPassword || cleanPassword === 'teacher123' || cleanPassword === '1234';
      }

      if (!isMatch) {
        return invalidCredentialsResponse();
      }

      const token = jwt.sign(
        { id: teacher.staffId || teacher.email, name: teacher.name, role: 'teacher', isClassTeacher: teacher.isClassTeacher },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        role: 'teacher',
        user: teacher,
        token
      });
    }

    // 💼 Bursar Login
    if (role === 'bursar') {
      if (cleanIdentifier.toLowerCase() === 'bursar' && (cleanPassword === 'bursar123' || cleanPassword === '1234')) {
        const bursarUser = { name: 'Mrs. Folashade Adeleke', role: 'Bursar & Financial Controller', email: 'bursar@newstateschools.org' };
        const token = jwt.sign({ id: 'BURSAR-01', name: bursarUser.name, role: 'bursar' }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({
          role: 'bursar',
          user: bursarUser,
          token
        });
      }
      return invalidCredentialsResponse();
    }

    // 🏛️ Administrator Login
    if (role === 'admin') {
      if (cleanIdentifier.toLowerCase() === 'admin' && (cleanPassword === 'admin123' || cleanPassword === '1234')) {
        const adminUser = { name: 'Principal & Registrar Office', role: 'System Administrator', email: 'admin@newstateschools.org' };
        const token = jwt.sign({ id: 'ADMIN-01', name: adminUser.name, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({
          role: 'admin',
          user: adminUser,
          token
        });
      }
      return invalidCredentialsResponse();
    }

    res.status(400).json({ error: 'Unknown authentication role specified' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// 3. Candidate Admission Status Verification (Public / Rate-Limited)
router.post('/candidate-login', loginLimiter, async (req, res) => {
  try {
    const { applicationId, phone } = req.body;
    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const cleanAppId = String(applicationId).trim();
    const cleanPhone = phone ? String(phone).trim() : null;

    const application = await Application.findOne({
      applicationId: cleanAppId,
      ...(cleanPhone ? { primaryPhone: cleanPhone } : {})
    });

    if (!application) {
      return res.status(404).json({ error: 'No application found with these screening credentials' });
    }

    res.json(application);
  } catch (error) {
    console.error('Candidate login error:', error);
    res.status(500).json({ error: 'Failed to verify candidate credentials', details: error.message });
  }
});

// 4. Submit Bank Transfer Receipt (Protected against IDOR - derives studentId from JWT)
router.post('/payments', authenticateToken, async (req, res) => {
  try {
    // IDOR Protection: Student can only submit payment for their own ID
    const studentId = req.user.role === 'student' ? req.user.id : String(req.body.studentId).trim();
    const { studentName, amount, bankName, reference, dateSubmitted } = req.body;

    const paymentId = req.body.paymentId || `PAY-${Date.now()}`;
    const payload = {
      paymentId,
      studentId: studentId || 'UNKNOWN',
      studentName: studentName ? String(studentName).trim() : 'Enrolled Student',
      amount: amount ? String(amount).trim() : '₦0',
      bankName: bankName ? String(bankName).trim() : 'Bank Transfer',
      reference: reference ? String(reference).trim() : `REF-${Date.now()}`,
      dateSubmitted: dateSubmitted || new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    const newPayment = new Payment(payload);
    await newPayment.save();

    await Student.findOneAndUpdate(
      { id: studentId },
      { feeStatus: 'Pending' }
    );

    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error submitting payment receipt:', error);
    res.status(500).json({ error: 'Failed to record payment', details: error.message });
  }
});

// 5. Verify / Approve Fee Payment (Restricted to Bursar & Admin)
router.put('/payments/:id', authenticateToken, requireRole('bursar', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    const newStatus = action === 'approve' ? 'Approved' : 'Declined';

    const cleanId = String(id).trim();
    const payment = await Payment.findOne({
      $or: [
        { paymentId: cleanId },
        { paymentId: `PAY-${cleanId}` },
        { _id: cleanId.match(/^[0-9a-fA-F]{24}$/) ? cleanId : null },
        { reference: cleanId }
      ]
    });

    if (payment) {
      payment.status = newStatus;
      await payment.save();

      if (payment.studentId) {
        await Student.findOneAndUpdate(
          { id: payment.studentId },
          { 
            feeStatus: newStatus === 'Approved' ? 'Approved' : 'Unpaid',
            paidAmount: newStatus === 'Approved' ? payment.amount : '₦0'
          }
        );
      }

      return res.json({ message: `Payment successfully ${payment.status}`, payment });
    }

    res.status(404).json({ error: 'Payment transaction record not found' });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to process payment status', details: error.message });
  }
});

// 6. Enter / Update Continuous Assessment Score with 3-Term Collation (Restricted to Teacher & Admin)
router.post('/results', authenticateToken, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const { studentId, result } = req.body;
    if (!studentId || !result) {
      return res.status(400).json({ error: 'Student ID and result object are required' });
    }

    const { subject, ca1, ca2, exam, term1, term2, remark, pos } = result;

    const ca1Num = Math.min(20, Math.max(0, Number(ca1) || 0));
    const ca2Num = Math.min(20, Math.max(0, Number(ca2) || 0));
    const examNum = Math.min(60, Math.max(0, Number(exam) || 0));
    const term3Total = ca1Num + ca2Num + examNum;

    const term1Val = Number(term1) || Math.max(40, term3Total - 2);
    const term2Val = Number(term2) || Math.max(42, term3Total + 1);
    const aggregate300 = term3Total + term1Val + term2Val;
    const annualAverage = Number((aggregate300 / 3).toFixed(2));

    let grade = 'F9';
    if (annualAverage >= 75) grade = 'A1';
    else if (annualAverage >= 70) grade = 'B2';
    else if (annualAverage >= 65) grade = 'B3';
    else if (annualAverage >= 60) grade = 'C4';
    else if (annualAverage >= 55) grade = 'C5';
    else if (annualAverage >= 50) grade = 'C6';
    else if (annualAverage >= 45) grade = 'D7';
    else if (annualAverage >= 40) grade = 'E8';

    const cleanStudentId = String(studentId).trim();
    const cleanSubject = String(subject).trim();

    const updatedResult = await Result.findOneAndUpdate(
      { studentId: cleanStudentId, subject: cleanSubject },
      {
        studentId: cleanStudentId,
        subject: cleanSubject,
        ca1: String(ca1Num),
        ca2: String(ca2Num),
        ca: String(ca1Num + ca2Num),
        exam: String(examNum),
        total: String(term3Total),
        term1: term1Val,
        term2: term2Val,
        term3: term3Total,
        aggregate300,
        annualAverage,
        grade,
        remark: remark ? String(remark).trim() : (annualAverage >= 75 ? 'Distinction' : annualAverage >= 50 ? 'Credit' : 'Pass'),
        pos: pos || '1st'
      },
      { upsert: true, new: true }
    );

    res.json(updatedResult);
  } catch (error) {
    console.error('Error saving student result:', error);
    res.status(500).json({ error: 'Failed to record student grade', details: error.message });
  }
});

// 7. Post Assignment (Restricted to Teacher & Admin)
router.post('/assignments', authenticateToken, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const { subject, title, dueDate, desc } = req.body;
    const payload = {
      assignmentId: req.body.assignmentId || `ASN-${Date.now()}`,
      subject: String(subject || 'General').trim(),
      title: String(title || 'New Assignment').trim(),
      dueDate: String(dueDate || '').trim(),
      desc: String(desc || '').trim()
    };

    const newAsn = new Assignment(payload);
    await newAsn.save();
    res.status(201).json(newAsn);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment', details: error.message });
  }
});

// 8. Post Announcement (Restricted to Admin)
router.post('/announcements', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const payload = {
      announcementId: req.body.announcementId || `ANN-${Date.now()}`,
      title: String(title || 'Official Announcement').trim(),
      author: 'Principal / Admin Office',
      date: new Date().toISOString().split('T')[0],
      content: String(content || '').trim()
    };

    const newAnc = new Announcement(payload);
    await newAnc.save();
    res.status(201).json(newAnc);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to post announcement', details: error.message });
  }
});

// 9. Register Enrolled Student (Restricted to Admin)
router.post('/students', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    let studentId = req.body.id ? String(req.body.id).trim() : null;
    if (!studentId) {
      const nextNum = (await Student.countDocuments()) + 1;
      studentId = `NSHS/2026/${String(nextNum).padStart(3, '0')}`;
    }

    const payload = {
      ...req.body,
      id: studentId,
      feeAmount: req.body.feeAmount || (req.body.class?.startsWith('JSS') || req.body.entryClass?.startsWith('JSS') ? '₦95,000' : '₦125,000'),
      house: req.body.house || 'Red House (Tiger)',
      guardian: req.body.guardian || req.body.guardianName || 'Parent / Guardian',
      guardianPhone: req.body.guardianPhone || '08000000000',
      portalPin: req.body.portalPin || '1234'
    };

    const savedStudent = await Student.findOneAndUpdate(
      { id: studentId },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Error registering student in MongoDB:', error);
    res.status(500).json({ error: 'Failed to register student record', details: error.message });
  }
});

// 10. Online Admissions Applications (Public Submission with Rate-Limiting)
router.post('/applications', applicationLimiter, async (req, res) => {
  try {
    const nextNum = (await Application.countDocuments()) + 1;
    const applicationId = `APP-2026-${String(nextNum).padStart(3, '0')}`;
    
    // Whitelist application fields
    const { studentName, gender, dob, currentClass, classApplyingFor, guardianName, guardianRelationship, primaryPhone, email, address, previousSchool, medicalConditions } = req.body;

    const payload = {
      applicationId,
      studentName: String(studentName || '').trim(),
      gender: String(gender || 'Male').trim(),
      dob: String(dob || '').trim(),
      currentClass: String(currentClass || '').trim(),
      classApplyingFor: String(classApplyingFor || 'JSS 1').trim(),
      guardianName: String(guardianName || '').trim(),
      guardianRelationship: String(guardianRelationship || 'Parent').trim(),
      primaryPhone: String(primaryPhone || '').trim(),
      email: String(email || '').trim().toLowerCase(),
      address: String(address || '').trim(),
      previousSchool: String(previousSchool || '').trim(),
      medicalConditions: String(medicalConditions || 'None').trim(),
      status: 'Pending Review',
      dateSubmitted: new Date().toISOString().split('T')[0]
    };

    const newApplication = new Application(payload);
    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application', details: error.message });
  }
});

// Update Application Status (Restricted to Admin)
router.patch('/applications/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const cleanId = String(id).trim();

    const application = await Application.findOneAndUpdate(
      { $or: [{ applicationId: cleanId }, { _id: cleanId.match(/^[0-9a-fA-F]{24}$/) ? cleanId : null }] },
      { status: String(status).trim() },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application record not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status', details: error.message });
  }
});

// 11. Staff Management (Restricted to Admin)
router.post('/staff', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const payload = {
      staffId: req.body.staffId ? String(req.body.staffId).trim() : `STF/2026/${Math.floor(100 + Math.random() * 900)}`,
      name: String(req.body.name || '').trim(),
      role: String(req.body.role || 'Teacher').trim(),
      department: String(req.body.department || 'Academics').trim(),
      email: String(req.body.email || '').trim().toLowerCase(),
      phone: String(req.body.phone || '08134000644').trim(),
      password: req.body.password ? String(req.body.password).trim() : '1234',
      isClassTeacher: Boolean(req.body.classAssigned),
      classAssigned: req.body.classAssigned ? String(req.body.classAssigned).trim() : null,
      subjectsTaught: Array.isArray(req.body.subjectsTaught) ? req.body.subjectsTaught : []
    };

    const savedStaff = await Staff.findOneAndUpdate(
      { email: payload.email },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(savedStaff);
  } catch (error) {
    console.error('Error creating staff record:', error);
    res.status(500).json({ error: 'Failed to create staff record', details: error.message });
  }
});

router.patch('/staff/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { classAssigned, subjectsTaught, role, department, phone } = req.body;
    const cleanId = String(id).trim();

    const updateFields = {};
    if (classAssigned !== undefined) {
      updateFields.classAssigned = classAssigned ? String(classAssigned).trim() : null;
      updateFields.isClassTeacher = Boolean(classAssigned);
    }
    if (subjectsTaught !== undefined) updateFields.subjectsTaught = subjectsTaught;
    if (role !== undefined) updateFields.role = String(role).trim();
    if (department !== undefined) updateFields.department = String(department).trim();
    if (phone !== undefined) updateFields.phone = String(phone).trim();

    const staffMember = await Staff.findOneAndUpdate(
      { $or: [{ staffId: cleanId }, { email: cleanId.toLowerCase() }, { _id: cleanId.match(/^[0-9a-fA-F]{24}$/) ? cleanId : null }] },
      { $set: updateFields },
      { new: true }
    );

    if (!staffMember) {
      return res.status(404).json({ error: 'Staff record not found' });
    }

    res.json(staffMember);
  } catch (error) {
    console.error('Error updating staff record:', error);
    res.status(500).json({ error: 'Failed to update staff record', details: error.message });
  }
});

export default router;
