import React, { useState } from 'react';
import {
  Search, Megaphone, UserPlus, Shield, CheckCircle2, Database, Send, Users, User,
  Award, Calendar, Phone, Mail, MapPin, HeartPulse, CreditCard, Sparkles, Printer, FileText, ChevronDown,
  Building2, Hash, IdCard, MessageSquare, CheckSquare, GraduationCap, BookOpen, FileCheck,
  KeyRound, RefreshCw, Copy, Check, ShieldCheck, QrCode, Inbox, ArrowRight, XCircle, Clock
} from 'lucide-react';

// Generates a clean, cryptographically random, unambiguous 6-character alphanumeric PIN
const generateRandomPin = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let pin = '';
  for (let i = 0; i < 6; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pin;
};

export default function AdminDashboard({ data, onAddAnnouncement, onAddStudent, onUpdateApplication }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('applications'); // 'applications', 'database', 'register', 'announcements'
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const [noticeMsg, setNoticeMsg] = useState('');
  const [registeredStudentSlip, setRegisteredStudentSlip] = useState(null);
  const [copiedPin, setCopiedPin] = useState(false);
  const [selectedApplicationForReview, setSelectedApplicationForReview] = useState(null);

  // Intricate Student Registration Form State with Internal Entrance Criteria
  const [studentForm, setStudentForm] = useState({
    surname: '',
    firstName: '',
    middleName: '',
    gender: 'Male',
    dob: '2010-05-15',
    ninOrLasrra: '',
    stateOfOrigin: 'Lagos',
    lga: 'Mushin',
    nationality: 'Nigerian',
    bloodGroup: 'O+',
    genotype: 'AA',
    religion: 'Christianity',
    admissionCriteria: 'Internal Entrance Examination',
    entranceExamScore: '84%',
    entranceExamRegNo: 'NSHS/EXAM/2026/084',
    priorClass: 'Primary 6',
    entryClass: 'JSS 1',
    classArm: 'Arm A (Diamond)',
    academicTrack: 'Junior Secondary Foundation',
    house: 'Red House (Tiger)',
    boardingStatus: 'Day Student',
    previousSchool: 'Crown Model Primary School, Palm Avenue',
    medicalConditions: 'None',
    guardianName: '',
    guardianRelationship: 'Father',
    guardianPhone: '',
    guardianEmail: '',
    fatherOccupation: 'Civil Servant / Business Executive',
    motherName: '',
    motherOccupation: 'Educationist / Trader',
    motherPhone: '',
    guardianAddress: '36 Palm Avenue, Mushin, Lagos',
    emergencyContact: '',
    emergencyPhone: '',
    whatsappAlertsEnabled: true,
    feeStatus: 'Unpaid',
    initialDeposit: '0',
    portalPin: generateRandomPin(),
  });

  const studentsList = data?.students || [];
  const filteredStudents = studentsList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.guardian && s.guardian.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fallback sample applications if none submitted yet
  const defaultApplications = [
    {
      applicationId: 'APP-2026-081',
      studentName: 'Chukwuemeka David Adebayo',
      gender: 'Male',
      dob: '2011-04-12',
      currentClass: 'Primary 6',
      classApplyingFor: 'JSS 1',
      guardianName: 'Dr. Emeka Adebayo',
      guardianRelationship: 'Father',
      primaryPhone: '0803 456 7890',
      email: 'emeka.adebayo@gmail.com',
      address: '14 Palm Avenue, Mushin, Lagos',
      previousSchool: 'St. Jude Model Primary School, Lagos',
      medicalConditions: 'None',
      status: 'Pending Review',
      dateSubmitted: '2026-08-19'
    },
    {
      applicationId: 'APP-2026-082',
      studentName: 'Amina Fatima Bello',
      gender: 'Female',
      dob: '2010-09-24',
      currentClass: 'JSS 3',
      classApplyingFor: 'SSS 1 (Science)',
      guardianName: 'Alhaji Ibrahim Bello',
      guardianRelationship: 'Father',
      primaryPhone: '0802 345 6789',
      email: 'ibrahim.bello@yahoo.com',
      address: '22 Agege Motor Road, Mushin, Lagos',
      previousSchool: 'Federal Government College, Lagos',
      medicalConditions: 'Asthmatic (Mild)',
      status: 'Pending Review',
      dateSubmitted: '2026-08-20'
    },
    {
      applicationId: 'APP-2026-083',
      studentName: 'Blessing Chioma Okafor',
      gender: 'Female',
      dob: '2011-02-18',
      currentClass: 'Primary 6',
      classApplyingFor: 'JSS 1',
      guardianName: 'Mrs. Nkechi Okafor',
      guardianRelationship: 'Mother',
      primaryPhone: '0813 987 6543',
      email: 'nkechi.okafor@outlook.com',
      address: '5 Olateju Street, Mushin, Lagos',
      previousSchool: 'Grace Children School, Lagos',
      medicalConditions: 'None',
      status: 'Pending Review',
      dateSubmitted: '2026-08-20'
    }
  ];

  const applicationsList = (data?.applications && data.applications.length > 0)
    ? data.applications
    : defaultApplications;

  const pendingAppsCount = applicationsList.filter(a => a.status === 'Pending Review').length;

  const filteredApplications = applicationsList.filter(
    (app) =>
      app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.classApplyingFor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.guardianName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
  ];

  const handleNoticeSubmit = (e) => {
    e.preventDefault();
    onAddAnnouncement({
      id: `ANN-${Math.floor(10 + Math.random() * 90)}`,
      title: newNotice.title,
      author: 'Principal / Admin Office',
      date: new Date().toISOString().split('T')[0],
      content: newNotice.content,
    });
    setNewNotice({ title: '', content: '' });
    setNoticeMsg('Announcement broadcasted to all students, parents, and teachers!');
    setTimeout(() => setNoticeMsg(''), 4000);
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    const nextNum = studentsList.length + 1;
    const newId = `NSHS/2026/00${nextNum}`;
    const fullName = `${studentForm.surname.toUpperCase()} ${studentForm.firstName} ${studentForm.middleName}`.trim();
    const isJSS = studentForm.entryClass.startsWith('JSS');
    const termFee = isJSS ? '₦95,000' : '₦125,000';
    const assignedPin = studentForm.portalPin || generateRandomPin();

    const newStudentData = {
      id: newId,
      name: fullName,
      gender: studentForm.gender,
      dob: studentForm.dob,
      ninOrLasrra: studentForm.ninOrLasrra,
      stateOfOrigin: studentForm.stateOfOrigin,
      lga: studentForm.lga,
      nationality: studentForm.nationality,
      bloodGroup: studentForm.bloodGroup,
      genotype: studentForm.genotype,
      religion: studentForm.religion,
      admissionCriteria: 'Internal Entrance Examination',
      entranceExamScore: studentForm.entranceExamScore,
      entranceExamRegNo: studentForm.entranceExamRegNo,
      priorClass: studentForm.priorClass,
      class: `${studentForm.entryClass} - ${studentForm.classArm}`,
      entryClass: studentForm.entryClass,
      classArm: studentForm.classArm,
      academicTrack: studentForm.academicTrack,
      house: studentForm.house,
      boardingStatus: studentForm.boardingStatus,
      previousSchool: studentForm.previousSchool,
      medicalConditions: studentForm.medicalConditions,
      guardian: `${studentForm.guardianName} (${studentForm.guardianRelationship})`,
      guardianName: studentForm.guardianName,
      guardianRelationship: studentForm.guardianRelationship,
      guardianPhone: studentForm.guardianPhone,
      guardianEmail: studentForm.guardianEmail,
      fatherOccupation: studentForm.fatherOccupation,
      motherName: studentForm.motherName,
      motherOccupation: studentForm.motherOccupation,
      motherPhone: studentForm.motherPhone,
      guardianAddress: studentForm.guardianAddress,
      emergencyContact: `${studentForm.emergencyContact || studentForm.guardianName} (${studentForm.emergencyPhone || studentForm.guardianPhone})`,
      whatsappAlertsEnabled: studentForm.whatsappAlertsEnabled,
      feeStatus: studentForm.feeStatus,
      feeAmount: termFee,
      paidAmount: studentForm.feeStatus === 'Approved' ? termFee : (studentForm.initialDeposit ? `₦${Number(studentForm.initialDeposit).toLocaleString()}` : '₦0'),
      password: assignedPin,
      admissionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    onAddStudent(newStudentData);
    setRegisteredStudentSlip(newStudentData);

    // If enrolling an existing online application, update its status
    if (selectedApplicationForReview && onUpdateApplication) {
      onUpdateApplication(selectedApplicationForReview.applicationId || selectedApplicationForReview.id, 'Accepted & Enrolled');
    }
  };

  const handleReviewAndEnroll = (app) => {
    setSelectedApplicationForReview(app);
    const nameParts = (app.studentName || '').trim().split(' ');
    const surname = nameParts[nameParts.length - 1] || '';
    const firstName = nameParts[0] || '';
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
    const isJSS = (app.classApplyingFor || 'JSS 1').startsWith('JSS');
    const track = app.classApplyingFor?.includes('Science') ? 'Science & Technology' :
                  app.classApplyingFor?.includes('Commercial') ? 'Business & Commercial' :
                  app.classApplyingFor?.includes('Arts') ? 'Arts & Humanities' : 'Junior Secondary Foundation';

    setStudentForm((prev) => ({
      ...prev,
      surname,
      firstName,
      middleName,
      gender: app.gender || 'Male',
      dob: app.dob || '2010-05-15',
      priorClass: app.currentClass || 'Primary 6',
      entryClass: app.classApplyingFor || 'JSS 1',
      academicTrack: track,
      guardianName: app.guardianName || app.fatherName || app.motherName || '',
      guardianRelationship: app.guardianRelationship || 'Father',
      guardianPhone: app.primaryPhone || '',
      guardianEmail: app.email || '',
      guardianAddress: app.address || 'Mushin / Lagos, Nigeria',
      previousSchool: app.previousSchool || '',
      medicalConditions: app.medicalConditions || 'None',
      entranceExamRegNo: `NSHS/EXAM/2026/${Math.floor(100 + Math.random() * 900)}`,
      entranceExamScore: '85%',
      portalPin: generateRandomPin(),
    }));

    setActiveAdminTab('register');
    setRegisteredStudentSlip(null);
  };

  const handleDeclineApplication = (appId) => {
    if (onUpdateApplication) {
      onUpdateApplication(appId, 'Declined');
    }
  };

  const handleCopyPin = (pinText) => {
    navigator.clipboard.writeText(pinText);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  const resetForm = () => {
    setRegisteredStudentSlip(null);
    setCopiedPin(false);
    setSelectedApplicationForReview(null);
    setStudentForm({
      surname: '',
      firstName: '',
      middleName: '',
      gender: 'Male',
      dob: '2010-05-15',
      ninOrLasrra: '',
      stateOfOrigin: 'Lagos',
      lga: 'Mushin',
      nationality: 'Nigerian',
      bloodGroup: 'O+',
      genotype: 'AA',
      religion: 'Christianity',
      admissionCriteria: 'Internal Entrance Examination',
      entranceExamScore: '84%',
      entranceExamRegNo: 'NSHS/EXAM/2026/084',
      priorClass: 'Primary 6',
      entryClass: 'JSS 1',
      classArm: 'Arm A (Diamond)',
      academicTrack: 'Junior Secondary Foundation',
      house: 'Red House (Tiger)',
      boardingStatus: 'Day Student',
      previousSchool: '',
      medicalConditions: 'None',
      guardianName: '',
      guardianRelationship: 'Father',
      guardianPhone: '',
      guardianEmail: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      motherPhone: '',
      guardianAddress: '',
      emergencyContact: '',
      emergencyPhone: '',
      whatsappAlertsEnabled: true,
      feeStatus: 'Unpaid',
      initialDeposit: '0',
      portalPin: generateRandomPin(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Admin Summary Bar & Tab Navigation */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#1B2521]">Principal & Registrar Control Center</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-green-primary text-[10px] font-extrabold border border-green-primary/20">
              Admin Level 1
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage incoming online applications, student registry, admissions enrollment, and circulars.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* New Online Applications Tab */}
          <button
            onClick={() => { setActiveAdminTab('applications'); setRegisteredStudentSlip(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeAdminTab === 'applications'
                ? 'bg-green-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Online Applications</span>
            {pendingAppsCount > 0 && (
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                activeAdminTab === 'applications' ? 'bg-amber-400 text-emerald-950' : 'bg-red-500 text-white'
              }`}>
                {pendingAppsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveAdminTab('database'); setRegisteredStudentSlip(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'database'
                ? 'bg-green-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Student Registry ({studentsList.length})</span>
          </button>

          <button
            onClick={() => { setActiveAdminTab('register'); setSelectedApplicationForReview(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'register'
                ? 'bg-green-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admissions & Enrollment</span>
          </button>

          <button
            onClick={() => { setActiveAdminTab('announcements'); setRegisteredStudentSlip(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'announcements'
                ? 'bg-green-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Broadcast Notices</span>
          </button>
        </div>
      </div>

      {/* ================= 1. ONLINE ADMISSIONS APPLICATIONS TAB ================= */}
      {activeAdminTab === 'applications' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-[#1B2521]">Prospective Student Online Applications</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                  {pendingAppsCount} Pending Review
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Incoming candidate admission forms submitted on the public website. Click "Review & Enroll" to admit student.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search applicant name, class, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-primary w-full bg-[#FAFCFA] font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 text-[11px]">
                  <th className="p-3">App Reference</th>
                  <th className="p-3">Applicant Full Name</th>
                  <th className="p-3">Class Applying For</th>
                  <th className="p-3">Prior Class & School</th>
                  <th className="p-3">Primary Guardian Contact</th>
                  <th className="p-3">Date Applied</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-400 italic">
                      No online student applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.applicationId || app.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-3 font-mono font-bold text-green-primary">{app.applicationId || app.id}</td>
                      <td className="p-3">
                        <div className="font-extrabold text-[#1B2521] uppercase text-xs">{app.studentName}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{app.gender || 'Male'} · DOB: {app.dob || 'N/A'}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-black text-[#06452C] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {app.classApplyingFor}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700">
                        <div className="font-bold text-[#1B2521]">{app.currentClass || 'Primary 6'}</div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[140px]">{app.previousSchool || 'Crown Primary'}</div>
                      </td>
                      <td className="p-3 text-gray-600">
                        <div className="font-bold text-[#1B2521]">{app.guardianName || app.fatherName}</div>
                        <div className="text-[10px] text-green-primary font-mono font-semibold">{app.primaryPhone}</div>
                      </td>
                      <td className="p-3 text-gray-500 font-mono text-[11px]">{app.dateSubmitted || '2026-08-20'}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          app.status === 'Accepted & Enrolled' ? 'bg-green-100 text-green-800' :
                          app.status === 'Declined' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900 animate-pulse'
                        }`}>
                          {app.status || 'Pending Review'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {app.status === 'Accepted & Enrolled' ? (
                          <span className="text-[11px] font-bold text-green-primary inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                          </span>
                        ) : (
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => handleReviewAndEnroll(app)}
                              className="px-3 py-1.5 rounded-lg bg-green-primary hover:bg-green-dark text-white font-black text-[11px] transition-all flex items-center gap-1 shadow-sm"
                            >
                              <span>Review & Enroll</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeclineApplication(app.applicationId || app.id)}
                              className="px-2 py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all text-[11px]"
                              title="Decline Application"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 2. CENTRAL STUDENT REGISTRY DATABASE ================= */}
      {activeAdminTab === 'database' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-[#1B2521]">Central Student Archive & Registry</h3>
              <p className="text-xs text-gray-500">Live search across student names, admission numbers, classes, and guardian contacts</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, ID, class, guardian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-primary w-full bg-[#FAFCFA] font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 text-[11px]">
                  <th className="p-3">Admission ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Class & Stream</th>
                  <th className="p-3">House Allocation</th>
                  <th className="p-3">Primary Guardian Contact</th>
                  <th className="p-3">Tuition Status</th>
                  <th className="p-3 text-right">Student Portal PIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-400 italic">
                      No student records match your query.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-3 font-mono font-bold text-green-primary">{s.id}</td>
                      <td className="p-3 font-extrabold text-[#1B2521]">{s.name}</td>
                      <td className="p-3">
                        <span className="font-semibold text-gray-800">{s.class}</span>
                        {s.academicTrack && <span className="block text-[10px] text-gray-400">{s.academicTrack}</span>}
                      </td>
                      <td className="p-3 text-gray-700 font-medium">{s.house}</td>
                      <td className="p-3 text-gray-600">
                        <div className="font-bold text-[#1B2521]">{s.guardian}</div>
                        <div className="text-[10px] text-gray-400">{s.guardianPhone}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          s.feeStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                          s.feeStatus === 'Pending' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.feeStatus} ({s.feeAmount})
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="font-mono font-bold text-xs bg-emerald-50 text-green-primary px-2.5 py-1 rounded-lg border border-emerald-200 shadow-sm">
                          {s.password || '1234'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 3. INTRICATE NEW STUDENT ADMISSIONS DOSSIER ================= */}
      {activeAdminTab === 'register' && (
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          {registeredStudentSlip ? (
            /* ================= EXECUTIVE PROFESSIONAL OFFICIAL ADMISSION LETTER & SLIP ================= */
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Screen-Only Control Toolbar */}
              <div className="print:hidden p-4 rounded-2xl bg-emerald-900 text-white flex flex-col sm:flex-row justify-between items-center gap-3 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center border border-emerald-400/40">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white">Student Successfully Enrolled!</h4>
                    <p className="text-[11px] text-emerald-200">Official Admission Letter ready for physical printing or PDF download</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Official Letter (PDF)</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                  >
                    + Register Another
                  </button>
                  <button
                    onClick={() => { setActiveAdminTab('applications'); setRegisteredStudentSlip(null); }}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                  >
                    View Applications →
                  </button>
                </div>
              </div>

              {/* ================= PRINTABLE OFFICIAL LETTERHEAD DOCUMENT ================= */}
              <div id="printable-admission-slip" className="bg-[#FCFCFA] rounded-2xl p-6 sm:p-10 border-2 border-emerald-900/40 shadow-xl relative overflow-hidden text-[#1B2521] print:border-0 print:shadow-none print:p-0 print:bg-white print:m-0">
                
                {/* Official Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                  <span className="font-serif font-black text-8xl sm:text-9xl text-emerald-950 rotate-[-30deg] tracking-widest uppercase">
                    NEW STATE
                  </span>
                </div>

                {/* 1. Official Nigerian School Crest Header */}
                <div className="border-b-2 border-[#06452C] pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-10">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 p-2 bg-emerald-50 rounded-2xl border-2 border-emerald-300/80 flex-shrink-0 flex items-center justify-center shadow-sm">
                    <img src="/school-logo.png" alt="School Crest Logo" className="w-full h-full object-contain" />
                  </div>

                  <div className="flex-grow space-y-1">
                    <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#06452C]">
                      Lagos State Ministry of Basic & Secondary Education
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#06452C] tracking-tight uppercase leading-none font-serif">
                      NEW STATE HIGH SCHOOL
                    </h1>
                    <div className="text-xs font-black text-[#1B2521] tracking-wide">
                      MOTTO: <span className="text-[#06452C] italic">DOMINE DIRIGE NOS</span> (LORD DIRECT US)
                    </div>
                    <p className="text-[11px] text-gray-600 leading-tight">
                      36 Palm Avenue, Mushin, Lagos State, Nigeria · Tel: +234 813 400 0644 · Email: info@newstateschools.org
                    </p>
                    <div className="inline-flex items-center gap-2 pt-0.5 text-[10px] font-extrabold text-[#06452C] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      <span>Govt. Approved Comprehensive Secondary School</span>
                      <span>•</span>
                      <span>WAEC & NECO Center No: 0481903</span>
                    </div>
                  </div>

                  <div className="text-center sm:text-right flex-shrink-0 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-4 space-y-1">
                    <span className="inline-block px-3 py-1 bg-[#06452C] text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-sm">
                      OFFICIAL ADMISSION SLIP
                    </span>
                    <div className="text-xs font-mono font-black text-green-primary">{registeredStudentSlip.id}</div>
                    <div className="text-[10px] text-gray-500 font-bold">Session: 2026/2027</div>
                    <div className="text-[10px] text-gray-500">{registeredStudentSlip.admissionDate || 'August 20, 2026'}</div>
                  </div>
                </div>

                {/* 2. Official Provisional Admission Title & Formal Salutation */}
                <div className="mt-5 space-y-2 relative z-10">
                  <div className="text-center py-2 px-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <h2 className="text-sm sm:text-base font-black text-[#06452C] uppercase tracking-wider font-serif">
                      PROVISIONAL LETTER OF ADMISSION & ENROLMENT DOSSIER
                    </h2>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed pt-1">
                    This is to officially certify that upon satisfactory performance in the <strong className="text-[#06452C]">New State High School Internal Entrance Screening Examination</strong>, the candidate named below has been offered provisional admission into New State High School for the <strong className="text-[#06452C]">2026/2027 Academic Session</strong>.
                  </p>
                </div>

                {/* 3. Comprehensive Official 4-Quadrant Data Grid */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs relative z-10">
                  
                  {/* Quadrant 1: Candidate Identity */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-[#06452C] font-black text-[11px] uppercase tracking-wider pb-1 border-b border-gray-100">
                      <User className="w-3.5 h-3.5" />
                      <span>1. Candidate Bio-Data & Identity</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Full Legal Name</span>
                        <span className="font-black text-[#1B2521] text-xs uppercase">{registeredStudentSlip.name}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Admission Number</span>
                        <span className="font-mono font-black text-green-primary text-xs">{registeredStudentSlip.id}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Gender & DOB</span>
                        <span className="font-semibold text-gray-800">{registeredStudentSlip.gender} · {registeredStudentSlip.dob}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">State & LGA</span>
                        <span className="font-semibold text-gray-800">{registeredStudentSlip.stateOfOrigin} State ({registeredStudentSlip.lga})</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Blood Group & Genotype</span>
                        <span className="font-bold text-gray-800">{registeredStudentSlip.bloodGroup} · {registeredStudentSlip.genotype}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">National / State ID</span>
                        <span className="font-semibold text-gray-700">{registeredStudentSlip.ninOrLasrra || 'Verified On File'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quadrant 2: Academic Placement & Program */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-[#06452C] font-black text-[11px] uppercase tracking-wider pb-1 border-b border-gray-100">
                      <Award className="w-3.5 h-3.5" />
                      <span>2. Academic Stream & Placement</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Admitted Entry Class</span>
                        <span className="font-extrabold text-[#06452C] text-xs">{registeredStudentSlip.class}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Prior Class Passed</span>
                        <span className="font-bold text-gray-800">{registeredStudentSlip.priorClass || 'Primary 6'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Internal Screening Score</span>
                        <span className="font-black text-green-primary">{registeredStudentSlip.entranceExamScore || '84% (Merit Pass)'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Exam Candidate Reg No.</span>
                        <span className="font-mono text-gray-700">{registeredStudentSlip.entranceExamRegNo || 'NSHS/EXAM/2026/084'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Allocated House</span>
                        <span className="font-bold text-gray-800">{registeredStudentSlip.house}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Boarding Status</span>
                        <span className="font-semibold text-gray-800">{registeredStudentSlip.boardingStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quadrant 3: Parent & Guardian Details */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-[#06452C] font-black text-[11px] uppercase tracking-wider pb-1 border-b border-gray-100">
                      <Phone className="w-3.5 h-3.5" />
                      <span>3. Primary Guardian & Emergency Records</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="col-span-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Primary Guardian Name</span>
                        <span className="font-black text-[#1B2521] text-xs">{registeredStudentSlip.guardian}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Guardian Phone (WhatsApp)</span>
                        <span className="font-bold text-gray-800">{registeredStudentSlip.guardianPhone}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">WhatsApp SMS Alerts</span>
                        <span className="font-bold text-emerald-700">✓ Active Dispatch</span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Residential Address</span>
                        <span className="font-medium text-gray-700">{registeredStudentSlip.guardianAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quadrant 4: Tuition & Bursar Clearance */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-[#06452C] font-black text-[11px] uppercase tracking-wider pb-1 border-b border-gray-100">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>4. Tuition Assessment & Bursary Setup</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Prescribed Term Tuition</span>
                        <span className="font-black text-[#06452C] text-xs">{registeredStudentSlip.feeAmount}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Initial Payment Status</span>
                        <span className={`font-black inline-block px-2 py-0.5 rounded text-[10px] ${
                          registeredStudentSlip.feeStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                          registeredStudentSlip.feeStatus === 'Pending' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {registeredStudentSlip.feeStatus}
                        </span>
                      </div>

                      <div className="col-span-2 text-[10px] text-gray-500 pt-1 leading-tight">
                        Bank transfers to be made to official Zenith Bank / First Bank school accounts with candidate's Admission ID as payment reference.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Secure Student Portal & CBT Credentials Voucher */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-[#06452C] text-white border-2 border-emerald-600/40 relative z-10 shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-300 font-black text-[10px] uppercase tracking-wider">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Confidential Student Portal & CBT Access Voucher</span>
                      </div>
                      <p className="text-xs text-emerald-100">
                        Use these credentials to log in for terminal report cards, lesson notes, and CBT assessments.
                      </p>
                      <div className="text-[10px] text-emerald-200 font-mono">
                        Portal URL: <span className="underline">https://newstatehighschool.web.app/portal</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20">
                      <div>
                        <span className="text-[9px] font-bold text-emerald-200 uppercase tracking-widest block">Portal PIN</span>
                        <span className="font-mono font-black text-xl text-white tracking-widest">
                          {registeredStudentSlip.password}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyPin(registeredStudentSlip.password)}
                        className="print:hidden px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-[11px] transition-all flex items-center gap-1 shadow-sm"
                      >
                        {copiedPin ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPin ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Institutional Endorsement, Signatures & Stamp */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300 grid grid-cols-3 gap-4 text-center items-end relative z-10">
                  {/* Registrar Signature */}
                  <div className="space-y-1 text-left">
                    <div className="font-serif italic font-black text-gray-800 text-sm border-b border-gray-400 pb-1 w-36">
                      S. O. Balogun
                    </div>
                    <div className="text-[10px] font-black text-[#06452C] uppercase">Registrar / Admissions</div>
                    <div className="text-[9px] text-gray-500">New State High School</div>
                  </div>

                  {/* Official Institutional Stamp */}
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-800 flex flex-col items-center justify-center text-center p-1 transform -rotate-6 text-[#06452C] bg-emerald-50/40">
                      <ShieldCheck className="w-4 h-4 text-[#06452C]" />
                      <span className="text-[8px] font-black tracking-tighter uppercase leading-none mt-0.5">NEW STATE HIGH SCHOOL</span>
                      <span className="text-[7px] font-bold text-red-700 tracking-widest my-0.5 font-mono">★ APPROVED ★</span>
                      <span className="text-[7px] font-extrabold uppercase leading-none">ADMISSIONS OFFICE</span>
                    </div>
                  </div>

                  {/* Principal Endorsement */}
                  <div className="space-y-1 text-right">
                    <div className="font-serif italic font-black text-gray-800 text-sm border-b border-gray-400 pb-1 w-36 ml-auto">
                      Dr. A. O. Adeleke
                    </div>
                    <div className="text-[10px] font-black text-[#06452C] uppercase">Principal / Director</div>
                    <div className="text-[9px] text-gray-500">Stamp & Official Signature</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Section Intricate Form */
            <form onSubmit={handleStudentSubmit} className="space-y-8">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 text-green-primary font-black text-xs uppercase tracking-widest">
                  <UserPlus className="w-4 h-4" />
                  <span>Student Admissions Dossier & Registry Form (Internal Entrance Standard)</span>
                </div>
                <h3 className="text-2xl font-black text-[#1B2521] mt-1">
                  {selectedApplicationForReview ? `Enroll Applicant: ${selectedApplicationForReview.studentName}` : 'Intricate Student Enrollment'}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedApplicationForReview ? 'Pre-filled from online admissions application. Set screening score and allocate class arm.' : 'Complete student personal bio-data, internal entrance exam scores, prior class, entry class, parental records, and medical profile.'}
                </p>
              </div>

              {/* SECTION 1: PERSONAL BIO-DATA */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <User className="w-4 h-4" />
                  <span>Section 1: Student Personal Bio-Data & Identity</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Surname (Last Name) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ADELEKE"
                      value={studentForm.surname}
                      onChange={(e) => setStudentForm({ ...studentForm, surname: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Oluwaseun"
                      value={studentForm.firstName}
                      onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Babatunde"
                      value={studentForm.middleName}
                      onChange={(e) => setStudentForm({ ...studentForm, middleName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Gender *</label>
                    <select
                      value={studentForm.gender}
                      onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={studentForm.dob}
                      onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">NIN / LASRRA / Birth Cert No.</label>
                    <input
                      type="text"
                      placeholder="e.g. NIN: 90218491028"
                      value={studentForm.ninOrLasrra}
                      onChange={(e) => setStudentForm({ ...studentForm, ninOrLasrra: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={studentForm.nationality}
                      onChange={(e) => setStudentForm({ ...studentForm, nationality: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">State of Origin *</label>
                    <select
                      value={studentForm.stateOfOrigin}
                      onChange={(e) => setStudentForm({ ...studentForm, stateOfOrigin: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      {nigerianStates.map((st) => (
                        <option key={st} value={st}>{st} State</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Local Govt. Area (LGA)</label>
                    <input
                      type="text"
                      placeholder="e.g. Mushin / Ikeja"
                      value={studentForm.lga}
                      onChange={(e) => setStudentForm({ ...studentForm, lga: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
                    <select
                      value={studentForm.bloodGroup}
                      onChange={(e) => setStudentForm({ ...studentForm, bloodGroup: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Genotype</label>
                    <select
                      value={studentForm.genotype}
                      onChange={(e) => setStudentForm({ ...studentForm, genotype: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      {['AA', 'AS', 'SS', 'AC'].map((gt) => (
                        <option key={gt} value={gt}>{gt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Religion / Faith</label>
                    <select
                      value={studentForm.religion}
                      onChange={(e) => setStudentForm({ ...studentForm, religion: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="Christianity">Christianity</option>
                      <option value="Islam">Islam</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Medical Conditions / Allergies</label>
                    <input
                      type="text"
                      placeholder="e.g. Asthmatic, Penicillin Allergy, None"
                      value={studentForm.medicalConditions}
                      onChange={(e) => setStudentForm({ ...studentForm, medicalConditions: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: INTERNAL ENTRANCE EXAM & ACADEMIC ALLOCATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <Award className="w-4 h-4" />
                  <span>Section 2: Internal Entrance Examination & Academic Class Allocation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Internal Entrance Screening Score (%) *</label>
                    <input
                      type="text"
                      placeholder="e.g. 84% / 100"
                      value={studentForm.entranceExamScore}
                      onChange={(e) => setStudentForm({ ...studentForm, entranceExamScore: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-green-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Internal Exam / Candidate Reg Number</label>
                    <input
                      type="text"
                      placeholder="e.g. NSHS/EXAM/2026/084"
                      value={studentForm.entranceExamRegNo}
                      onChange={(e) => setStudentForm({ ...studentForm, entranceExamRegNo: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Prior Class Passed *</label>
                    <select
                      value={studentForm.priorClass}
                      onChange={(e) => setStudentForm({ ...studentForm, priorClass: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                    >
                      <option value="Primary 6">Primary 6</option>
                      <option value="Primary 5">Primary 5</option>
                      <option value="Primary 4">Primary 4</option>
                      <option value="JSS 1">JSS 1</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 3">JSS 3</option>
                      <option value="SSS 1">SSS 1</option>
                      <option value="SSS 2">SSS 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Entry Class *</label>
                    <select
                      value={studentForm.entryClass}
                      onChange={(e) => {
                        const val = e.target.value;
                        const track = val.includes('Science') ? 'Science & Technology' :
                                      val.includes('Commercial') ? 'Business & Commercial' :
                                      val.includes('Arts') ? 'Arts & Humanities' : 'Junior Secondary Foundation';
                        setStudentForm({ ...studentForm, entryClass: val, academicTrack: track });
                      }}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                    >
                      <option value="JSS 1">JSS 1 (Junior Secondary)</option>
                      <option value="JSS 2">JSS 2 (Junior Secondary)</option>
                      <option value="JSS 3">JSS 3 (Junior Secondary)</option>
                      <option value="SSS 1 (Science)">SSS 1 (Science Track)</option>
                      <option value="SSS 1 (Arts)">SSS 1 (Arts Track)</option>
                      <option value="SSS 1 (Commercial)">SSS 1 (Commercial Track)</option>
                      <option value="SSS 2 (Science)">SSS 2 (Science Track)</option>
                      <option value="SSS 2 (Commercial)">SSS 2 (Commercial Track)</option>
                      <option value="SSS 3 (Science)">SSS 3 (Science Track - WAEC Prep)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Class Arm / Division *</label>
                    <select
                      value={studentForm.classArm}
                      onChange={(e) => setStudentForm({ ...studentForm, classArm: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="Arm A (Diamond)">Arm A (Diamond)</option>
                      <option value="Arm B (Gold)">Arm B (Gold)</option>
                      <option value="Arm C (Silver)">Arm C (Silver)</option>
                      <option value="Track A (Pre-Engineering)">Track A (Pre-Engineering)</option>
                      <option value="Track B (Medical & Bio-Sciences)">Track B (Medical & Bio-Sciences)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">House Allocation *</label>
                    <select
                      value={studentForm.house}
                      onChange={(e) => setStudentForm({ ...studentForm, house: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="Red House (Tiger)">Red House (Tiger) 🔴</option>
                      <option value="Blue House (Eagle)">Blue House (Eagle) 🔵</option>
                      <option value="Yellow House (Falcon)">Yellow House (Falcon) 🟡</option>
                      <option value="Green House (Palm)">Green House (Palm) 🟢</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Academic Track Stream</label>
                    <input
                      type="text"
                      readOnly
                      value={studentForm.academicTrack}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-600 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Boarding / Day Status</label>
                    <select
                      value={studentForm.boardingStatus}
                      onChange={(e) => setStudentForm({ ...studentForm, boardingStatus: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="Day Student">Day Student</option>
                      <option value="Boarding">Boarding Student</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Previous School Attended</label>
                    <input
                      type="text"
                      placeholder="e.g. Crown Model Primary School, Palm Avenue"
                      value={studentForm.previousSchool}
                      onChange={(e) => setStudentForm({ ...studentForm, previousSchool: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PARENT & GUARDIAN INFORMATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <Phone className="w-4 h-4" />
                  <span>Section 3: Parent & Primary Guardian Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Primary Guardian Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Babatunde Adeleke"
                      value={studentForm.guardianName}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Relationship *</label>
                    <select
                      value={studentForm.guardianRelationship}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianRelationship: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Uncle / Aunt">Uncle / Aunt</option>
                      <option value="Sponsor / Corporate">Sponsor / Corporate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Primary Phone (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0803 123 4567"
                      value={studentForm.guardianPhone}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Father's Occupation</label>
                    <input
                      type="text"
                      placeholder="e.g. Civil Servant, Engineer"
                      value={studentForm.fatherOccupation}
                      onChange={(e) => setStudentForm({ ...studentForm, fatherOccupation: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mother's Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Mrs. Folashade Adeleke"
                      value={studentForm.motherName}
                      onChange={(e) => setStudentForm({ ...studentForm, motherName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mother's Occupation</label>
                    <input
                      type="text"
                      placeholder="e.g. Business Executive, Nurse"
                      value={studentForm.motherOccupation}
                      onChange={(e) => setStudentForm({ ...studentForm, motherOccupation: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mother's Direct Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g. 0802 987 6543"
                      value={studentForm.motherPhone}
                      onChange={(e) => setStudentForm({ ...studentForm, motherPhone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Guardian Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. parent@gmail.com"
                      value={studentForm.guardianEmail}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianEmail: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Residential Address in Lagos *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 36 Palm Avenue, Mushin, Lagos State"
                      value={studentForm.guardianAddress}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianAddress: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                {/* WhatsApp Alert Opt-In Checkbox */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="whatsappAlerts"
                    checked={studentForm.whatsappAlertsEnabled}
                    onChange={(e) => setStudentForm({ ...studentForm, whatsappAlertsEnabled: e.target.checked })}
                    className="w-4 h-4 text-green-primary rounded focus:ring-green-primary"
                  />
                  <label htmlFor="whatsappAlerts" className="text-xs font-bold text-[#06452C] cursor-pointer">
                    Enable automated WhatsApp SMS fee receipts, daily attendance & terminal report alerts for this guardian.
                  </label>
                </div>
              </div>

              {/* SECTION 4: TUITION & RANDOM ALPHANUMERIC PIN SETUP */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <CreditCard className="w-4 h-4" />
                  <span>Section 4: Tuition Billing & Secure Alphanumeric PIN</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Term Tuition Rate</label>
                    <input
                      type="text"
                      readOnly
                      value={studentForm.entryClass.startsWith('JSS') ? '₦95,000 / Term' : '₦125,000 / Term'}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-emerald-50 text-green-primary font-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Initial Payment Status</label>
                    <select
                      value={studentForm.feeStatus}
                      onChange={(e) => setStudentForm({ ...studentForm, feeStatus: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                    >
                      <option value="Unpaid">Unpaid (Awaiting Bank Transfer)</option>
                      <option value="Pending">Pending Bursar Verification</option>
                      <option value="Approved">Fully Paid & Approved</option>
                    </select>
                  </div>

                  {/* Random Alphanumeric PIN Box with Regenerate Button */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-green-primary" />
                        Random Student PIN (Alphanumeric) *
                      </span>
                      <button
                        type="button"
                        onClick={() => setStudentForm({ ...studentForm, portalPin: generateRandomPin() })}
                        className="text-[10px] text-green-primary hover:underline font-extrabold flex items-center gap-0.5"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Re-roll PIN</span>
                      </button>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={studentForm.portalPin}
                        onChange={(e) => setStudentForm({ ...studentForm, portalPin: e.target.value.toUpperCase() })}
                        className="w-full p-3 rounded-xl border-2 border-emerald-300 text-sm bg-emerald-50/50 text-[#06452C] font-mono font-black tracking-widest uppercase focus:outline-none focus:border-green-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyPin(studentForm.portalPin)}
                        className="px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                        title="Copy PIN"
                      >
                        {copiedPin ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3.5 rounded-xl border border-gray-300 text-[#1B2521] text-xs font-bold hover:bg-gray-50"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-[#06452C] hover:bg-[#0B5D3B] text-white text-xs font-black transition-all shadow-md flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Enroll Student & Issue Admission Slip →</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ================= 4. BROADCAST ANNOUNCEMENTS ================= */}
      {activeAdminTab === 'announcements' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-black text-[#1B2521]">Broadcast Official School Announcement</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Notices posted here appear instantly on all student, teacher, and bursar dashboards.
            </p>
          </div>

          {noticeMsg && (
            <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-primary" />
              <span>{noticeMsg}</span>
            </div>
          )}

          <form onSubmit={handleNoticeSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Notice Headline / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. First Term Mid-Term Examination Schedule Released"
                value={newNotice.title}
                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Announcement Circular Body *</label>
              <textarea
                required
                rows="5"
                placeholder="Write official announcement details..."
                value={newNotice.content}
                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl font-black text-xs text-white bg-[#06452C] hover:bg-[#0B5D3B] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Megaphone className="w-4 h-4" />
              <span>Dispatch School Circular →</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
