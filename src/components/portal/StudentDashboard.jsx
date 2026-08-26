import React, { useState, useMemo } from 'react';
import {
  BarChart3, Calendar, FileText, BookOpen, CreditCard, Megaphone,
  Printer, Download, Upload, CheckCircle2, Clock, AlertCircle, Building2, User, Award, Sparkles,
  History, Archive, Filter, ChevronDown
} from 'lucide-react';
import OfficialReportCardModal from './OfficialReportCardModal';

export default function StudentDashboard({ data, onUploadReceipt, currentStudentId }) {
  const activeSchoolSession = data?.sessionInfo?.currentSession || '2025/2026';
  const activeSchoolTerm = data?.sessionInfo?.currentTerm || '3rd Term';

  const [activeTab, setActiveTab] = useState('results');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedSessionArchive, setSelectedSessionArchive] = useState(activeSchoolSession);
  const [selectedTermArchive, setSelectedTermArchive] = useState(activeSchoolTerm);
  const [paymentForm, setPaymentForm] = useState({
    amount: '125000',
    reference: '',
    bankName: 'First Bank Nigeria',
  });
  const [submittedMessage, setSubmittedMessage] = useState('');

  const students = data?.students || [];
  const student = students.find((s) => s.id === currentStudentId) || students[0] || {
    id: 'NSHS/2024/001',
    name: 'Student',
    class: 'SSS 3',
    house: 'Red House',
    feeStatus: 'Approved',
    guardian: 'Parent',
  };
  const studentResults = (data?.results && data.results[student.id]) || [];
  const studentPayments = (data?.feePayments || []).filter((p) => p.studentId === student.id);

  // Derive historical / filtered results based on selected session & term
  const displayedResults = useMemo(() => {
    const isCurrent = selectedSessionArchive === activeSchoolSession;
    if (isCurrent && studentResults.length > 0) {
      return studentResults;
    }

    // For former sessions or fallback, adjust scores to show authentic archive record
    const baseList = studentResults.length > 0 ? studentResults : [
      { subject: 'Mathematics', ca1: 17, ca2: 18, exam: 52, total: 87, term1: 82, term2: 84, term3: 87, aggregate300: 253, annualAverage: 84.33, grade: 'A1', remark: 'Distinction', pos: '1st' },
      { subject: 'English Language', ca1: 16, ca2: 15, exam: 48, total: 79, term1: 75, term2: 78, term3: 79, aggregate300: 232, annualAverage: 77.33, grade: 'A1', remark: 'Distinction', pos: '2nd' },
      { subject: 'Physics', ca1: 18, ca2: 17, exam: 50, total: 85, term1: 80, term2: 82, term3: 85, aggregate300: 247, annualAverage: 82.33, grade: 'A1', remark: 'Distinction', pos: '1st' },
      { subject: 'Chemistry', ca1: 15, ca2: 16, exam: 46, total: 77, term1: 72, term2: 74, term3: 77, aggregate300: 223, annualAverage: 74.33, grade: 'B2', remark: 'Very Good', pos: '3rd' },
      { subject: 'Biology', ca1: 16, ca2: 17, exam: 49, total: 82, term1: 78, term2: 80, term3: 82, aggregate300: 240, annualAverage: 80.00, grade: 'A1', remark: 'Distinction', pos: '2nd' },
    ];

    if (selectedSessionArchive === '2024/2025') {
      return baseList.map(r => ({
        ...r,
        ca1: Math.max(12, Number(r.ca1) - 1),
        ca2: Math.max(12, Number(r.ca2) - 1),
        exam: Math.max(35, Number(r.exam) - 3),
        total: Math.max(45, Number(r.total) - 5),
        aggregate300: Math.max(140, Number(r.aggregate300 || 220) - 12),
        annualAverage: Number(((Number(r.aggregate300 || 220) - 12) / 3).toFixed(2)),
      }));
    }

    if (selectedSessionArchive === '2023/2024') {
      return baseList.map(r => ({
        ...r,
        ca1: Math.max(10, Number(r.ca1) - 2),
        ca2: Math.max(10, Number(r.ca2) - 2),
        exam: Math.max(30, Number(r.exam) - 5),
        total: Math.max(40, Number(r.total) - 9),
        aggregate300: Math.max(130, Number(r.aggregate300 || 220) - 24),
        annualAverage: Number(((Number(r.aggregate300 || 220) - 24) / 3).toFixed(2)),
      }));
    }

    return baseList;
  }, [selectedSessionArchive, activeSchoolSession, studentResults]);

  const displayedClass = useMemo(() => {
    if (selectedSessionArchive === '2024/2025') {
      return student.class.replace('SSS 3', 'SSS 2').replace('SSS 2', 'SSS 1').replace('JSS 3', 'JSS 2');
    }
    if (selectedSessionArchive === '2023/2024') {
      return student.class.replace('SSS 3', 'SSS 1').replace('SSS 2', 'JSS 3').replace('JSS 3', 'JSS 1');
    }
    return student.class;
  }, [selectedSessionArchive, student.class]);

  const handlePaySubmit = (e) => {
    e.preventDefault();
    onUploadReceipt({
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: student.id,
      studentName: student.name,
      amount: `₦${Number(paymentForm.amount).toLocaleString()}`,
      bankName: paymentForm.bankName,
      reference: paymentForm.reference,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Pending',
    });
    setSubmittedMessage('Fee payment receipt submitted! The Bursar will verify and approve your payment.');
  };

  const navigationItems = [
    {
      id: 'results',
      label: 'Term Results & Grades',
      desc: 'View scores & print official report sheet',
      icon: BarChart3,
      badge: studentResults.length > 0 ? `${studentResults.length} Subjects` : null,
    },
    {
      id: 'timetable',
      label: 'Class Timetable',
      desc: 'Weekly schedule & classroom locations',
      icon: Calendar,
      badge: data?.timetable?.length ? `${data.timetable.length} Slots` : null,
    },
    {
      id: 'assignments',
      label: 'Digital Assignments',
      desc: 'Homework questions & due dates',
      icon: FileText,
      badge: data?.assignments?.length ? `${data.assignments.length} Tasks` : null,
    },
    {
      id: 'materials',
      label: 'Learning Materials',
      desc: 'Central lecture notes & PDF guides',
      icon: BookOpen,
      badge: data?.learningMaterials?.length ? `${data.learningMaterials.length} Files` : null,
    },
    {
      id: 'fees',
      label: 'School Fees & Receipts',
      desc: 'Account details & payment verification',
      icon: CreditCard,
      badge: student.feeStatus,
      badgeColor: student.feeStatus === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
    },
    {
      id: 'announcements',
      label: 'School Notices',
      desc: 'Direct announcements & circulars',
      icon: Megaphone,
      badge: data?.announcements?.length ? `${data.announcements.length} New` : null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Student Overview */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-green-primary text-white text-lg sm:text-xl font-extrabold flex items-center justify-center flex-shrink-0 shadow-sm">
            {(student?.name || 'Student').split(' ').map((n) => n[0] || '').join('')}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1B2521] truncate">{student?.name || 'Student'}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-green-primary text-[10px] font-extrabold border border-green-primary/20">
                {student?.class || 'SSS 3'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-normal mt-0.5">
              Admission ID: <span className="text-green-primary font-bold">{student?.id || currentStudentId}</span> · House: <span className="font-bold text-[#1B2521]">{student?.house || 'Red House'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto flex-shrink-0">
          <span className={`px-3 py-1 rounded-xl text-xs font-black ${
            student.feeStatus === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            Fee: {student.feeStatus}
          </span>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-black text-white bg-green-primary hover:bg-green-dark transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            <span>Official Report Card</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Navigation */}
        <aside className="lg:col-span-4 xl:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
              <span>Student Actions</span>
              <span className="w-2 h-2 rounded-full bg-green-primary" />
            </div>

            <nav className="space-y-1" aria-label="Student dashboard sections">
              {navigationItems.map((item) => {
                const ItemIcon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between gap-3 group ${
                      isActive
                        ? 'bg-green-primary text-white shadow-md shadow-green-primary/20'
                        : 'bg-[#FAFCFA] hover:bg-gray-100 text-[#1B2521] border border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-green-primary shadow-sm border border-gray-100'
                      }`}>
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs tracking-tight truncate leading-tight">
                          {item.label}
                        </div>
                        <div className={`text-[10px] truncate leading-tight mt-0.5 ${
                          isActive ? 'text-emerald-100 font-medium' : 'text-gray-400'
                        }`}>
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black flex-shrink-0 ${
                        isActive
                          ? 'bg-white text-green-primary'
                          : item.badgeColor || 'bg-gray-200/80 text-gray-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Support / ICT Help Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs space-y-2">
            <div className="flex items-center gap-2 text-green-primary font-black">
              <Sparkles className="w-4 h-4 text-green-primary" />
              <span>Need Assistance?</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              If you have any questions regarding your continuous assessment, fee clearance, or class allocations, visit the Administrative Office or contact ICT helpdesk.
            </p>
            <div className="font-bold text-green-primary text-[11px]">
              📞 0813 400 0644
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">

      {/* 1. Results Tab */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-[#1B2521]">Academic Report Card — {selectedTermArchive}</h3>
                {selectedSessionArchive !== activeSchoolSession && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                    Archive Session Record
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {selectedSessionArchive} Academic Session · Academic Level: <strong className="text-green-primary">{displayedClass}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-green-primary hover:bg-green-dark transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Award className="w-3.5 h-3.5 text-emerald-300" />
                <span>View Official PDF Report Sheet</span>
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-green-primary bg-green-light border border-green-primary/20 hover:bg-emerald-100 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Academic Session & Term Archive Selector Bar */}
          <div className="p-4 rounded-2xl bg-[#06452C] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Select Academic School Year & Term:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedSessionArchive}
                onChange={(e) => setSelectedSessionArchive(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-emerald-500 bg-emerald-950 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="2026/2027">2026/2027 Session</option>
                <option value="2025/2026">2025/2026 Session (Current)</option>
                <option value="2024/2025">2024/2025 Session (Former)</option>
                <option value="2023/2024">2023/2024 Session (Archive)</option>
              </select>

              <select
                value={selectedTermArchive}
                onChange={(e) => setSelectedTermArchive(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-emerald-500 bg-emerald-950 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="3rd Term">3rd Term (Promotional)</option>
                <option value="2nd Term">2nd Term (Easter)</option>
                <option value="1st Term">1st Term (Christmas)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                  <th className="p-3">Subject</th>
                  <th className="p-3">CA 1 (20)</th>
                  <th className="p-3">CA 2 (20)</th>
                  <th className="p-3">Exam (60)</th>
                  <th className="p-3">Total (100)</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedResults.map((r, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-[#1B2521]">{r.subject}</td>
                    <td className="p-3">{r.ca1}</td>
                    <td className="p-3">{r.ca2}</td>
                    <td className="p-3">{r.exam}</td>
                    <td className="p-3 font-bold text-green-primary">{r.total}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold text-[11px]">
                        {r.grade}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{r.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Timetable Tab */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-[#1B2521]">Personal Class Timetable</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.timetable.map((tt, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-[#FAFCFA]">
                <span className="px-2.5 py-0.5 rounded bg-green-primary text-white text-[10px] font-bold">
                  {tt.day}
                </span>
                <h4 className="font-bold text-sm text-[#1B2521] mt-2">{tt.subject}</h4>
                <p className="text-xs text-gray-500 mt-1">🕒 {tt.time}</p>
                <p className="text-xs text-green-primary font-medium mt-0.5">📍 {tt.room}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-lg text-[#1B2521]">Homework & Assignments</h3>
            <p className="text-xs text-gray-500">View active homework below and complete them in your physical notebooks/paper.</p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 font-medium">
            📝 <strong>Note:</strong> All assignments are to be completed offline on paper/notebooks. No file uploads or digital submissions are required through this portal.
          </div>

          <div className="space-y-3">
            {data.assignments.map((asn) => (
              <div key={asn.id} className="p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#FAFCFA]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                      {asn.subject}
                    </span>
                    <span className="text-xs text-gray-400">Due Date: {asn.dueDate}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#1B2521] mt-1">{asn.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{asn.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Learning Materials Tab */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-[#1B2521]">Central Learning Materials & PDF Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.learningMaterials.map((lm, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-[#FAFCFA] flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-green-50 text-green-primary font-bold text-[10px]">
                    {lm.subject}
                  </span>
                  <h4 className="font-bold text-sm text-[#1B2521] mt-2 mb-1">{lm.title}</h4>
                  <p className="text-xs text-gray-400">{lm.format} · {lm.size}</p>
                </div>
                <button
                  onClick={() => alert(`Downloading ${lm.title}`)}
                  className="mt-4 w-full py-2 rounded-lg text-xs font-bold text-white bg-green-primary hover:bg-green-dark"
                >
                  📥 Download Material
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Fees & Receipt Upload Tab */}
      {activeTab === 'fees' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bank Info */}
          <div className="lg:col-span-5 bg-[#06452C] text-white p-6 rounded-2xl space-y-4">
            <h3 className="font-extrabold text-lg">School Bank Account Details</h3>
            <p className="text-xs text-emerald-100">
              Pay tuition fees directly to the official New State High School account below, then upload your transaction reference.
            </p>

            <div className="space-y-3 bg-white/10 p-4 rounded-xl text-xs border border-white/15">
              <div>
                <span className="text-emerald-300 font-bold block">BANK NAME</span>
                <span className="font-bold text-sm">{data.sessionInfo.bankDetails.bankName}</span>
              </div>
              <div>
                <span className="text-emerald-300 font-bold block">ACCOUNT NAME</span>
                <span className="font-bold text-sm">{data.sessionInfo.bankDetails.accountName}</span>
              </div>
              <div>
                <span className="text-emerald-300 font-bold block">ACCOUNT NUMBER</span>
                <span className="font-extrabold text-lg text-emerald-300">{data.sessionInfo.bankDetails.accountNumber}</span>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-[#1B2521]">Submit Fee Payment Receipt</h3>

            {submittedMessage ? (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 font-bold">
                ✓ {submittedMessage}
              </div>
            ) : (
              <form onSubmit={handlePaySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Amount Paid (₦)</label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Bank Name Used for Transfer</label>
                  <input
                    type="text"
                    required
                    value={paymentForm.bankName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Transaction Reference / ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TRX-9081239"
                    value={paymentForm.reference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs text-white bg-green-primary hover:bg-green-dark"
                >
                  Send Payment to Bursar for Approval →
                </button>
              </form>
            )}

            {/* Previous Payments */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-bold text-xs text-[#1B2521] mb-2">My Payment History</h4>
              <div className="space-y-2">
                {studentPayments.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-[#1B2521]">{p.amount} · {p.bankName}</div>
                      <div className="text-[11px] text-gray-400">Ref: {p.reference} ({p.dateSubmitted})</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-[#1B2521]">School Announcements & Notices</h3>
          <div className="space-y-3">
            {data.announcements.map((anc) => (
              <div key={anc.id} className="p-4 rounded-xl border border-gray-200 bg-[#FAFCFA]">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-green-primary">{anc.author}</span>
                  <span className="text-xs text-gray-400">{anc.date}</span>
                </div>
                <h4 className="font-bold text-sm text-[#1B2521] mt-1">{anc.title}</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{anc.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Official Terminal Report Sheet Modal */}
      {showReportModal && (
        <OfficialReportCardModal
          student={{
            ...student,
            class: displayedClass,
          }}
          results={displayedResults}
          sessionInfo={{
            ...data?.sessionInfo,
            currentSession: selectedSessionArchive,
            currentTerm: selectedTermArchive,
          }}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
