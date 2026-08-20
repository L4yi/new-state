import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Student from '../models/Student.js';
import Result from '../models/Result.js';
import Assignment from '../models/Assignment.js';
import Payment from '../models/Payment.js';
import Announcement from '../models/Announcement.js';
import Staff from '../models/Staff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function runTests() {
  const uri = process.env.MONGODB_URI;
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('Connected successfully!\n');

  const report = {};

  // 1. Test Announcement
  try {
    const testAnn = new Announcement({
      announcementId: `ANN-TEST-${Date.now()}`,
      title: 'Test Announcement Title',
      author: 'Principal Test',
      date: '2026-08-20',
      content: 'This is a test announcement verifying live DB persistence.'
    });
    const savedAnn = await testAnn.save();
    const fetchedAnn = await Announcement.findOne({ announcementId: savedAnn.announcementId });
    report.Announcements = fetchedAnn ? 'PASSED (Accepts & Persists Data)' : 'FAILED';
    await Announcement.deleteOne({ announcementId: savedAnn.announcementId });
  } catch (e) {
    report.Announcements = `ERROR: ${e.message}`;
  }

  // 2. Test Student
  try {
    const testStdId = `NSHS-TEST-${Date.now()}`;
    const testStd = new Student({
      id: testStdId,
      name: 'TEST STUDENT BIO',
      gender: 'Male',
      class: 'JSS 1',
      house: 'Red House (Tiger)',
      guardian: 'Mr. Tester',
      guardianPhone: '08000000000',
      feeStatus: 'Unpaid',
      feeAmount: '₦95,000',
      stateOfOrigin: 'Lagos',
      lga: 'Mushin'
    });
    const savedStd = await testStd.save();
    const fetchedStd = await Student.findOne({ id: testStdId });
    report.Students = fetchedStd ? 'PASSED (Accepts & Persists Data)' : 'FAILED';
    await Student.deleteOne({ id: testStdId });
  } catch (e) {
    report.Students = `ERROR: ${e.message}`;
  }

  // 3. Test Result
  try {
    const testRes = new Result({
      studentId: 'NSHS/2024/001',
      subject: 'Agricultural Science',
      ca1: 19,
      ca2: 18,
      exam: 55,
      total: 92,
      grade: 'A1',
      remark: 'Outstanding Test'
    });
    const savedRes = await testRes.save();
    const fetchedRes = await Result.findOne({ studentId: 'NSHS/2024/001', subject: 'Agricultural Science' });
    report.Results = fetchedRes ? 'PASSED (Accepts & Persists Data)' : 'FAILED';
    await Result.deleteOne({ _id: savedRes._id });
  } catch (e) {
    report.Results = `ERROR: ${e.message}`;
  }

  // 4. Test Assignment
  try {
    const testAsnId = `ASN-TEST-${Date.now()}`;
    const testAsn = new Assignment({
      assignmentId: testAsnId,
      subject: 'Physics',
      title: 'Test Assignment',
      dueDate: '2026-08-30',
      desc: 'Test description for assignment persistence'
    });
    const savedAsn = await testAsn.save();
    const fetchedAsn = await Assignment.findOne({ assignmentId: testAsnId });
    report.Assignments = fetchedAsn ? 'PASSED (Accepts & Persists Data)' : 'FAILED';
    await Assignment.deleteOne({ assignmentId: testAsnId });
  } catch (e) {
    report.Assignments = `ERROR: ${e.message}`;
  }

  // 5. Test Payment
  try {
    const testPayId = `PAY-TEST-${Date.now()}`;
    const testPay = new Payment({
      paymentId: testPayId,
      studentId: 'NSHS/2024/003',
      studentName: 'Babatunde Ogunlesi',
      amount: '₦95,000',
      bankName: 'First Bank Nigeria',
      reference: `REF-TEST-${Date.now()}`,
      dateSubmitted: '2026-08-20',
      status: 'Pending'
    });
    const savedPay = await testPay.save();
    const fetchedPay = await Payment.findOne({ paymentId: testPayId });
    report.Payments = fetchedPay ? 'PASSED (Accepts & Persists Data)' : 'FAILED';
    await Payment.deleteOne({ paymentId: testPayId });
  } catch (e) {
    report.Payments = `ERROR: ${e.message}`;
  }

  // 6. Test Staff
  try {
    const staffCount = await Staff.countDocuments();
    report.Staff = staffCount > 0 ? `PASSED (${staffCount} Active Accounts)` : 'EMPTY';
  } catch (e) {
    report.Staff = `ERROR: ${e.message}`;
  }

  console.log('=== MONGODB ATLAS COLLECTION AUDIT REPORT ===');
  console.log(JSON.stringify(report, null, 2));

  await mongoose.connection.close();
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
