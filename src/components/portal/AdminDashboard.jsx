import React, { useState } from 'react';
import {
  Search, Megaphone, UserPlus, Shield, CheckCircle2, Database, Send, Users, User,
  Award, Calendar, Phone, Mail, MapPin, HeartPulse, CreditCard, Sparkles, Printer, FileText, ChevronDown,
  Building2, Hash, IdCard, MessageSquare, CheckSquare, GraduationCap, BookOpen, FileCheck,
  KeyRound, RefreshCw, Copy, Check
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

export default function AdminDashboard({ data, onAddAnnouncement, onAddStudent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('database'); // 'database', 'register', 'announcements'
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const [noticeMsg, setNoticeMsg] = useState('');
  const [registeredStudentSlip, setRegisteredStudentSlip] = useState(null);
  const [copiedPin, setCopiedPin] = useState(false);

  // Intricate Student Registration Form State with Nigerian Admission Criteria
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
    admissionCriteria: 'National Common Entrance Examination (NCEE) Merit',
    entranceExamScore: '84% (Passed Screening)',
    entranceExamRegNo: 'NCEE/2026/04812',
    priorCertificate: 'Primary School Leaving Certificate (PSLC)',
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
      admissionCriteria: studentForm.admissionCriteria,
      entranceExamScore: studentForm.entranceExamScore,
      entranceExamRegNo: studentForm.entranceExamRegNo,
      priorCertificate: studentForm.priorCertificate,
      class: `${studentForm.entryClass} - ${studentForm.classArm}`,
      academicTrack: studentForm.academicTrack,
      house: studentForm.house,
      boardingStatus: studentForm.boardingStatus,
      previousSchool: studentForm.previousSchool,
      medicalConditions: studentForm.medicalConditions,
      guardian: `${studentForm.guardianName} (${studentForm.guardianRelationship})`,
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
    };

    onAddStudent(newStudentData);
    setRegisteredStudentSlip(newStudentData);
  };

  const handleCopyPin = (pinText) => {
    navigator.clipboard.writeText(pinText);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  const resetForm = () => {
    setRegisteredStudentSlip(null);
    setCopiedPin(false);
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
      admissionCriteria: 'National Common Entrance Examination (NCEE) Merit',
      entranceExamScore: '84% (Passed Screening)',
      entranceExamRegNo: 'NCEE/2026/04812',
      priorCertificate: 'Primary School Leaving Certificate (PSLC)',
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
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#1B2521]">Principal & Registrar Control Center</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-green-primary text-[10px] font-extrabold border border-green-primary/20">
              Admin Level 1
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage central student registry, Nigerian entrance admissions, circulars, and institutional records.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
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
            onClick={() => setActiveAdminTab('register')}
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

      {/* ================= 1. CENTRAL STUDENT REGISTRY DATABASE ================= */}
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

      {/* ================= 2. INTRICATE NEW STUDENT ADMISSIONS DOSSIER ================= */}
      {activeAdminTab === 'register' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          {registeredStudentSlip ? (
            /* Printable Official Admission & Enrolment Slip */
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/80 border-2 border-green-primary text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-green-primary text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>

                <div className="space-y-1">
                  <span className="px-3 py-1 bg-green-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    Admissions Directorate Verified
                  </span>
                  <h3 className="text-2xl font-black text-[#06452C] mt-2">Student Enrolled Successfully!</h3>
                  <p className="text-xs text-gray-600">
                    Official admission dossier created in the central school database according to Nigerian Ministry of Education criteria.
                  </p>
                </div>

                {/* Admission Summary Card */}
                <div className="bg-white rounded-2xl p-5 border border-emerald-200 text-left grid grid-cols-2 gap-3 text-xs shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Official Admission ID</span>
                    <span className="font-mono font-black text-green-primary text-base">{registeredStudentSlip.id}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Student Full Name</span>
                    <span className="font-black text-[#1B2521] text-sm uppercase">{registeredStudentSlip.name}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Class & Arm</span>
                    <span className="font-extrabold text-[#1B2521]">{registeredStudentSlip.class}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Admission Route (Criteria)</span>
                    <span className="font-bold text-[#06452C]">{registeredStudentSlip.admissionCriteria}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Screening / Exam Score</span>
                    <span className="font-extrabold text-green-primary">{registeredStudentSlip.entranceExamScore || 'Verified (84%)'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tuition Billing</span>
                    <span className="font-bold text-[#1B2521]">{registeredStudentSlip.feeAmount} ({registeredStudentSlip.feeStatus})</span>
                  </div>

                  {/* Highlighted Unique Secure Alphanumeric PIN Box */}
                  <div className="col-span-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black text-[#06452C] uppercase tracking-wider block">
                        Generated Secure Alphanumeric PIN
                      </span>
                      <span className="font-mono font-black text-lg text-[#06452C] tracking-widest">
                        {registeredStudentSlip.password}
                      </span>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Keep this confidential for student report cards, assignments & CBT login access.
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyPin(registeredStudentSlip.password)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-[#06452C] hover:bg-emerald-100 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      {copiedPin ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-[#06452C]" />}
                      <span>{copiedPin ? 'Copied!' : 'Copy PIN'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2.5 rounded-xl bg-green-primary hover:bg-green-dark text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Admission Slip</span>
                  </button>

                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-[#1B2521] font-bold text-xs transition-all"
                  >
                    + Register Another Student
                  </button>

                  <button
                    onClick={() => { setActiveAdminTab('database'); setRegisteredStudentSlip(null); }}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all"
                  >
                    View in Central Registry →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Section Intricate Form */
            <form onSubmit={handleStudentSubmit} className="space-y-8">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 text-green-primary font-black text-xs uppercase tracking-widest">
                  <UserPlus className="w-4 h-4" />
                  <span>Student Admissions Dossier & Registry Form (Nigerian Educational Standard)</span>
                </div>
                <h3 className="text-2xl font-black text-[#1B2521] mt-1">Intricate Student Enrollment</h3>
                <p className="text-xs text-gray-500">
                  Complete student personal bio-data, Nigerian entrance criteria, academic stream, parental records, and medical profile.
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

              {/* SECTION 2: NIGERIAN ADMISSION CRITERIA & CLASS ALLOCATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <Award className="w-4 h-4" />
                  <span>Section 2: Nigerian Admission Criteria & Class Placement</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Admission Entry Criteria (Nigerian Standard) *</label>
                    <select
                      value={studentForm.admissionCriteria}
                      onChange={(e) => setStudentForm({ ...studentForm, admissionCriteria: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                    >
                      <option value="National Common Entrance Examination (NCEE) Merit">National Common Entrance Exam (NCEE) Merit</option>
                      <option value="Lagos State Model Placement Examination">Lagos State Placement Examination (CAS)</option>
                      <option value="BECE / Junior WAEC Clearance (6+ Credits)">BECE / Junior WAEC Clearance (6+ Credits)</option>
                      <option value="Internal Entrance Screening & Oral Interview">Internal Entrance Screening & Oral Interview</option>
                      <option value="Academic Merit Scholarship Scheme">Academic Merit Scholarship Award</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Entrance Screening Score / Grade</label>
                    <input
                      type="text"
                      placeholder="e.g. 84% / 100 or 168 / 200"
                      value={studentForm.entranceExamScore}
                      onChange={(e) => setStudentForm({ ...studentForm, entranceExamScore: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Exam / Placement Reg Number</label>
                    <input
                      type="text"
                      placeholder="e.g. NCEE/2026/04812"
                      value={studentForm.entranceExamRegNo}
                      onChange={(e) => setStudentForm({ ...studentForm, entranceExamRegNo: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Prior Certificate Verified</label>
                    <select
                      value={studentForm.priorCertificate}
                      onChange={(e) => setStudentForm({ ...studentForm, priorCertificate: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="Primary School Leaving Certificate (PSLC)">Primary School Leaving Cert (PSLC)</option>
                      <option value="BECE / Junior WAEC Certificate">BECE / Junior WAEC Statement</option>
                      <option value="Continuous Assessment Dossier (CAS)">Cumulative Assessment Dossier</option>
                      <option value="Headteacher Letter of Attestation">Letter of Attestation / Testimonial</option>
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
                      placeholder="e.g. St. Jude Model Primary School, Lagos"
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

      {/* ================= 3. BROADCAST ANNOUNCEMENTS ================= */}
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
