import express from 'express';
import Student from '../models/Student.js';
import Result from '../models/Result.js';
import Assignment from '../models/Assignment.js';
import Payment from '../models/Payment.js';
import Announcement from '../models/Announcement.js';
import Staff from '../models/Staff.js';

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

    // Normalize IDs so frontend works seamlessly with either .id or .announcementId
    const announcements = rawAnnouncements.map(a => ({
      ...a.toObject(),
      id: a.announcementId || a._id.toString()
    }));

    const assignments = rawAssignments.map(a => ({
      ...a.toObject(),
      id: a.assignmentId || a._id.toString()
    }));

    const feePayments = rawFeePayments.map(p => ({
      ...p.toObject(),
      id: p.paymentId || p._id.toString()
    }));

    res.json({
      sessionInfo,
      students,
      results,
      timetable,
      assignments,
      learningMaterials,
      feePayments,
      announcements,
      staff
    });
  } catch (error) {
    console.error('Error fetching portal data:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// 2. ID-Based Authentication Login
router.post('/login', async (req, res) => {
  const { identifier, password, role } = req.body;
  
  if (!identifier) {
    return res.status(400).json({ error: 'Identifier is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password / PIN is required' });
  }

  try {
    if (role === 'student') {
      const student = await Student.findOne({ id: identifier.trim() });
      if (student) {
        if (student.password === password) {
          return res.json({ success: true, user: student });
        }
        return res.status(401).json({ error: 'Incorrect Password / PIN.' });
      }
      return res.status(404).json({ error: 'Invalid Student ID. Record not found.' });
    } else {
      // Find staff by email or name (case-insensitive)
      const staffMember = await Staff.findOne({
        $or: [
          { email: identifier.toLowerCase().trim() },
          { name: { $regex: new RegExp('^' + identifier.trim() + '$', 'i') } }
        ]
      });

      if (staffMember) {
        if (staffMember.password === password) {
          return res.json({ success: true, user: staffMember });
        }
        return res.status(401).json({ error: 'Incorrect Password / PIN.' });
      }
      return res.status(404).json({ error: 'Invalid staff username/email.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server authentication failed' });
  }
});

// 3. Post tuition fee receipt (Student)
router.post('/payments', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      paymentId: req.body.paymentId || req.body.id || `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      reference: req.body.reference || `REF-${Date.now()}`,
      dateSubmitted: req.body.dateSubmitted || new Date().toISOString().split('T')[0],
      status: req.body.status || 'Pending'
    };

    const newPayment = new Payment(payload);
    await newPayment.save();

    // Mark student feeStatus as Pending
    await Student.findOneAndUpdate(
      { id: req.body.studentId },
      { feeStatus: 'Pending' }
    );

    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error posting payment:', error);
    res.status(500).json({ error: 'Failed to record payment', details: error.message });
  }
});

// 4. Approve/Decline tuition receipt (Bursar)
router.put('/payments/:id', async (req, res) => {
  const { action } = req.body; // 'approve' or 'reject'
  const status = action === 'approve' ? 'Approved' : 'Declined';

  try {
    const payment = await Payment.findOneAndUpdate(
      { $or: [{ paymentId: req.params.id }, { _id: req.params.id }] },
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (action === 'approve') {
      await Student.findOneAndUpdate(
        { id: payment.studentId },
        { feeStatus: 'Approved', paidAmount: payment.amount }
      );
    } else {
      await Student.findOneAndUpdate(
        { id: payment.studentId },
        { feeStatus: 'Unpaid' }
      );
    }

    res.json(payment);
  } catch (error) {
    console.error('Error modifying payment status:', error);
    res.status(500).json({ error: 'Update processing failed' });
  }
});

// 5. Save Score / Report card result (Teacher)
router.post('/results', async (req, res) => {
  const { studentId, result, teacherId } = req.body;
  
  if (!studentId || !result || !result.subject) {
    return res.status(400).json({ error: 'studentId and result with subject are required' });
  }

  try {
    // Enforce teacher permissions
    if (teacherId) {
      const teacher = await Staff.findById(teacherId);
      if (teacher) {
        const student = await Student.findOne({ id: studentId });
        if (student) {
          const isClassTeacher = teacher.classAssigned === student.class;
          const teachesSubject = (teacher.subjectsTaught || []).some(
            (s) => s.subjectName === result.subject && s.className === student.class
          );
          if (!isClassTeacher && !teachesSubject) {
            return res.status(403).json({ error: 'You do not have permission to grade this subject for this student.' });
          }
        }
      }
    }

    const ca1 = Number(result.ca1) || 0;
    const ca2 = Number(result.ca2) || 0;
    const exam = Number(result.exam) || 0;
    const total = ca1 + ca2 + exam;

    let grade = result.grade;
    if (!grade) {
      if (total >= 75) grade = 'A1';
      else if (total >= 70) grade = 'B2';
      else if (total >= 65) grade = 'B3';
      else if (total >= 60) grade = 'C4';
      else if (total >= 55) grade = 'C5';
      else if (total >= 50) grade = 'C6';
      else if (total >= 45) grade = 'D7';
      else if (total >= 40) grade = 'E8';
      else grade = 'F9';
    }

    const query = { studentId, subject: result.subject };
    const update = {
      studentId,
      subject: result.subject,
      ca1,
      ca2,
      exam,
      total,
      grade,
      remark: result.remark || 'Satisfactory'
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const savedResult = await Result.findOneAndUpdate(query, update, options);
    res.status(201).json(savedResult);
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to record student score', details: error.message });
  }
});

// 6. Create Homework Assignment (Teacher)
router.post('/assignments', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      assignmentId: req.body.assignmentId || req.body.id || `ASN-${Math.floor(100 + Math.random() * 900)}`
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
    const nextNum = (await Student.countDocuments()) + 1;
    const defaultId = `NSHS/2026/00${nextNum}`;
    const payload = {
      ...req.body,
      id: req.body.id || defaultId,
      password: req.body.password || '1234'
    };

    const newStudent = new Student(payload);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ error: 'Failed to register student record', details: error.message });
  }
});

export default router;
