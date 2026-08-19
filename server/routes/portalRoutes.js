import express from 'express';
import Student from '../models/Student.js';
import Result from '../models/Result.js';
import Assignment from '../models/Assignment.js';
import Payment from '../models/Payment.js';
import Announcement from '../models/Announcement.js';

const router = express.Router();

// Static timetables & staff data to mirror frontend mock presets
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

const staff = [
  { name: 'Dr. O. A. Adeleke', role: 'Principal', department: 'Administration', email: 'principal@newstateschools.org' },
  { name: 'Mr. Babatunde Ogunlesi', role: 'Head of Science', department: 'Physics & Math', email: 'science@newstateschools.org' },
  { name: 'Mrs. Folashade Adebayo', role: 'Bursar', department: 'Finance & Accounts', email: 'bursar@newstateschools.org' },
];

// 1. Aggregated Portal Data Lookup
router.get('/data', async (req, res) => {
  try {
    const students = await Student.find({});
    const resultsList = await Result.find({});
    const assignments = await Assignment.find({}).sort({ createdAt: -1 });
    const feePayments = await Payment.find({}).sort({ createdAt: -1 });
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });

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
  const { identifier, role } = req.body;
  
  if (!identifier) {
    return res.status(400).json({ error: 'Identifier is required' });
  }

  try {
    if (role === 'student') {
      const student = await Student.findOne({ studentId: identifier });
      if (student) {
        return res.json({ success: true, user: student });
      }
      return res.status(404).json({ error: 'Invalid Student ID. Record not found.' });
    } else {
      // For staff, we match email from preset staff array
      const staffMember = staff.find(s => s.email.toLowerCase() === identifier.toLowerCase().trim() || s.name.toLowerCase() === identifier.toLowerCase().trim());
      if (staffMember) {
        return res.json({ success: true, user: staffMember });
      }
      // Or if it's admin/bursar general identifier
      if (role === 'admin' && identifier.toLowerCase() === 'admin') {
        return res.json({ success: true, user: { name: 'Principal Admin', role: 'Principal' } });
      }
      if (role === 'bursar' && identifier.toLowerCase() === 'bursar') {
        return res.json({ success: true, user: { name: 'Bursar Office', role: 'Bursar' } });
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
    const newPayment = new Payment(req.body);
    await newPayment.save();

    // Mark student feeStatus as Pending
    await Student.findOneAndUpdate(
      { studentId: req.body.studentId },
      { feeStatus: 'Pending' }
    );

    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error posting payment:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// 4. Approve/Decline tuition receipt (Bursar)
router.put('/payments/:id', async (req, res) => {
  const { action } = req.body; // 'approve' or 'reject'
  const status = action === 'approve' ? 'Approved' : 'Declined';

  try {
    const payment = await Payment.findOneAndUpdate(
      { paymentId: req.params.id },
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (action === 'approve') {
      await Student.findOneAndUpdate(
        { studentId: payment.studentId },
        { feeStatus: 'Approved', paidAmount: payment.amount }
      );
    } else {
      await Student.findOneAndUpdate(
        { studentId: payment.studentId },
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
  const { studentId, result } = req.body; // result: {subject, ca1, ca2, exam, total, grade, remark}
  
  try {
    // Check if score for this subject already exists, if so overwrite, else create
    const query = { studentId, subject: result.subject };
    const update = { ...result };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const savedResult = await Result.findOneAndUpdate(query, update, options);
    res.status(201).json(savedResult);
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to record student score' });
  }
});

// 6. Create Homework Assignment (Teacher)
router.post('/assignments', async (req, res) => {
  try {
    const newAsn = new Assignment(req.body);
    await newAsn.save();
    res.status(201).json(newAsn);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// 7. Post Announcement notice (Admin)
router.post('/announcements', async (req, res) => {
  try {
    const newAnc = new Announcement(req.body);
    await newAnc.save();
    res.status(201).json(newAnc);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to post announcement' });
  }
});

// 8. Register Student (Admin)
router.post('/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ error: 'Failed to register student record' });
  }
});

export default router;
