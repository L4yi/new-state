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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const studentsData = [
  {
    id: 'NSHS/2024/001',
    name: 'Adewale Johnson',
    gender: 'Male',
    class: 'SSS 3 (Science)',
    house: 'Red House',
    guardian: 'Mr. & Mrs. Johnson',
    guardianPhone: '0802 123 4567',
    feeStatus: 'Approved',
    feeAmount: '₦125,000',
    paidAmount: '₦125,000',
    password: '1234'
  },
  {
    id: 'NSHS/2024/002',
    name: 'Chidimma Okonkwo',
    gender: 'Female',
    class: 'SSS 3 (Science)',
    house: 'Blue House',
    guardian: 'Chief Okonkwo',
    guardianPhone: '0803 987 6543',
    feeStatus: 'Pending',
    feeAmount: '₦125,000',
    paidAmount: '₦125,000',
    password: '1234'
  },
  {
    id: 'NSHS/2024/003',
    name: 'Babatunde Ogunlesi',
    gender: 'Male',
    class: 'JSS 2',
    house: 'Yellow House',
    guardian: 'Mrs. Ogunlesi',
    guardianPhone: '0813 400 0644',
    feeStatus: 'Unpaid',
    feeAmount: '₦95,000',
    paidAmount: '₦0',
    password: '1234'
  }
];

const resultsData = [
  { studentId: 'NSHS/2024/001', subject: 'Mathematics', ca1: 18, ca2: 19, exam: 58, total: 95, grade: 'A1', remark: 'Excellent' },
  { studentId: 'NSHS/2024/001', subject: 'English Language', ca1: 16, ca2: 17, exam: 52, total: 85, grade: 'A1', remark: 'Very Good' },
  { studentId: 'NSHS/2024/001', subject: 'Physics', ca1: 17, ca2: 18, exam: 54, total: 89, grade: 'A1', remark: 'Outstanding' },
  { studentId: 'NSHS/2024/001', subject: 'Chemistry', ca1: 15, ca2: 16, exam: 49, total: 80, grade: 'A1', remark: 'Great Effort' },
  { studentId: 'NSHS/2024/001', subject: 'Biology', ca1: 18, ca2: 16, exam: 50, total: 84, grade: 'A1', remark: 'Commendable' },
  { studentId: 'NSHS/2024/001', subject: 'Computer Studies (AI & Coding)', ca1: 20, ca2: 19, exam: 59, total: 98, grade: 'A1', remark: 'Distinction' },
  
  { studentId: 'NSHS/2024/002', subject: 'Mathematics', ca1: 15, ca2: 14, exam: 48, total: 77, grade: 'B2', remark: 'Good' },
  { studentId: 'NSHS/2024/002', subject: 'English Language', ca1: 18, ca2: 18, exam: 55, total: 91, grade: 'A1', remark: 'Excellent' },
  { studentId: 'NSHS/2024/002', subject: 'Physics', ca1: 14, ca2: 15, exam: 42, total: 71, grade: 'B3', remark: 'Good' },
  { studentId: 'NSHS/2024/002', subject: 'Chemistry', ca1: 16, ca2: 16, exam: 48, total: 80, grade: 'A1', remark: 'Very Good' },
  { studentId: 'NSHS/2024/002', subject: 'Biology', ca1: 17, ca2: 17, exam: 51, total: 85, grade: 'A1', remark: 'Great Work' }
];

const assignmentsData = [
  {
    assignmentId: 'ASN01',
    subject: 'Computer Studies (AI Coding)',
    title: 'Python Quadratic Equation Solver Script',
    dueDate: '2026-08-25',
    desc: 'Write a Python program that accepts coefficients a, b, c and prints real roots.'
  },
  {
    assignmentId: 'ASN02',
    subject: 'Physics',
    title: 'Newtonian Mechanics Problem Set 4',
    dueDate: '2026-08-22',
    desc: 'Complete problems 1 to 10 on projectile motion from textbook page 142.'
  }
];

const announcementsData = [
  {
    announcementId: 'ANN-01',
    title: 'Inter-House Sports Competition Date Announced',
    author: 'Vice Principal (Student Life)',
    date: '2026-08-17',
    content: 'The annual New State High School Inter-House sports competition will hold on October 15th at the main sports pavilion.'
  },
  {
    announcementId: 'ANN-02',
    title: 'First Term Mid-Term Assessment Schedule',
    author: 'Academic Directorate',
    date: '2026-08-14',
    content: 'Mid-term examinations for all JSS and SSS students commence on September 28th. Ensure all fee receipts are cleared.'
  }
];

const paymentsData = [
  {
    paymentId: 'PAY-1092',
    studentId: 'NSHS/2024/002',
    studentName: 'Chidimma Okonkwo',
    amount: '₦125,000',
    bankName: 'First Bank Nigeria',
    reference: 'TRX-98230192',
    dateSubmitted: '2026-08-18',
    status: 'Pending'
  },
  {
    paymentId: 'PAY-1088',
    studentId: 'NSHS/2024/001',
    studentName: 'Adewale Johnson',
    amount: '₦125,000',
    bankName: 'Guaranty Trust Bank',
    reference: 'GTB-44120934',
    dateSubmitted: '2026-08-15',
    status: 'Approved'
  }
];

const staffData = [
  {
    name: 'Dr. O. A. Adeleke',
    role: 'Principal',
    department: 'Administration',
    email: 'principal@newstateschools.org',
    password: '1234',
    classAssigned: null,
    subjectsTaught: [
      { subjectName: 'Biology', className: 'SSS 3 (Science)' }
    ]
  },
  {
    name: 'Mr. Babatunde Ogunlesi',
    role: 'Head of Science',
    department: 'Physics & Math',
    email: 'science@newstateschools.org',
    password: '1234',
    classAssigned: 'SSS 3 (Science)',
    subjectsTaught: [
      { subjectName: 'Mathematics', className: 'SSS 3 (Science)' },
      { subjectName: 'Physics', className: 'SSS 3 (Science)' },
      { subjectName: 'Mathematics', className: 'JSS 2' }
    ]
  },
  {
    name: 'Mrs. Folashade Adebayo',
    role: 'Bursar',
    department: 'Finance & Accounts',
    email: 'bursar@newstateschools.org',
    password: '1234',
    classAssigned: null,
    subjectsTaught: []
  },
  {
    name: 'Principal Admin',
    role: 'Principal',
    department: 'Administration',
    email: 'admin',
    password: '1234',
    classAssigned: null,
    subjectsTaught: []
  },
  {
    name: 'Bursar Office',
    role: 'Bursar',
    department: 'Finance & Accounts',
    email: 'bursar',
    password: '1234',
    classAssigned: null,
    subjectsTaught: []
  }
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newstate';
  console.log('Connecting to database:', uri);
  
  try {
    await mongoose.connect(uri);
    console.log('MongoDB Connected successfully!');

    // Clear existing data
    try {
      await Student.collection.dropIndexes();
      await Staff.collection.dropIndexes();
    } catch (e) {
      // Ignore index drop failures
    }
    await Student.deleteMany({});
    await Result.deleteMany({});
    await Assignment.deleteMany({});
    await Payment.deleteMany({});
    await Announcement.deleteMany({});
    await Staff.deleteMany({});
    console.log('Cleared old documents and dropped old indexes.');

    // Insert new data
    await Student.insertMany(studentsData);
    await Result.insertMany(resultsData);
    await Assignment.insertMany(assignmentsData);
    await Payment.insertMany(paymentsData);
    await Announcement.insertMany(announcementsData);
    await Staff.insertMany(staffData);
    console.log('Database successfully seeded with core data.');
    
    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
