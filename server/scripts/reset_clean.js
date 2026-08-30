import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Models
import Student from '../models/Student.js';
import Result from '../models/Result.js';
import Assignment from '../models/Assignment.js';
import Payment from '../models/Payment.js';
import Announcement from '../models/Announcement.js';
import Staff from '../models/Staff.js';
import Application from '../models/Application.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// 1. Fresh Brand-New Student (Unpaid, No submitted scores, ready for demo)
const freshStudents = [
  {
    id: 'NSHS/2026/001',
    name: 'Oluwaseun Adeleke',
    gender: 'Male',
    class: 'SSS 3A',
    house: 'Red House',
    guardian: 'Chief & Mrs. Adeleke',
    guardianPhone: '0813 400 0644',
    feeStatus: 'Unpaid',
    feeAmount: '₦125,000',
    paidAmount: '₦0',
    password: '1234',
    age: 16,
    classSize: 42,
    position: 'Pending'
  }
];

// 2. Staff Accounts
const staffData = [
  {
    name: 'Mr. Babatunde Ogunlesi',
    staffId: 'TCH/PHYS/042',
    role: 'Senior Science Master & Form Master',
    department: 'Physical & Applied Sciences',
    email: 'babatunde.ogunlesi@newstateschools.org',
    password: '1234',
    classAssigned: 'SSS 3A', // Form Master for SSS 3A
    subjectsTaught: [
      { subjectName: 'Physics', className: 'SSS 3A' },
      { subjectName: 'Further Mathematics', className: 'SSS 3A' }
    ]
  },
  {
    name: 'Mrs. Folashade Adeleke',
    staffId: 'TCH/ENG/019',
    role: 'Language & Humanities Lead',
    department: 'Languages & Arts',
    email: 'folashade.adeleke@newstateschools.org',
    password: '1234',
    classAssigned: null,
    subjectsTaught: [
      { subjectName: 'English Language', className: 'SSS 3A' },
      { subjectName: 'Literature in English', className: 'SSS 3A' }
    ]
  },
  {
    name: 'Mrs. Ngozi Eze',
    staffId: 'TCH/BIO/028',
    role: 'Life Sciences Specialist',
    department: 'Natural Sciences',
    email: 'ngozi.eze@newstateschools.org',
    password: '1234',
    classAssigned: null,
    subjectsTaught: [
      { subjectName: 'Chemistry', className: 'SSS 3A' },
      { subjectName: 'Biology', className: 'SSS 3A' }
    ]
  },
  {
    name: 'Dr. O. A. Adeleke',
    staffId: 'ADMIN-01',
    role: 'Principal & Head of School',
    department: 'School Administration',
    email: 'admin@newstateschools.org',
    password: '1234',
    classAssigned: null,
    subjectsTaught: []
  },
  {
    name: 'Mrs. Folashade Adebayo',
    staffId: 'BURSAR-01',
    role: 'Bursar & Head of Finance',
    department: 'Bursary & Accounts',
    email: 'bursar@newstateschools.org',
    password: '1234',
    classAssigned: null,
    subjectsTaught: []
  }
];

// 3. Official Announcements
const announcementsData = [
  {
    announcementId: 'ANN-2026-01',
    title: 'Welcome to the 2026/2027 Academic Session',
    author: 'Principal Office',
    date: new Date().toISOString().split('T')[0],
    content: 'All students, parents, and academic staff are welcome to the new term. Ensure all academic tasks and fee clearances are concluded through the portal.'
  }
];

async function resetAndCleanDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas successfully.');

    // 1. Wipe previous student activity and collections
    await Student.deleteMany({});
    await Result.deleteMany({});
    await Assignment.deleteMany({});
    await Payment.deleteMany({});
    await Announcement.deleteMany({});
    await Staff.deleteMany({});
    try {
      if (Application) await Application.deleteMany({});
    } catch (e) {}

    console.log('All previous test results, receipts, applications, and student records deleted.');

    // 2. Insert fresh clean data
    await Student.insertMany(freshStudents);
    await Staff.insertMany(staffData);
    await Announcement.insertMany(announcementsData);

    console.log('Fresh clean database initialized:');
    console.log(' - 1 Fresh Student (Oluwaseun Adeleke - SSS 3A, Unpaid, Zero past scores)');
    console.log(' - 5 Staff Accounts (Admin, Form Master, Subject Teachers, Bursar)');
    console.log(' - 0 Fee Receipts (Ready for fresh upload and approval)');
    console.log(' - 0 Pending Applications (Ready for fresh online applications)');

    await mongoose.connection.close();
    console.log('Database reset complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting database:', err);
    process.exit(1);
  }
}

resetAndCleanDB();
