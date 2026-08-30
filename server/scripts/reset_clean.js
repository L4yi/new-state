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

// Staff Accounts (Teachers, Admin, and Bursar ONLY)
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

    // 1. Delete ALL student data, scores, assignments, payments, announcements, applications
    await Student.deleteMany({});
    await Result.deleteMany({});
    await Assignment.deleteMany({});
    await Payment.deleteMany({});
    await Announcement.deleteMany({});
    await Staff.deleteMany({});
    try {
      if (Application) await Application.deleteMany({});
    } catch (e) {}

    console.log('Cleared all students (0), results (0), assignments (0), payments (0), applications (0).');

    // 2. Insert ONLY Teachers, Admin, and Bursar staff accounts
    await Staff.insertMany(staffData);

    console.log('Database successfully initialized with Staff ONLY:');
    console.log(' - 0 Students in database');
    console.log(' - 0 Results/Scores in database');
    console.log(' - 0 Assignments in database');
    console.log(' - 0 Fee Receipts in database');
    console.log(' - 0 Online Applications in database');
    console.log(' - 5 Staff Accounts (Admin, Form Master, Subject Teachers, Bursar)');

    await mongoose.connection.close();
    console.log('Database reset complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting database:', err);
    process.exit(1);
  }
}

resetAndCleanDB();
