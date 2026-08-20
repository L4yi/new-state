import React, { useState } from 'react';
import {
  Search, Megaphone, UserPlus, Shield, CheckCircle2, Database, Send, Users, User,
  Award, Calendar, Phone, Mail, MapPin, HeartPulse, CreditCard, Sparkles, Printer, FileText, ChevronDown
} from 'lucide-react';

export default function AdminDashboard({ data, onAddAnnouncement, onAddStudent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('database'); // 'database', 'register', 'announcements'
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const [noticeMsg, setNoticeMsg] = useState('');
  const [registeredStudentSlip, setRegisteredStudentSlip] = useState(null);

  // Intricate Student Registration Form State
  const [studentForm, setStudentForm] = useState({
    surname: '',
    firstName: '',
    middleName: '',
    gender: 'Male',
    dob: '2010-05-15',
    stateOfOrigin: 'Lagos',
    lga: 'Mushin',
    nationality: 'Nigerian',
    bloodGroup: 'O+',
    genotype: 'AA',
    religion: 'Christianity',
    entryClass: 'JSS 1',
    academicTrack: 'Junior Secondary Foundation',
    house: 'Red House (Tiger)',
    boardingStatus: 'Day Student',
    previousSchool: 'Crown Primary School, Palm Avenue',
    medicalConditions: 'None',
    guardianName: '',
    guardianRelationship: 'Father',
    guardianPhone: '',
    guardianEmail: '',
    guardianAddress: '36 Palm Avenue, Mushin, Lagos',
    motherName: '',
    motherPhone: '',
    emergencyContact: '',
    emergencyPhone: '',
    feeStatus: 'Unpaid',
    initialDeposit: '0',
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

    const newStudentData = {
      id: newId,
      name: fullName,
      gender: studentForm.gender,
      dob: studentForm.dob,
      stateOfOrigin: studentForm.stateOfOrigin,
      lga: studentForm.lga,
      nationality: studentForm.nationality,
      bloodGroup: studentForm.bloodGroup,
      genotype: studentForm.genotype,
      class: studentForm.entryClass,
      academicTrack: studentForm.academicTrack,
      house: studentForm.house,
      boardingStatus: studentForm.boardingStatus,
      previousSchool: studentForm.previousSchool,
      medicalConditions: studentForm.medicalConditions,
      guardian: `${studentForm.guardianName} (${studentForm.guardianRelationship})`,
      guardianPhone: studentForm.guardianPhone,
      guardianEmail: studentForm.guardianEmail,
      guardianAddress: studentForm.guardianAddress,
      emergencyContact: `${studentForm.emergencyContact} (${studentForm.emergencyPhone})`,
      feeStatus: studentForm.feeStatus,
      feeAmount: termFee,
      paidAmount: studentForm.feeStatus === 'Approved' ? termFee : (studentForm.initialDeposit ? `₦${Number(studentForm.initialDeposit).toLocaleString()}` : '₦0'),
      password: '1234',
    };

    onAddStudent(newStudentData);
    setRegisteredStudentSlip(newStudentData);
  };

  const resetForm = () => {
    setRegisteredStudentSlip(null);
    setStudentForm({
      surname: '',
      firstName: '',
      middleName: '',
      gender: 'Male',
      dob: '2010-05-15',
      stateOfOrigin: 'Lagos',
      lga: 'Mushin',
      nationality: 'Nigerian',
      bloodGroup: 'O+',
      genotype: 'AA',
      religion: 'Christianity',
      entryClass: 'JSS 1',
      academicTrack: 'Junior Secondary Foundation',
      house: 'Red House (Tiger)',
      boardingStatus: 'Day Student',
      previousSchool: '',
      medicalConditions: 'None',
      guardianName: '',
      guardianRelationship: 'Father',
      guardianPhone: '',
      guardianEmail: '',
      guardianAddress: '',
      motherName: '',
      motherPhone: '',
      emergencyContact: '',
      emergencyPhone: '',
      feeStatus: 'Unpaid',
      initialDeposit: '0',
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
            Manage central student registry, admissions, official notices, and institutional records.
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
                  <th className="p-3 text-right">Default PIN</th>
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
                      <td className="p-3 text-right font-mono text-gray-400 font-bold">1234</td>
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
                    Official admission dossier created in the central school database and portal credentials issued.
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
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Class & Stream</span>
                    <span className="font-extrabold text-[#1B2521]">{registeredStudentSlip.class}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">House Allocated</span>
                    <span className="font-extrabold text-[#1B2521]">{registeredStudentSlip.house}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Default Portal Password</span>
                    <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">1234</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tuition Billing</span>
                    <span className="font-bold text-[#1B2521]">{registeredStudentSlip.feeAmount} ({registeredStudentSlip.feeStatus})</span>
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
                  <span>Student Admissions Dossier & Registry Form</span>
                </div>
                <h3 className="text-2xl font-black text-[#1B2521] mt-1">Intricate Student Enrollment</h3>
                <p className="text-xs text-gray-500">
                  Complete the student personal bio-data, academic stream, parent details, and medical health record.
                </p>
              </div>

              {/* SECTION 1: PERSONAL BIO-DATA */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <User className="w-4 h-4" />
                  <span>Section 1: Student Personal Bio-Data</span>
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
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] uppercase"
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
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
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

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Religion</label>
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
                      placeholder="e.g. Asthmatic, None"
                      value={studentForm.medicalConditions}
                      onChange={(e) => setStudentForm({ ...studentForm, medicalConditions: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: ACADEMIC ALLOCATION & STREAM */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <Award className="w-4 h-4" />
                  <span>Section 2: Academic Program & Class Allocation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
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
                    <label className="block font-bold text-gray-700 mb-1">Academic Track Stream</label>
                    <input
                      type="text"
                      readOnly
                      value={studentForm.academicTrack}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-600 font-bold"
                    />
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
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
                    <label className="block font-bold text-gray-700 mb-1">Relationship</label>
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
                    <label className="block font-bold text-gray-700 mb-1">Guardian Phone (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0803 123 4567"
                      value={studentForm.guardianPhone}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Residential Address in Lagos *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 36 Palm Avenue, Mushin, Lagos"
                      value={studentForm.guardianAddress}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianAddress: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Emergency Contact Person</label>
                    <input
                      type="text"
                      placeholder="e.g. Mrs. Folake Adeleke"
                      value={studentForm.emergencyContact}
                      onChange={(e) => setStudentForm({ ...studentForm, emergencyContact: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Emergency Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 0813 400 0644"
                      value={studentForm.emergencyPhone}
                      onChange={(e) => setStudentForm({ ...studentForm, emergencyPhone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: TUITION & BILLING SETUP */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <CreditCard className="w-4 h-4" />
                  <span>Section 4: Tuition Billing & Financial Setup</span>
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

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Default Student Portal PIN</label>
                    <input
                      type="text"
                      readOnly
                      value="1234 (Default)"
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-600 font-mono font-bold"
                    />
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
                  <span>Enroll Student & Generate Admission Dossier →</span>
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
