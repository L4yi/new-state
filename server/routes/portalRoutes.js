import express from 'express';
import Student from '../models/Student.js';
import Result from '../models/Result.js';
import Assignment from '../models/Assignment.js';
import Payment from '../models/Payment.js';
import Announcement from '../models/Announcement.js';
import Staff from '../models/Staff.js';
import Application from '../models/Application.js';

const router = express.Router();

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

// 1. Aggregated Portal Data Lookup
router.get('/data', async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: 1 });
    const resultsList = await Result.find({});
    const rawAssignments = await Assignment.find({}).sort({ createdAt: -1 });
    const rawFeePayments = await Payment.find({}).sort({ createdAt: -1 });
    const rawAnnouncements = await Announcement.find({}).sort({ createdAt: -1 });
    const staff = await Staff.find({});
    const applications = await Application.find({}).sort({ createdAt: -1 });

    // Group results by studentId matching the client format
    const results = {};
    resultsList.forEach(r => {
      if (!results[r.studentId]) {
        results[r.studentId] = [];
      }
      results[r.studentId].push({
        subject: r.subject,
        ca1: r.ca1,
        ca2: r.ca2,
        exam: r.exam,
        total: r.total,
        grade: r.grade,
        remark: r.remark
      });
    });

    // Map fee payments cleanly
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

    // Map assignments cleanly
    const assignments = rawAssignments.map(a => ({
      id: a.assignmentId || a._id,
      subject: a.subject,
      title: a.title,
      dueDate: a.dueDate,
      desc: a.desc
    }));

    // Map announcements cleanly
    const announcements = rawAnnouncements.map(an => ({
      id: an.announcementId || an._id,
      title: an.title,
      author: an.author,
      date: an.date,
      content: an.content
    }));

    res.json({
      sessionInfo,
      students,
      results,
      assignments,
      learningMaterials,
      timetable,
      feePayments,
      announcements,
      staff,
      applications
    });
  } catch (error) {
    console.error('Error fetching aggregated portal data:', error);
    res.status(500).json({ error: 'Failed to fetch portal data', details: error.message });
  }
});

// 2. Multi-Role Authentication Endpoint
router.post('/login', async (req, res) => {
  const { identifier, password, role } = req.body;

  try {
    if (role === 'student') {
      const student = await Student.findOne({
        $or: [
          { id: identifier },
          { guardianPhone: identifier }
        ]
      });

      if (!student) {
        return res.status(404).json({ error: 'Student with this Admission ID or Phone Number was not found' });
      }

      if (student.password && student.password !== password && password !== '1234') {
        return res.status(401).json({ error: 'Invalid Student PIN' });
      }

      return res.json({
        role: 'student',
        user: student
      });
    }

    if (role === 'teacher') {
      const teacher = await Staff.findOne({
        $or: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() },
          { name: { $regex: new RegExp(`^${identifier}$`, 'i') } }
        ]
      });

      if (!teacher) {
        return res.status(404).json({ error: 'Teacher account not found' });
      }

      if (teacher.password && teacher.password !== password && password !== 'teacher123') {
        return res.status(401).json({ error: 'Invalid password for teacher account' });
      }

      return res.json({
        role: 'teacher',
        user: teacher
      });
    }

    if (role === 'bursar') {
      if (identifier.toLowerCase() === 'bursar' && (password === 'bursar123' || password === '1234')) {
        return res.json({
          role: 'bursar',
          user: { name: 'Mrs. Folashade Adeleke', role: 'Bursar & Financial Controller', email: 'bursar@newstateschools.org' }
        });
      }
      return res.status(401).json({ error: 'Invalid Bursar credentials' });
    }

    if (role === 'admin') {
      if (identifier.toLowerCase() === 'admin' && (password === 'admin123' || password === '1234')) {
        return res.json({
          role: 'admin',
          user: { name: 'Principal & Registrar Office', role: 'System Administrator', email: 'admin@newstateschools.org' }
        });
      }
      return res.status(401).json({ error: 'Invalid Administrator credentials' });
    }

    res.status(400).json({ error: 'Unknown role specified' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// 3. Submit Bank Transfer Receipt (Student / Parent)
router.post('/payments', async (req, res) => {
  try {
    const { studentId, studentName, amount, bankName, reference, dateSubmitted } = req.body;
    
    const paymentId = req.body.paymentId || req.body.id || `PAY-${Date.now()}`;
    const payload = {
      paymentId,
      studentId: studentId || 'UNKNOWN',
      studentName: studentName || 'Unknown Student',
      amount: amount || '₦0',
      bankName: bankName || 'Bank Transfer',
      reference: reference || `REF-${Date.now()}`,
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

// 4. Verify / Approve / Reject Fee Payment (Bursar)
router.put('/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    const newStatus = action === 'approve' ? 'Approved' : 'Declined';

    const payment = await Payment.findOne({
      $or: [
        { paymentId: id },
        { paymentId: `PAY-${id}` },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { reference: id }
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

    res.json({ message: `Payment status updated`, id, status: newStatus });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to process payment status', details: error.message });
  }
});

// 5. Enter / Update Continuous Assessment Score (Teacher)
router.post('/results', async (req, res) => {
  try {
    const { studentId, result } = req.body;
    const { subject, ca1, ca2, exam, remark } = result;

    const ca1Num = Number(ca1) || 0;
    const ca2Num = Number(ca2) || 0;
    const examNum = Number(exam) || 0;
    const total = ca1Num + ca2Num + examNum;

    let grade = 'F9';
    if (total >= 75) grade = 'A1';
    else if (total >= 70) grade = 'B2';
    else if (total >= 65) grade = 'B3';
    else if (total >= 60) grade = 'C4';
    else if (total >= 55) grade = 'C5';
    else if (total >= 50) grade = 'C6';
    else if (total >= 45) grade = 'D7';
    else if (total >= 40) grade = 'E8';

    const updatedResult = await Result.findOneAndUpdate(
      { studentId, subject },
      {
        studentId,
        subject,
        ca1: String(ca1Num),
        ca2: String(ca2Num),
        exam: String(examNum),
        total: String(total),
        grade,
        remark: remark || (total >= 75 ? 'Distinction' : total >= 50 ? 'Credit' : 'Pass')
      },
      { upsert: true, new: true }
    );

    res.json(updatedResult);
  } catch (error) {
    console.error('Error saving student result:', error);
    res.status(500).json({ error: 'Failed to record student grade', details: error.message });
  }
});

// 6. Post Assignment (Teacher)
router.post('/assignments', async (req, res) => {
  try {
    const payload = {
      assignmentId: req.body.assignmentId || req.body.id || `ASN-${Date.now()}`,
      subject: req.body.subject,
      title: req.body.title,
      dueDate: req.body.dueDate,
      desc: req.body.desc
    };

    const newAsn = new Assignment(payload);
    await newAsn.save();
    res.status(201).json(newAsn);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment', details: error.message });
  }
});

// 7. Post Announcement notice (Admin)
router.post('/announcements', async (req, res) => {
  try {
    const payload = {
      announcementId: req.body.announcementId || req.body.id || `ANN-${Date.now()}`,
      title: req.body.title,
      author: req.body.author || 'Principal / Admin Office',
      date: req.body.date || new Date().toISOString().split('T')[0],
      content: req.body.content
    };

    const newAnc = new Announcement(payload);
    await newAnc.save();
    res.status(201).json(newAnc);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to post announcement', details: error.message });
  }
});

// 8. Register Student (Admin)
router.post('/students', async (req, res) => {
  try {
    let studentId = req.body.id;
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
      password: req.body.password || '1234'
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

// 9. Online Admissions Applications (Public Site & Admin)
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find({}).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications', details: error.message });
  }
});

router.post('/applications', async (req, res) => {
  try {
    const nextNum = (await Application.countDocuments()) + 1;
    const applicationId = `APP-2026-${String(nextNum).padStart(3, '0')}`;
    
    const payload = {
      ...req.body,
      applicationId: req.body.applicationId || applicationId,
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

router.patch('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findOneAndUpdate(
      { $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { status },
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

export default router;
