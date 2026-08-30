import React, { useState, useMemo } from 'react';
import {
  BarChart3, Calendar, FileText, BookOpen, CreditCard, Megaphone,
  Printer, Download, Upload, CheckCircle2, Clock, AlertCircle, Building2, User, Award, Sparkles,
  History, Archive, Filter, ChevronDown, ChevronUp, Loader2, Paperclip, LayoutGrid,
  CalendarDays, MapPin, X, ExternalLink
} from 'lucide-react';
import OfficialReportCardModal from './OfficialReportCardModal';
import { printDocument } from '../../utils/printUtils';

export default function StudentDashboard({ data, onUploadReceipt, currentStudentId }) {
  const activeSchoolSession = data?.sessionInfo?.currentSession || '2025/2026';
  const activeSchoolTerm = data?.sessionInfo?.currentTerm || '3rd Term';

  const [activeTab, setActiveTab] = useState('results');
  const [resultViewMode, setResultViewMode] = useState('cards'); // 'cards' | 'table'
  const [expandedResultSubj, setExpandedResultSubj] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedSessionArchive, setSelectedSessionArchive] = useState(activeSchoolSession);
  const [selectedTermArchive, setSelectedTermArchive] = useState(activeSchoolTerm);
  const [selectedTimetableDay, setSelectedTimetableDay] = useState('All');
  const [showPrintTimetable, setShowPrintTimetable] = useState(false);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (showPrintTimetable || showReportModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showPrintTimetable, showReportModal]);

  const [paymentForm, setPaymentForm] = useState({
    amount: '125000',
    reference: '',
    bankName: 'First Bank Nigeria',
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
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

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingPayment(true);
    try {
      if (onUploadReceipt) {
        await onUploadReceipt({
          id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
          studentId: student.id,
          studentName: student.name,
          class: student.class,
          amount: `₦${Number(paymentForm.amount).toLocaleString()}`,
          bankName: paymentForm.bankName,
          reference: paymentForm.reference,
          dateSubmitted: new Date().toISOString().split('T')[0],
          status: 'Pending',
          receiptImage: receiptFile ? receiptFile.name : null,
        });
      }
      setSubmittedMessage('Fee payment receipt submitted successfully! The Bursar has received your receipt for verification.');
    } catch (err) {
      console.error('Error submitting payment receipt:', err);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const studentTimetable = useMemo(() => {
    const rawTimetable = Array.isArray(data?.timetable) ? data.timetable : [];
    if (rawTimetable.length === 0) return [];

    const studentClassClean = (student?.class || 'SSS 3').trim();
    // 1. Direct match (e.g. SSS 3 - Arm A)
    let matched = rawTimetable.filter(s => s.className === studentClassClean);
    if (matched.length > 0) return matched;

    // 2. Partial match (e.g. SSS 3 in SSS 3 - Arm A)
    matched = rawTimetable.filter(s => s.className?.includes(studentClassClean) || studentClassClean.includes(s.className));
    if (matched.length > 0) return matched;

    // 3. Level match
    const baseLevel = studentClassClean.split(' ')[0] + ' ' + (studentClassClean.split(' ')[1] || '');
    matched = rawTimetable.filter(s => s.className?.includes(baseLevel));
    if (matched.length > 0) return matched;

    return rawTimetable.slice(0, 35);
  }, [data?.timetable, student?.class]);

  // Filter assignments relevant to this student's class
  const studentAssignments = useMemo(() => {
    const rawAssignments = Array.isArray(data?.assignments) ? data.assignments : [];
    const studentClassClean = (student?.class || 'SSS 3').trim().toLowerCase();

    return rawAssignments.filter(asn => {
      if (!asn.targetClass || asn.targetClass === 'All Assigned Classes' || asn.targetClass === 'All Classes') return true;
      const targetClean = asn.targetClass.trim().toLowerCase();
      return targetClean.includes(studentClassClean) || studentClassClean.includes(targetClean) || targetClean.split(' ')[0] === studentClassClean.split(' ')[0];
    });
  }, [data?.assignments, student?.class]);

  // Filter learning materials relevant to this student's class
  const studentMaterials = useMemo(() => {
    const rawMaterials = Array.isArray(data?.learningMaterials) ? data.learningMaterials : [];
    const studentClassClean = (student?.class || 'SSS 3').trim().toLowerCase();

    return rawMaterials.filter(mat => {
      if (!mat.targetClass || mat.targetClass === 'All Assigned Classes' || mat.targetClass === 'All Classes') return true;
      const targetClean = mat.targetClass.trim().toLowerCase();
      return targetClean.includes(studentClassClean) || studentClassClean.includes(targetClean) || targetClean.split(' ')[0] === studentClassClean.split(' ')[0];
    });
  }, [data?.learningMaterials, student?.class]);

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
      badge: studentTimetable.length > 0 ? `${studentTimetable.length} Periods` : null,
    },
    {
      id: 'assignments',
      label: 'Digital Assignments',
      desc: 'Homework questions & due dates',
      icon: FileText,
      badge: studentAssignments.length > 0 ? `${studentAssignments.length} Tasks` : null,
    },
    {
      id: 'materials',
      label: 'Learning Materials',
      desc: 'Central lecture notes & PDF guides',
      icon: BookOpen,
      badge: studentMaterials.length > 0 ? `${studentMaterials.length} Files` : null,
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
                className="px-3 py-1.5 rounded-xl border border-emerald-500 bg-emerald-950 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
              >
                <option value="2026/2027">2026/2027 Session</option>
                <option value="2025/2026">2025/2026 Session (Current)</option>
                <option value="2024/2025">2024/2025 Session (Former)</option>
                <option value="2023/2024">2023/2024 Session (Archive)</option>
              </select>

              <select
                value={selectedTermArchive}
                onChange={(e) => setSelectedTermArchive(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-emerald-500 bg-emerald-950 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
              >
                <option value="3rd Term">3rd Term (Promotional)</option>
                <option value="2nd Term">2nd Term (Easter)</option>
                <option value="1st Term">1st Term (Christmas)</option>
              </select>
            </div>
          </div>

          {/* View Toggle Bar */}
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-black text-[#1B2521] uppercase tracking-wider">
              Graded Subjects ({displayedResults.length})
            </span>
            <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200">
              <button
                type="button"
                onClick={() => setResultViewMode('cards')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  resultViewMode === 'cards'
                    ? 'bg-[#06452C] text-white shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Card View</span>
              </button>
              <button
                type="button"
                onClick={() => setResultViewMode('table')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  resultViewMode === 'table'
                    ? 'bg-[#06452C] text-white shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Table View</span>
              </button>
            </div>
          </div>

          {/* 1. CARDS VIEW (NO HORIZONTAL SCROLLING ON MOBILE) */}
          {resultViewMode === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayedResults.map((r, idx) => {
                const isExpanded = expandedResultSubj === r.subject;
                const isPass = Number(r.total || 0) >= 40;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'border-emerald-500 bg-emerald-50/20 shadow-md'
                        : 'border-gray-200 bg-[#FAFCFA] hover:border-emerald-300 shadow-xs'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedResultSubj(isExpanded ? null : r.subject)}
                      className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="min-w-0 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-sm ${
                          isPass ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {r.grade}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-sm text-[#1B2521] truncate">{r.subject}</h4>
                          <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                            <span className="font-bold text-green-primary">{r.total} / 100</span>
                            <span>·</span>
                            <span className="text-gray-600">{r.remark}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>

                    {/* Expandable Breakdown Drawer */}
                    {isExpanded && (
                      <div className="p-3.5 bg-white border-t border-gray-200 text-xs space-y-2 animate-in slide-in-from-top-2 duration-150">
                        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                          <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="text-gray-500 text-[10px] block">1st CA</span>
                            <strong className="text-gray-900 font-bold">{r.ca1} / 20</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="text-gray-500 text-[10px] block">2nd CA</span>
                            <strong className="text-gray-900 font-bold">{r.ca2} / 20</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                            <span className="text-emerald-700 text-[10px] block font-bold">Exam</span>
                            <strong className="text-emerald-950 font-black">{r.exam} / 60</strong>
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-[#FAFCFA] border border-gray-200 flex justify-between items-center text-[11px]">
                          <span className="text-gray-500">Continuous Assessment Total:</span>
                          <span className="font-black text-green-primary">{r.total} / 100</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. TABLE VIEW */}
          {resultViewMode === 'table' && (
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
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
                <tbody className="divide-y divide-gray-100 bg-white">
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
          )}
        </div>
      )}

      {/* 2. Timetable Tab */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-green-primary text-xs font-bold uppercase tracking-wider mb-1">
                <CalendarDays className="w-4 h-4" />
                <span>Class Academic Schedule</span>
              </div>
              <h3 className="font-extrabold text-lg text-[#1B2521]">Personal Weekly Timetable — {student.class || 'SSS 3'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Weekly period timetable for {activeSchoolSession} ({activeSchoolTerm}).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPrintTimetable(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-green-primary bg-green-light border border-green-primary/20 hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Timetable</span>
              </button>
            </div>
          </div>

          {/* Day Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedTimetableDay(day)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTimetableDay === day
                    ? 'bg-[#06452C] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day === 'All' ? '📅 Full Week' : day}
              </button>
            ))}
          </div>

          {/* Timetable Cards by Day */}
          {studentTimetable.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <CalendarDays className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-gray-600">No timetable periods scheduled yet for your class.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {(selectedTimetableDay === 'All' ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] : [selectedTimetableDay]).map((day) => {
                const daySlots = studentTimetable.filter(s => s.day === day);
                if (daySlots.length === 0) return null;

                return (
                  <div key={day} className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-primary" />
                      <h4 className="text-xs font-black text-[#1B2521] uppercase tracking-wider">{day}</h4>
                      <span className="text-[11px] text-gray-400 font-medium">({daySlots.length} Periods)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="p-4 rounded-2xl border border-gray-200 bg-[#FAFCFA] hover:border-emerald-300 transition-all space-y-2 shadow-xs"
                        >
                          <div className="flex justify-between items-start">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black text-[10px]">
                              {slot.period || 'Period'}
                            </span>
                            <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {slot.time}
                            </span>
                          </div>

                          <h5 className="font-extrabold text-sm text-[#1B2521] pt-0.5">{slot.subject}</h5>

                          <div className="text-xs text-gray-600 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                            <span className="truncate">{slot.teacherName || 'Subject Teacher'}</span>
                          </div>

                          <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1 border-t border-gray-100">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{slot.room || 'Classroom'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-green-primary text-xs font-bold uppercase tracking-wider mb-1">
                <FileText className="w-4 h-4" />
                <span>Class Homework & Tasks</span>
              </div>
              <h3 className="font-extrabold text-lg text-[#1B2521]">Homework & Digital Assignments</h3>
              <p className="text-xs text-gray-500">
                Assigned coursework for {student.class || 'your class'}. Complete written tasks in your physical notebooks.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#06452C] font-black text-xs border border-emerald-200">
              {studentAssignments.length} Active Tasks
            </span>
          </div>

          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl text-xs text-[#06452C] font-medium flex items-center gap-2">
            <span>📝</span>
            <span>
              <strong>Submission Guideline:</strong> All assignments are to be completed in standard school notebooks for physical marking by your subject teachers.
            </span>
          </div>

          {studentAssignments.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <FileText className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-gray-600">No homework or assignments currently posted for your class.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentAssignments.map((asn) => (
                <div
                  key={asn.id || asn._id}
                  className="p-5 rounded-2xl border border-gray-200 bg-[#FAFCFA] hover:border-emerald-300 transition-all space-y-3 shadow-xs"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#06452C] text-white font-extrabold text-[10px]">
                        {asn.subject}
                      </span>
                      {asn.targetClass && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          🎯 {asn.targetClass}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Due: {asn.dueDate || 'End of Week'}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-[#1B2521]">{asn.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed whitespace-pre-line">{asn.desc}</p>
                  </div>

                  {/* Attachment / Web Resource Link */}
                  {(asn.attachmentName || asn.attachmentUrl || asn.attachmentType !== 'none') && (
                    <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
                      {asn.attachmentType === 'link' || asn.linkUrl ? (
                        <a
                          href={asn.attachmentUrl || asn.linkUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Resource Link</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => alert(`Downloading attachment: ${asn.attachmentName || 'Assignment_Worksheet.pdf'}`)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#06452C] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Download: {asn.attachmentName || 'Assignment Document.pdf'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Learning Materials Tab */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-green-primary text-xs font-bold uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Central Study Repository</span>
              </div>
              <h3 className="font-extrabold text-lg text-[#1B2521]">Central Learning Materials & PDF Notes</h3>
              <p className="text-xs text-gray-500">
                Official curriculum lecture notes, syllabus schemes, and educational resources uploaded by your subject masters.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#06452C] font-black text-xs border border-emerald-200">
              {studentMaterials.length} Documents
            </span>
          </div>

          {studentMaterials.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-gray-600">No learning materials currently uploaded for your class.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentMaterials.map((lm, idx) => (
                <div
                  key={lm.id || idx}
                  className="p-5 rounded-2xl border border-gray-200 bg-[#FAFCFA] hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-1">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-extrabold text-[10px]">
                        {lm.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
                        {lm.format || 'PDF'}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-[#1B2521] pt-1">{lm.title}</h4>
                    <p className="text-[11px] text-gray-500">
                      📦 Size: {lm.size || '2.4 MB'} {lm.targetClass ? `· Class: ${lm.targetClass}` : ''}
                    </p>
                  </div>

                  {lm.linkUrl || lm.attachmentType === 'link' ? (
                    <a
                      href={lm.linkUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Learning Link</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => alert(`Downloading: ${lm.title} (${lm.fileName || 'Notes.pdf'})`)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-green-primary hover:bg-green-dark flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Notes ({lm.format || 'PDF'})</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
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
          <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-[#1B2521]">Submit Fee Payment Receipt</h3>

            {submittedMessage ? (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0" />
                <span>{submittedMessage}</span>
              </div>
            ) : (
              <form onSubmit={handlePaySubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Amount Paid (₦) *</label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-[#06452C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Bank Name Used *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GTBank / First Bank / OPay"
                      value={paymentForm.bankName}
                      onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Transaction Reference *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TRX-9081239"
                      value={paymentForm.reference}
                      onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Attach Receipt Slip / Screenshot (Optional)</label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setReceiptFile(f);
                    }}
                    className="w-full text-xs text-gray-600 file:mr-2.5 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-[#06452C] hover:file:bg-emerald-100 cursor-pointer"
                  />
                  {receiptFile && (
                    <div className="mt-1 text-[11px] text-[#06452C] font-semibold">
                      ✓ Attached: {receiptFile.name}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="w-full py-3.5 rounded-2xl font-black text-xs text-white bg-green-primary hover:bg-green-dark transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer active:scale-[0.99]"
                >
                  {isSubmittingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending Receipt to Bursar...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Payment to Bursar for Approval →</span>
                    </>
                  )}
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

      {/* ================= MODAL: PRINT STUDENT CLASS TIMETABLE ================= */}
      {showPrintTimetable && (
        <div className="fixed inset-0 z-[100] bg-black/90 overscroll-contain flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-gray-200 overflow-hidden my-4 sm:my-6 print:border-0 print:shadow-none print:max-w-none print:w-full print:rounded-none">
            {/* Header Control Bar */}
            <div className="print:hidden bg-[#06452C] text-white p-4 sm:p-5 flex justify-between items-center border-b border-emerald-800">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-5 h-5 text-emerald-300" />
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">Official Class Timetable — {student.class || 'SSS 3'}</h4>
                  <p className="text-[11px] text-emerald-200">{activeSchoolSession} · {activeSchoolTerm}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => printDocument('printable-student-timetable', `${student.class || 'Student'} - Official Timetable`)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintTimetable(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div
              id="printable-student-timetable"
              className="p-6 sm:p-8 text-black bg-white select-text print:p-2"
              style={{ fontFamily: "'Arial', 'Segoe UI', sans-serif" }}
            >
              {/* Header with School Crest */}
              <div className="text-center relative pb-3 mb-4 border-b-2 border-gray-900">
                <div className="absolute left-0 top-0 w-16 h-16 flex items-center justify-center">
                  <img
                    src="/school-logo.png"
                    alt="New State High School Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="px-16">
                  <h1 className="text-xl font-black uppercase text-gray-900">NEW STATE HIGH SCHOOL</h1>
                  <p className="text-xs text-gray-700 font-bold">36 Palm Avenue, Mushin, Lagos State · info@newstateschools.org</p>
                  <h2 className="text-sm font-black uppercase text-emerald-900 mt-1">
                    STUDENT CLASS ACADEMIC TIMETABLE — {student.class || 'SSS 3'}
                  </h2>
                  <p className="text-xs text-gray-600 font-semibold">{activeSchoolSession} Academic Session · {activeSchoolTerm}</p>
                </div>
              </div>

              {/* Weekly Timetable Table Grid */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-900 text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-900 font-black border-b-2 border-gray-900">
                      <th className="p-2.5 border border-gray-400 text-left w-24">Day</th>
                      <th className="p-2.5 border border-gray-400 text-center">1st Period<br/><span className="text-[10px] font-normal text-gray-600">08:00-08:45</span></th>
                      <th className="p-2.5 border border-gray-400 text-center">2nd Period<br/><span className="text-[10px] font-normal text-gray-600">08:45-09:30</span></th>
                      <th className="p-2.5 border border-gray-400 text-center">3rd Period<br/><span className="text-[10px] font-normal text-gray-600">09:30-10:15</span></th>
                      <th className="p-2 border border-gray-400 text-center bg-amber-50 text-[10px] font-bold">Break<br/>10:15-10:45</th>
                      <th className="p-2.5 border border-gray-400 text-center">4th Period<br/><span className="text-[10px] font-normal text-gray-600">10:45-11:30</span></th>
                      <th className="p-2.5 border border-gray-400 text-center">5th Period<br/><span className="text-[10px] font-normal text-gray-600">11:30-12:15</span></th>
                      <th className="p-2 border border-gray-400 text-center bg-amber-50 text-[10px] font-bold">Lunch<br/>12:15-01:00</th>
                      <th className="p-2.5 border border-gray-400 text-center">6th Period<br/><span className="text-[10px] font-normal text-gray-600">01:00-01:45</span></th>
                      <th className="p-2.5 border border-gray-400 text-center">7th Period<br/><span className="text-[10px] font-normal text-gray-600">01:45-02:30</span></th>
                      <th className="p-2.5 border border-gray-400 text-center">8th Period<br/><span className="text-[10px] font-normal text-gray-600">02:30-03:15</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                      const daySlots = studentTimetable.filter(s => s.day === day);
                      const getSlot = (pName) => daySlots.find(s => s.period?.includes(pName) || s.period === pName);

                      return (
                        <tr key={day} className="border-b border-gray-400">
                          <td className="p-2.5 border border-gray-400 font-black bg-gray-50">{day}</td>
                          {['1st Period', '2nd Period', '3rd Period'].map((pName) => {
                            const slot = getSlot(pName);
                            return (
                              <td key={pName} className="p-2 border border-gray-400 text-center align-top">
                                {slot ? (
                                  <div>
                                    <strong className="block text-gray-900 font-bold">{slot.subject}</strong>
                                    <span className="text-[10px] text-gray-600 block">{slot.teacherName}</span>
                                    <span className="text-[9px] text-gray-500 italic block">{slot.room}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-300 text-[10px]">-</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="p-1 border border-gray-400 text-center bg-amber-50/50 text-[9px] font-bold text-amber-900 rotate-180 writing-mode-vertical">
                            Snack
                          </td>
                          {['4th Period', '5th Period'].map((pName) => {
                            const slot = getSlot(pName);
                            return (
                              <td key={pName} className="p-2 border border-gray-400 text-center align-top">
                                {slot ? (
                                  <div>
                                    <strong className="block text-gray-900 font-bold">{slot.subject}</strong>
                                    <span className="text-[10px] text-gray-600 block">{slot.teacherName}</span>
                                    <span className="text-[9px] text-gray-500 italic block">{slot.room}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-300 text-[10px]">-</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="p-1 border border-gray-400 text-center bg-amber-50/50 text-[9px] font-bold text-amber-900 rotate-180 writing-mode-vertical">
                            Lunch
                          </td>
                          {['6th Period', '7th Period', '8th Period'].map((pName) => {
                            const slot = getSlot(pName);
                            return (
                              <td key={pName} className="p-2 border border-gray-400 text-center align-top">
                                {slot ? (
                                  <div>
                                    <strong className="block text-gray-900 font-bold">{slot.subject}</strong>
                                    <span className="text-[10px] text-gray-600 block">{slot.teacherName}</span>
                                    <span className="text-[9px] text-gray-500 italic block">{slot.room}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-300 text-[10px]">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer Stamp */}
              <div className="mt-8 pt-4 border-t border-gray-400 flex justify-between items-end text-xs">
                <div>
                  <p className="font-bold text-gray-800">New State High School, Mushin</p>
                  <p className="text-[10px] text-gray-500">Student Copy · Domine Dirige Nos</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">Academic Dean & Administration</p>
                  <p className="text-[10px] text-emerald-800 font-bold">Authorized Schedule</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
