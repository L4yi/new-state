import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator, FilePlus, Upload, Users, CheckCircle2,
  Calendar, BookOpen, Sparkles, UserCheck, UserX, Clock, ArrowRight,
  Award, ShieldCheck, FileText, Check, ListChecks, MessageSquare,
  Layers, Filter, Loader2, Paperclip, Link2, FileSpreadsheet, File, Printer,
  CalendarDays, MapPin, Megaphone, AlertTriangle, Search, X
} from 'lucide-react';
import OfficialReportCardModal from './OfficialReportCardModal';
import SuccessModal from './SuccessModal';

// Helper for flexible, whitespace/hyphen-agnostic class matching (handles 'SSS 3A', 'SSS 3 - Arm A', 'SSS 3A (Science)', etc.)
const normalizeClassName = (str) => (str || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');

const isClassMatch = (class1, class2) => {
  if (!class1 || !class2) return false;
  const c1 = normalizeClassName(class1).replace(/(science|arts|art|commerce|commercial|arm)/g, '');
  const c2 = normalizeClassName(class2).replace(/(science|arts|art|commerce|commercial|arm)/g, '');
  if (c1 === c2) return true;
  if (c1.includes(c2) || c2.includes(c1)) return true;
  return false;
};

// Formats Senior Secondary Arms with clear track labels (A = Science, B = Arts, C = Commerce)
const formatSeniorClass = (className) => {
  if (!className) return '';
  const c = className.toString().trim();
  if (/sss\s*3\s*[-–]?\s*(arm\s*)?a\b/i.test(c) || c === 'SSS 3A') return 'SSS 3A (Science)';
  if (/sss\s*3\s*[-–]?\s*(arm\s*)?b\b/i.test(c) || c === 'SSS 3B') return 'SSS 3B (Arts)';
  if (/sss\s*3\s*[-–]?\s*(arm\s*)?c\b/i.test(c) || c === 'SSS 3C') return 'SSS 3C (Commerce)';
  if (/sss\s*2\s*[-–]?\s*(arm\s*)?a\b/i.test(c) || c === 'SSS 2A') return 'SSS 2A (Science)';
  if (/sss\s*2\s*[-–]?\s*(arm\s*)?b\b/i.test(c) || c === 'SSS 2B') return 'SSS 2B (Arts)';
  if (/sss\s*2\s*[-–]?\s*(arm\s*)?c\b/i.test(c) || c === 'SSS 2C') return 'SSS 2C (Commerce)';
  if (/sss\s*1\s*[-–]?\s*(arm\s*)?a\b/i.test(c) || c === 'SSS 1A') return 'SSS 1A (Science)';
  if (/sss\s*1\s*[-–]?\s*(arm\s*)?b\b/i.test(c) || c === 'SSS 1B') return 'SSS 1B (Arts)';
  if (/sss\s*1\s*[-–]?\s*(arm\s*)?c\b/i.test(c) || c === 'SSS 1C') return 'SSS 1C (Commerce)';
  return c;
};

export default function TeacherDashboard({ data, currentUser, onSaveScore, onAddAssignment, onUploadMaterial }) {
  const [activeTab, setActiveTab] = useState('scores'); // 'scores', 'assignments', 'formclass', 'timetable'
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStudent, setReportStudent] = useState(null);
  const [selectedTeacherTimetableDay, setSelectedTeacherTimetableDay] = useState('All');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [modalFeedback, setModalFeedback] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  const isClassTeacher = Boolean(currentUser?.classAssigned);

  // 1. Extract all classes and subjects taught by this teacher from their profile
  const teacherSubjectsTaught = useMemo(() => {
    return currentUser?.subjectsTaught || [
      { subjectName: 'Mathematics', className: 'SSS 3 - Arm A' },
      { subjectName: 'Physics', className: 'SSS 3 - Arm A' },
      { subjectName: 'Mathematics', className: 'JSS 2 - Arm A' }
    ];
  }, [currentUser]);

  // Distinct classes this teacher teaches
  const distinctClasses = useMemo(() => {
    const classes = teacherSubjectsTaught.map(s => s.className).filter(Boolean);
    if (currentUser?.classAssigned && !classes.includes(currentUser.classAssigned)) {
      classes.unshift(currentUser.classAssigned);
    }
    return Array.from(new Set(classes));
  }, [teacherSubjectsTaught, currentUser]);

  // Active Class Filter for multi-class teachers
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');

  // 2. Filter students this teacher has access to see/grade
  const allowedStudents = useMemo(() => {
    const allStudents = Array.isArray(data?.students) ? data.students : [];
    if (!currentUser) return allStudents;

    return allStudents.filter(student => {
      // Check if teacher teaches any subject in this student's class, or is their class teacher
      const isClassTeacher = currentUser.classAssigned && isClassMatch(student.class, currentUser.classAssigned);
      const teachesInClass = teacherSubjectsTaught.some(s => isClassMatch(student.class, s.className));
      return isClassTeacher || teachesInClass;
    });
  }, [data?.students, currentUser, teacherSubjectsTaught]);

  // Students filtered by the active Class Toggle
  const classFilteredStudents = useMemo(() => {
    if (selectedClassFilter === 'All') return allowedStudents;
    return allowedStudents.filter(s => isClassMatch(s.class, selectedClassFilter));
  }, [allowedStudents, selectedClassFilter]);

  // Search-filtered students (for large classes / rosters)
  const searchableStudents = useMemo(() => {
    if (!studentSearchTerm.trim()) return classFilteredStudents;
    const q = studentSearchTerm.trim().toLowerCase();
    return classFilteredStudents.filter(s =>
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.class && s.class.toLowerCase().includes(q))
    );
  }, [classFilteredStudents, studentSearchTerm]);

  // Class specific students for assigned class
  const formClassStudents = useMemo(() => {
    if (!currentUser?.classAssigned) return [];
    return (Array.isArray(data?.students) ? data.students : []).filter(s =>
      isClassMatch(s.class, currentUser.classAssigned)
    );
  }, [data?.students, currentUser]);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [scores, setScores] = useState({ ca1: '', ca2: '', exam: '' });
  const [attendance, setAttendance] = useState({});
  const [savedMsg, setSavedMsg] = useState('');
  const [isSavingScore, setIsSavingScore] = useState(false);

  // Class Teacher remarks & ratings state
  const [selectedFormStudent, setSelectedFormStudent] = useState('');
  const [formTeacherRemark, setFormTeacherRemark] = useState('Outstanding academic performance; keep up the diligence.');
  const [affectiveScores, setAffectiveScores] = useState({
    punctuality: 5,
    neatness: 5,
    honesty: 5,
    politeness: 5,
    attentiveness: 5,
    leadership: 4,
    cooperation: 5,
  });
  const [formSavedMsg, setFormSavedMsg] = useState('');

  // Sync selectedStudent when searchableStudents changes
  useEffect(() => {
    if (searchableStudents.length > 0) {
      if (!searchableStudents.some(s => s.id === selectedStudent)) {
        setSelectedStudent(searchableStudents[0].id);
      }
    } else {
      setSelectedStudent('');
    }
  }, [searchableStudents, selectedStudent]);

  // Sync selectedFormStudent
  useEffect(() => {
    if (formClassStudents.length > 0 && !selectedFormStudent) {
      setSelectedFormStudent(formClassStudents[0].id);
    }
  }, [formClassStudents, selectedFormStudent]);

  // Auto-populate existing scores if student already has recorded scores in this subject
  useEffect(() => {
    if (selectedStudent && selectedSubject && data?.results && data.results[selectedStudent]) {
      const existing = (data.results[selectedStudent] || []).find(
        r => r.subject?.toLowerCase() === selectedSubject.toLowerCase()
      );
      if (existing) {
        setScores({
          ca1: existing.ca1 !== undefined ? String(existing.ca1) : '',
          ca2: existing.ca2 !== undefined ? String(existing.ca2) : '',
          exam: existing.exam !== undefined ? String(existing.exam) : '',
          term1: existing.term1 !== undefined ? String(existing.term1) : '62',
          term2: existing.term2 !== undefined ? String(existing.term2) : '66',
        });
      }
    }
  }, [selectedStudent, selectedSubject, data?.results]);

  // 3. STRICT SUBJECT LOCK: Determine subjects STRICTLY connected to this teacher's ID
  const studentObj = (Array.isArray(data?.students) ? data.students : []).find(s => s.id === selectedStudent);

  const teacherDistinctSubjects = useMemo(() => {
    return Array.from(new Set(teacherSubjectsTaught.map(s => s.subjectName).filter(Boolean)));
  }, [teacherSubjectsTaught]);

  const availableSubjects = useMemo(() => {
    if (!currentUser) return ['Mathematics'];

    // If a student is selected, find the exact subjects this teacher teaches in THIS student's class
    if (studentObj) {
      const matchSubjects = teacherSubjectsTaught
        .filter(s => isClassMatch(studentObj.class, s.className))
        .map(s => s.subjectName);

      if (matchSubjects.length > 0) {
        return Array.from(new Set(matchSubjects));
      }
    }

    // If a class filter is active, return subjects taught in that class
    if (selectedClassFilter !== 'All') {
      const matchedByClass = teacherSubjectsTaught
        .filter(s => isClassMatch(selectedClassFilter, s.className))
        .map(s => s.subjectName);

      if (matchedByClass.length > 0) {
        return Array.from(new Set(matchedByClass));
      }
    }

    return teacherDistinctSubjects;
  }, [currentUser, studentObj, teacherSubjectsTaught, selectedClassFilter, teacherDistinctSubjects]);

  // Auto-sync selectedSubject to availableSubjects when class filter or student changes
  useEffect(() => {
    if (availableSubjects.length > 0) {
      if (!selectedSubject || !availableSubjects.includes(selectedSubject)) {
        setSelectedSubject(availableSubjects[0]);
      }
    } else {
      setSelectedSubject('');
    }
  }, [availableSubjects, selectedSubject]);

  // Personalized Teaching Schedule
  const teacherTimetable = useMemo(() => {
    const rawTimetable = Array.isArray(data?.timetable) ? data.timetable : [];
    if (rawTimetable.length === 0) return [];

    const teacherName = currentUser?.name?.toLowerCase() || '';
    const assignedClasses = distinctClasses;
    const assignedSubjects = teacherDistinctSubjects.map(s => s.toLowerCase());

    // 1. Direct teacher name match
    let matched = rawTimetable.filter(s =>
      teacherName && s.teacherName && (
        s.teacherName.toLowerCase().includes(teacherName) ||
        teacherName.includes(s.teacherName.toLowerCase())
      )
    );

    if (matched.length > 0) return matched;

    // 2. Class + Subject match
    matched = rawTimetable.filter(s =>
      assignedClasses.some(c => isClassMatch(s.className, c)) &&
      assignedSubjects.some(sub => s.subject?.toLowerCase().includes(sub) || sub.includes(s.subject?.toLowerCase()))
    );

    if (matched.length > 0) return matched;

    // 3. Fallback to assigned class
    return rawTimetable.filter(s =>
      assignedClasses.some(c => isClassMatch(s.className, c))
    );
  }, [data?.timetable, currentUser, distinctClasses, teacherDistinctSubjects]);

  // Sync selectedSubject whenever availableSubjects changes
  useEffect(() => {
    if (availableSubjects.length > 0) {
      if (!availableSubjects.includes(selectedSubject)) {
        setSelectedSubject(availableSubjects[0]);
      }
    } else {
      setSelectedSubject('');
    }
  }, [availableSubjects, selectedSubject]);

  // New Assignment Form State with Class Selector & PDF / Link upload
  const [newAsn, setNewAsn] = useState({
    subject: teacherDistinctSubjects[0] || 'Mathematics',
    targetClass: distinctClasses[0] || 'All Assigned Classes',
    title: '',
    dueDate: '',
    desc: '',
    attachmentType: 'none', // 'none' | 'file' | 'link'
    fileName: '',
    fileSize: '',
    fileData: null,
    linkUrl: '',
  });
  const [asnMsg, setAsnMsg] = useState('');
  const [isSubmittingAsn, setIsSubmittingAsn] = useState(false);

  // New Study Material Form State
  const [newMat, setNewMat] = useState({
    title: '',
    subject: teacherDistinctSubjects[0] || 'Mathematics',
    targetClass: distinctClasses[0] || 'All Classes',
    format: 'PDF',
    attachmentType: 'file', // 'file' | 'link'
    fileName: '',
    linkUrl: '',
  });
  const [matMsg, setMatMsg] = useState('');
  const [isSubmittingMat, setIsSubmittingMat] = useState(false);

  const calculateGrade = (score) => {
    const total = parseFloat(score) || 0;
    if (total >= 75) return 'A1';
    if (total >= 70) return 'B2';
    if (total >= 65) return 'B3';
    if (total >= 60) return 'C4';
    if (total >= 55) return 'C5';
    if (total >= 50) return 'C6';
    if (total >= 45) return 'D7';
    if (total >= 40) return 'E8';
    return 'F9';
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      return;
    }
    setIsSavingScore(true);
    const ca1Num = parseInt(scores.ca1) || 0;
    const ca2Num = parseInt(scores.ca2) || 0;
    const examNum = parseInt(scores.exam) || 0;
    const term3Total = ca1Num + ca2Num + examNum;
    const term1Val = parseInt(scores.term1) || Math.max(40, term3Total - 2);
    const term2Val = parseInt(scores.term2) || Math.max(42, term3Total + 1);
    const aggregate300 = term3Total + term1Val + term2Val;
    const annualAverage = Number((aggregate300 / 3).toFixed(2));
    const grade = calculateGrade(annualAverage);
    const remark = annualAverage >= 75 ? 'Distinction' : annualAverage >= 60 ? 'Very Good' : annualAverage >= 50 ? 'Good' : annualAverage >= 40 ? 'Pass' : 'Fair';

    try {
      if (onSaveScore) {
        await onSaveScore(selectedStudent, {
          subject: selectedSubject,
          ca1: ca1Num,
          ca2: ca2Num,
          exam: examNum,
          total: term3Total,
          term1: term1Val,
          term2: term2Val,
          term3: term3Total,
          aggregate300,
          annualAverage,
          grade,
          remark,
        });
      }
      const savedStudentName = (data?.students || []).find((s) => s.id === selectedStudent)?.name || 'Student';
      setSavedMsg(`3rd Term score & Annual Collation saved for ${savedStudentName}! ${selectedSubject}: 3rd Term ${term3Total}/100 · Aggregate ${aggregate300}/300 · Annual Avg ${annualAverage}% (${grade})`);
      setModalFeedback({
        isOpen: true,
        title: 'Score Saved & Collated!',
        message: `${selectedSubject} scores for ${savedStudentName} recorded successfully: 3rd Term ${term3Total}/100, Cumulative ${aggregate300}/300, Annual Average ${annualAverage}% (${grade} - ${remark}).`,
        type: 'success'
      });
      setTimeout(() => setSavedMsg(''), 5500);
    } catch (err) {
      console.error('Error saving score:', err);
    } finally {
      setIsSavingScore(false);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingAsn(true);

    const payload = {
      id: `ASN-${Math.floor(100 + Math.random() * 900)}`,
      subject: newAsn.subject,
      targetClass: newAsn.targetClass,
      title: newAsn.title,
      dueDate: newAsn.dueDate,
      desc: newAsn.desc,
      attachmentType: newAsn.attachmentType,
      attachmentName: newAsn.fileName || (newAsn.attachmentType === 'link' ? 'Web Resource Link' : null),
      attachmentUrl: newAsn.linkUrl || newAsn.fileData || null,
      status: 'Pending Submission',
      dateCreated: new Date().toISOString().split('T')[0],
    };

    try {
      if (onAddAssignment) {
        await onAddAssignment(payload);
      }
      setNewAsn({
        subject: teacherDistinctSubjects[0] || 'Mathematics',
        targetClass: distinctClasses[0] || 'All Assigned Classes',
        title: '',
        dueDate: '',
        desc: '',
        attachmentType: 'none',
        fileName: '',
        fileSize: '',
        fileData: null,
        linkUrl: '',
      });
      setAsnMsg(`Assignment published to students in ${payload.targetClass}!`);
      setModalFeedback({
        isOpen: true,
        title: 'Assignment Published!',
        message: `"${payload.title}" has been dispatched to students in ${payload.targetClass} (Due: ${payload.dueDate}).`,
        type: 'success'
      });
      setTimeout(() => setAsnMsg(''), 4500);
    } catch (err) {
      console.error('Error posting assignment:', err);
    } finally {
      setIsSubmittingAsn(false);
    }
  };

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingMat(true);

    const payload = {
      id: `MAT-${Math.floor(100 + Math.random() * 900)}`,
      title: newMat.title,
      subject: newMat.subject,
      targetClass: newMat.targetClass,
      format: newMat.format,
      attachmentType: newMat.attachmentType,
      fileName: newMat.fileName,
      linkUrl: newMat.linkUrl,
      size: newMat.fileName ? '3.2 MB' : 'Online Document',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    try {
      if (onUploadMaterial) {
        await onUploadMaterial(payload);
      }
      setNewMat({
        title: '',
        subject: teacherDistinctSubjects[0] || 'Mathematics',
        targetClass: distinctClasses[0] || 'All Classes',
        format: 'PDF',
        attachmentType: 'file',
        fileName: '',
        linkUrl: '',
      });
      setMatMsg(`Learning material uploaded & dispatched to ${payload.targetClass}!`);
      setModalFeedback({
        isOpen: true,
        title: 'Learning Material Uploaded!',
        message: `"${payload.title}" is now available in the e-Library repository for ${payload.targetClass}.`,
        type: 'success'
      });
      setTimeout(() => setMatMsg(''), 4500);
    } catch (err) {
      console.error('Error uploading material:', err);
    } finally {
      setIsSubmittingMat(false);
    }
  };

  const handleSaveFormTeacherRemark = (e) => {
    e.preventDefault();
    if (!selectedFormStudent) return;
    const student = formClassStudents.find(s => s.id === selectedFormStudent);
    try {
      const saved = localStorage.getItem('nshs_portal_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.students = (parsed.students || []).map(s => {
          if (s.id === selectedFormStudent) {
            return {
              ...s,
              classTeacherRemark: formTeacherRemark,
              affectiveScores
            };
          }
          return s;
        });
        localStorage.setItem('nshs_portal_data', JSON.stringify(parsed));
      }
    } catch (err) {}
    setFormSavedMsg(`Class Teacher evaluation and terminal remark saved for ${student?.name || selectedFormStudent}!`);
    setModalFeedback({
      isOpen: true,
      title: 'Class Teacher Evaluation Saved!',
      message: `Terminal remark and affective conduct ratings recorded for ${student?.name || selectedFormStudent} on their official terminal dossier.`,
      type: 'success'
    });
    setTimeout(() => setFormSavedMsg(''), 4500);
  };

  const quickRemarks = [
    'Outstanding academic performance; keep up the diligence.',
    'Very good student with high leadership potential.',
    'Satisfactory performance; encouraged to be more focused in class.',
    'Brilliant result; recommended for academic prize award.'
  ];

  const announcementsList = Array.isArray(data?.announcements) ? data.announcements : [];

  return (
    <div className="space-y-6">
      {/* School Announcements Banner */}
      {announcementsList.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-green-primary text-xs font-black uppercase tracking-wider">
            <Megaphone className="w-4 h-4" />
            <span>School Broadcast Noticeboard</span>
          </div>
          <h4 className="font-extrabold text-sm text-[#1B2521]">{announcementsList[0].title}</h4>
          <p className="text-xs text-gray-700 leading-relaxed">{announcementsList[0].content}</p>
        </div>
      )}

      {/* Teacher Profile Banner */}
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black text-[#1B2521] tracking-tight">{currentUser?.name || 'Mr. Babatunde Ogunlesi'}</h2>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-green-primary text-xs font-extrabold border border-emerald-200 shadow-xs">
                {currentUser?.department || 'Sciences & Technology'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {isClassTeacher ? (
                <span className="px-3 py-1 rounded-lg bg-[#06452C] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                  <Users className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Class Teacher: {currentUser.classAssigned}</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-[#06452C] border border-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shadow-xs">
                  <BookOpen className="w-3.5 h-3.5 text-[#06452C]" />
                  <span>Subject Teacher (Specialist)</span>
                </span>
              )}

              {teacherSubjectsTaught.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 text-green-primary text-xs font-black border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Subjects: {teacherDistinctSubjects.join(', ')}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <span>{distinctClasses.length} Classes Assigned</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50/80 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-bold text-[#06452C] flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{isClassTeacher ? `Assigned Class: ${currentUser.classAssigned}` : 'Subject Teacher Workspace'}</span>
          </div>
        </div>

        {/* Role-Specific Workspace Notice */}
        {isClassTeacher ? (
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-[#06452C] flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>
              <strong>Class Teacher Clearance:</strong> You have full administrative rights for <strong>{currentUser.classAssigned}</strong> conduct evaluation, terminal remarks, and promotional broadsheets.
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 flex items-center gap-2 font-medium">
            <BookOpen className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>
              <strong>Subject Teacher Mode:</strong> Your grading workspace is strictly focused on Continuous Assessment & Exam score entry for your assigned subjects (<strong>{teacherDistinctSubjects.join(', ')}</strong>). Class broadsheet collation and terminal remarks are managed by the respective Class Teacher.
            </span>
          </div>
        )}

        {/* Tab Switcher Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isClassTeacher ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-2.5`}>
          <button
            onClick={() => setActiveTab('scores')}
            className={`p-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border ${
              activeTab === 'scores'
                ? 'bg-green-primary text-white border-green-primary shadow-md'
                : 'bg-[#FAFCFA] text-gray-700 hover:bg-gray-100 hover:text-[#1B2521] border-gray-200/80'
            }`}
          >
            <Calculator className="w-4 h-4 flex-shrink-0" />
            <span>{isClassTeacher ? '3rd Term Scores & Collation' : 'Subject Scores Entry'}</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`p-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border ${
              activeTab === 'assignments'
                ? 'bg-green-primary text-white border-green-primary shadow-md'
                : 'bg-[#FAFCFA] text-gray-700 hover:bg-gray-100 hover:text-[#1B2521] border-gray-200/80'
            }`}
          >
            <FilePlus className="w-4 h-4 flex-shrink-0" />
            <span>Assignments & Lecture Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className={`p-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border ${
              activeTab === 'timetable'
                ? 'bg-green-primary text-white border-green-primary shadow-md'
                : 'bg-[#FAFCFA] text-gray-700 hover:bg-gray-100 hover:text-[#1B2521] border-gray-200/80'
            }`}
          >
            <CalendarDays className="w-4 h-4 flex-shrink-0" />
            <span>Teaching Schedule ({teacherTimetable.length})</span>
          </button>

          {isClassTeacher && (
            <button
              onClick={() => setActiveTab('formclass')}
              className={`p-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border ${
                activeTab === 'formclass'
                  ? 'bg-green-primary text-white border-green-primary shadow-md'
                  : 'bg-emerald-50/70 text-[#06452C] hover:bg-emerald-100/80 border-emerald-300'
              }`}
            >
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>Class Teacher Evaluation</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= TAB 1: SUBJECT SCORE ENTRY ================= */}
      {activeTab === 'scores' && (
        <div className="space-y-5">
          
          {/* ================= DEDICATED CLASS & SUBJECT WORKSPACE DROPDOWNS ================= */}
          {distinctClasses.length > 0 && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#06452C] to-emerald-950 text-white border border-emerald-700/60 shadow-md space-y-3.5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Layers className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block leading-tight">
                      Class & Subject Workspace Selector
                    </span>
                    <p className="text-xs text-emerald-100 font-medium">
                      Select the class arm and subject you want to work on:
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-emerald-900/90 text-emerald-200 font-black text-[10px] border border-emerald-700/60">
                  {classFilteredStudents.length} Students in Roster
                </span>
              </div>

              {/* Class & Subject Dropdowns Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1. Target Class Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-emerald-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Select Class / Arm:</span>
                  </label>
                  <select
                    value={selectedClassFilter}
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-emerald-900/90 border border-emerald-600/80 text-white font-black text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer shadow-inner"
                  >
                    <option value="All" className="bg-[#06452C] text-white">
                      -- All Assigned Classes ({allowedStudents.length} Students) --
                    </option>
                    {distinctClasses.map((cls) => {
                      const countInClass = allowedStudents.filter(s => isClassMatch(s.class, cls)).length;
                      return (
                        <option key={cls} value={cls} className="bg-[#06452C] text-white font-bold">
                          {formatSeniorClass(cls)} ({countInClass} Students)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 2. Target Subject Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-emerald-200 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Select Subject to Grade:</span>
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-emerald-900/90 border border-emerald-600/80 text-white font-black text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer shadow-inner"
                  >
                    {availableSubjects.map((sub) => (
                      <option key={sub} value={sub} className="bg-[#06452C] text-white font-bold">
                        {sub} {selectedClassFilter !== 'All' ? `(${selectedClassFilter})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white p-4 sm:p-7 rounded-3xl border border-gray-100 shadow-md space-y-5">
              <div className="border-b border-gray-100 pb-3.5 flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-[#1B2521] tracking-tight">Continuous Assessment & Exam Score Entry</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Subject dropdown is strictly locked to subjects linked to your Teacher ID.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-[#06452C] font-black text-[10px] border border-emerald-200/80 uppercase tracking-wider hidden sm:inline-block">
                  Verified Engine
                </span>
              </div>

              {savedMsg && (
                <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-green-800 flex items-center gap-2 shadow-xs animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-green-primary flex-shrink-0" />
                  <span>{savedMsg}</span>
                </div>
              )}

              {classFilteredStudents.length === 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-medium flex items-start gap-3 shadow-xs">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black block text-amber-950 text-xs mb-0.5">No Registered Students in Class</span>
                    <p className="text-amber-800 leading-relaxed text-[11px]">
                      There are currently no students registered in {selectedClassFilter === 'All' ? 'any of your assigned classes' : selectedClassFilter}. Please switch to another class above, or register students via the school administration.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleScoreSubmit} className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-extrabold text-gray-800 text-xs flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Select Student</span>
                    </label>
                    <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-md">
                      Showing {searchableStudents.length} of {classFilteredStudents.length} students {selectedClassFilter !== 'All' ? `in ${selectedClassFilter}` : ''}
                    </span>
                  </div>

                  {/* Real-time Student Search Filter */}
                  <div className="relative mb-2">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search student by name, admission no, or class..."
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-primary focus:ring-2 focus:ring-emerald-500/20 bg-[#FAFCFA] font-medium text-[#1B2521] placeholder-gray-400 transition-all"
                    />
                    {studentSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setStudentSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                        aria-label="Clear search filter"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filtered Student Dropdown */}
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    disabled={searchableStudents.length === 0}
                    className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary focus:ring-2 focus:ring-emerald-500/20 bg-[#FAFCFA] font-bold text-[#1B2521] transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {searchableStudents.length === 0 ? (
                      <option value="">
                        {studentSearchTerm ? `-- No student matches "${studentSearchTerm}" --` : '-- No registered students in this class --'}
                      </option>
                    ) : (
                      <>
                        <option value="">-- Select a Student ({searchableStudents.length} available) --</option>
                        {searchableStudents.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({formatSeniorClass(s.class)} · {s.id})
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  {studentSearchTerm && searchableStudents.length === 0 && (
                    <div className="mt-2 flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 shadow-xs">
                      <span>No student found matching "<strong>{studentSearchTerm}</strong>"</span>
                      <button
                        type="button"
                        onClick={() => setStudentSearchTerm('')}
                        className="text-amber-800 font-bold underline hover:text-amber-950 cursor-pointer ml-2"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>

                {/* STRICT SUBJECT DROPDOWN (ONLY TEACHER'S ASSIGNED SUBJECTS) */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-extrabold text-gray-800 text-xs flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Select Subject (Locked to Assigned Subjects)</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ ID Connected Only
                    </span>
                  </div>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border-2 border-emerald-300 text-sm focus:outline-none focus:border-green-primary focus:ring-2 focus:ring-emerald-500/20 bg-emerald-50/40 font-bold text-[#06452C] transition-all"
                  >
                    {availableSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3-Part Continuous Assessment Inputs */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-1">
                  <div className="p-2.5 rounded-2xl bg-[#FAFCFA] border border-gray-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="font-extrabold text-gray-700 text-[11px]">3rd CA 1</label>
                      <span className="text-[9px] text-gray-400 font-bold">Max 20</span>
                    </div>
                    <input
                      type="number"
                      max="20"
                      min="0"
                      required
                      placeholder="0-20"
                      value={scores.ca1}
                      onChange={(e) => setScores({ ...scores, ca1: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-white font-black text-center text-[#1B2521]"
                    />
                  </div>

                  <div className="p-2.5 rounded-2xl bg-[#FAFCFA] border border-gray-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="font-extrabold text-gray-700 text-[11px]">3rd CA 2</label>
                      <span className="text-[9px] text-gray-400 font-bold">Max 20</span>
                    </div>
                    <input
                      type="number"
                      max="20"
                      min="0"
                      required
                      placeholder="0-20"
                      value={scores.ca2}
                      onChange={(e) => setScores({ ...scores, ca2: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-white font-black text-center text-[#1B2521]"
                    />
                  </div>

                  <div className="p-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="font-extrabold text-green-primary text-[11px]">3rd Exam</label>
                      <span className="text-[9px] text-emerald-600 font-bold">Max 60</span>
                    </div>
                    <input
                      type="number"
                      max="60"
                      min="0"
                      required
                      placeholder="0-60"
                      value={scores.exam}
                      onChange={(e) => setScores({ ...scores, exam: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-emerald-300 text-sm focus:outline-none focus:border-green-primary bg-white font-black text-green-primary text-center"
                    />
                  </div>
                </div>

                {/* 1st & 2nd Term Carryover Inputs */}
                <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <span>Termly Cumulative Carryover Scores</span>
                    <span className="text-emerald-700 font-extrabold">Annual Synthesis</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1 text-[11px]">1st Term Total (100)</label>
                      <input
                        type="number"
                        max="100"
                        min="0"
                        value={scores.term1 !== undefined ? scores.term1 : '62'}
                        placeholder="e.g. 62"
                        onChange={(e) => setScores({ ...scores, term1: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-white font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1 text-[11px]">2nd Term Total (100)</label>
                      <input
                        type="number"
                        max="100"
                        min="0"
                        value={scores.term2 !== undefined ? scores.term2 : '66'}
                        placeholder="e.g. 66"
                        onChange={(e) => setScores({ ...scores, term2: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-white font-bold text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Live 3-Term Collation Preview Box */}
                {(() => {
                  const t3 = (parseInt(scores.ca1) || 0) + (parseInt(scores.ca2) || 0) + (parseInt(scores.exam) || 0);
                  const t1 = scores.term1 !== undefined && !isNaN(parseInt(scores.term1)) ? parseInt(scores.term1) : Math.max(40, t3 - 2);
                  const t2 = scores.term2 !== undefined && !isNaN(parseInt(scores.term2)) ? parseInt(scores.term2) : Math.max(42, t3 + 1);
                  const agg = t3 + t1 + t2;
                  const avg = (agg / 3).toFixed(2);
                  const gr = calculateGrade(avg);
                  const verdict = avg >= 50 ? 'Promoted' : avg >= 45 ? 'Promoted on Trial' : 'To Repeat';
                  
                  // Color-coded WAEC grade badge styling
                  const gradeBadgeClass = gr === 'A1' 
                    ? 'bg-emerald-400 text-emerald-950 font-black ring-2 ring-emerald-300/50'
                    : gr === 'B2' || gr === 'B3'
                    ? 'bg-emerald-500 text-white font-black'
                    : gr.startsWith('C')
                    ? 'bg-sky-500 text-white font-black'
                    : gr.startsWith('D') || gr.startsWith('E')
                    ? 'bg-amber-500 text-amber-950 font-black'
                    : 'bg-rose-500 text-white font-black';

                  const verdictClass = avg >= 50 
                    ? 'text-emerald-300 font-black' 
                    : avg >= 45 
                    ? 'text-amber-300 font-black' 
                    : 'text-rose-300 font-black';

                  return (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#06452C] to-[#0A5637] text-white space-y-3 text-xs shadow-md border border-emerald-700/60">
                      <div className="flex justify-between items-center border-b border-emerald-800/80 pb-2.5">
                        <span className="font-black text-emerald-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                          <span>3rd Term Promotional Collation</span>
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] shadow-xs ${gradeBadgeClass}`}>
                          WAEC {gr}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-700/40 backdrop-blur-xs">
                          <span className="text-emerald-300/90 block text-[9px] font-bold uppercase tracking-wider">3rd Term Score</span>
                          <span className="font-black text-base mt-0.5 block">{t3}/100</span>
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-700/40 backdrop-blur-xs">
                          <span className="text-emerald-300/90 block text-[9px] font-bold uppercase tracking-wider">Cumulative</span>
                          <span className="font-black text-base mt-0.5 block">{agg}/300</span>
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-700/40 backdrop-blur-xs">
                          <span className="text-emerald-300/90 block text-[9px] font-bold uppercase tracking-wider">Annual Average</span>
                          <span className="font-black text-base text-[#FDE68A] mt-0.5 block">{avg}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-emerald-200/90 pt-1 border-t border-emerald-800/40">
                        <span>Collation Status: <strong className={verdictClass}>{verdict}</strong></span>
                        <span className="text-[9px] text-emerald-300/70 font-mono">3-Term Formula Active</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSavingScore || !selectedStudent}
                    className={`w-full py-4 px-4 rounded-2xl font-black text-xs sm:text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                      !selectedStudent || isSavingScore
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-75 shadow-none'
                        : 'bg-green-primary hover:bg-green-dark cursor-pointer active:scale-[0.99] hover:shadow-lg'
                    }`}
                  >
                    {isSavingScore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white flex-shrink-0" />
                        <span>Collating & Saving 3rd Term Scores...</span>
                      </>
                    ) : !selectedStudent ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>Select a Student to Save Score</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-emerald-200 flex-shrink-0" />
                        <span>Save & Collate 3rd Term Score</span>
                        <ArrowRight className="w-4 h-4 text-white flex-shrink-0" />
                      </>
                    )}
                  </button>

                  {selectedStudent && studentObj && (
                    <p className="text-[11px] text-center text-gray-500 font-medium truncate px-1">
                      Recording score for <strong className="text-[#1B2521]">{studentObj.name}</strong> ({studentObj.class}) · <span className="text-green-primary font-bold">{selectedSubject}</span>
                    </p>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-lg text-[#1B2521]">Teacher ID Subject Allocation</h3>
                <p className="text-xs text-gray-500">Subjects registered to your teacher account</p>
              </div>

              <div className="space-y-2.5 text-xs">
                {teacherSubjectsTaught.map((st, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-[#FAFCFA] border border-gray-200">
                    <div>
                      <span className="font-bold text-[#1B2521] block">{st.subjectName}</span>
                      <span className="text-[10px] text-gray-400">{st.className}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#06452C] font-mono text-[10px] font-black border border-emerald-200">
                      Authorised
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1.5 text-[11px] text-gray-500">
                <div className="font-bold text-gray-700">Security & Integrity Rule:</div>
                <p>
                  To prevent unauthorized score tampering, teachers can only input grades for the exact subjects linked to their ID. Other subject scores are managed by their respective teachers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ASSIGNMENTS & STUDY MATERIALS ================= */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Post Homework */}
          <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-[#1B2521]">Create & Post Digital Assignment</h3>
              <p className="text-xs text-gray-500">Publish homework questions, attach worksheets or resource links to students' dashboards</p>
            </div>

            {asnMsg && (
              <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-green-800 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0" />
                <span>{asnMsg}</span>
              </div>
            )}

            <form onSubmit={handleAssignmentSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Subject Selector */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject *</label>
                  <select
                    value={newAsn.subject}
                    onChange={(e) => setNewAsn({ ...newAsn, subject: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-[#06452C]"
                  >
                    {teacherDistinctSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Class Selector */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Class *</label>
                  <select
                    value={newAsn.targetClass}
                    onChange={(e) => setNewAsn({ ...newAsn, targetClass: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-[#06452C]"
                  >
                    <option value="All Assigned Classes">All My Assigned Classes</option>
                    {distinctClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assignment Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quadratic Equations & Graph Exercises 3B"
                    value={newAsn.title}
                    onChange={(e) => setNewAsn({ ...newAsn, title: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Submission Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newAsn.dueDate}
                    onChange={(e) => setNewAsn({ ...newAsn, dueDate: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Instructions / Questions *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="State detailed instructions, exercise numbers, and rubric..."
                  value={newAsn.desc}
                  onChange={(e) => setNewAsn({ ...newAsn, desc: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                ></textarea>
              </div>

              {/* Optional Attachment Type Picker */}
              <div className="p-3.5 rounded-2xl bg-[#FAFCFA] border border-gray-200/80 space-y-2.5">
                <label className="block font-bold text-gray-700 text-xs">Attachment / Resource (Optional)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAsn({ ...newAsn, attachmentType: 'none', fileName: '', fileData: null, linkUrl: '' })}
                    className={`py-2 px-2 rounded-xl font-bold text-[11px] border transition-all ${
                      newAsn.attachmentType === 'none'
                        ? 'bg-emerald-100 text-[#06452C] border-emerald-300 shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    No Attachment
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAsn({ ...newAsn, attachmentType: 'file', linkUrl: '' })}
                    className={`py-2 px-2 rounded-xl font-bold text-[11px] border flex items-center justify-center gap-1 transition-all ${
                      newAsn.attachmentType === 'file'
                        ? 'bg-emerald-100 text-[#06452C] border-emerald-300 shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Upload PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAsn({ ...newAsn, attachmentType: 'link', fileName: '', fileData: null })}
                    className={`py-2 px-2 rounded-xl font-bold text-[11px] border flex items-center justify-center gap-1 transition-all ${
                      newAsn.attachmentType === 'link'
                        ? 'bg-emerald-100 text-[#06452C] border-emerald-300 shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Web Link</span>
                  </button>
                </div>

                {newAsn.attachmentType === 'file' && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Choose PDF / Document File:</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setNewAsn({
                            ...newAsn,
                            fileName: f.name,
                            fileSize: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
                            fileData: URL.createObjectURL(f),
                          });
                        }
                      }}
                      className="w-full text-xs text-gray-600 file:mr-2.5 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-[#06452C] hover:file:bg-emerald-100 cursor-pointer"
                    />
                    {newAsn.fileName && (
                      <div className="mt-1 text-[11px] text-[#06452C] font-semibold">
                        ✓ Selected: {newAsn.fileName} ({newAsn.fileSize})
                      </div>
                    )}
                  </div>
                )}

                {newAsn.attachmentType === 'link' && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Resource URL / Google Drive / Video Link:</label>
                    <input
                      type="url"
                      placeholder="https://example.com/worksheet.pdf"
                      value={newAsn.linkUrl}
                      onChange={(e) => setNewAsn({ ...newAsn, linkUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-green-primary"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmittingAsn}
                className="w-full py-3.5 rounded-2xl font-black text-xs text-white bg-green-primary hover:bg-green-dark transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer active:scale-[0.99]"
              >
                {isSubmittingAsn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Publishing Assignment to {newAsn.targetClass}...</span>
                  </>
                ) : (
                  <>
                    <span>+ Post Assignment to {newAsn.targetClass} →</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Upload Materials */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-[#1B2521]">Upload Study Material & Notes</h3>
              <p className="text-xs text-gray-500">Upload PDF lesson notes and materials to student central library</p>
            </div>

            {matMsg && (
              <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-green-800 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0" />
                <span>{matMsg}</span>
              </div>
            )}

            <form onSubmit={handleMaterialSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waves & Optics Lecture Notes (Term 3)"
                  value={newMat.title}
                  onChange={(e) => setNewMat({ ...newMat, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject *</label>
                  <select
                    value={newMat.subject}
                    onChange={(e) => setNewMat({ ...newMat, subject: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-[#06452C]"
                  >
                    {teacherDistinctSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Class *</label>
                  <select
                    value={newMat.targetClass}
                    onChange={(e) => setNewMat({ ...newMat, targetClass: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-[#06452C]"
                  >
                    <option value="All Classes">All Classes</option>
                    {distinctClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Format</label>
                  <select
                    value={newMat.format}
                    onChange={(e) => setNewMat({ ...newMat, format: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">Word Document</option>
                    <option value="ZIP">ZIP Archive</option>
                    <option value="Web Link">Web Resource / Link</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Select File:</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.zip,.ppt,.pptx"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setNewMat({ ...newMat, fileName: f.name });
                      }
                    }}
                    className="w-full text-xs text-gray-600 file:mr-2 file:py-2 file:px-2.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-[#06452C] hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingMat}
                className="w-full py-3.5 rounded-2xl font-black text-xs text-white bg-[#06452C] hover:bg-[#0B5D3B] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer active:scale-[0.99]"
              >
                {isSubmittingMat ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Uploading Material to Library...</span>
                  </>
                ) : (
                  <>
                    <span>📤 Upload to Central Library →</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CLASS TEACHER MASTER DOSSIER & BROADSHEET ================= */}
      {activeTab === 'formclass' && isClassTeacher && (
        <div className="space-y-6">
          {/* Class Overview Header */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#06452C] text-white text-[10px] font-black uppercase">
                  Class Teacher Portal
                </span>
                <h3 className="font-extrabold text-lg text-[#1B2521]">{currentUser.classAssigned} Broadsheet & Assessment</h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Class population: {formClassStudents.length} students · Manage attendance, affective conduct ratings & report card sign-offs
              </p>
            </div>
          </div>

          {/* Class Teacher Broadsheet Summary */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-[#06452C] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Class Broadsheet Summary Ledger</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 text-[11px]">
                    <th className="p-3">Admission ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class & Arm</th>
                    <th className="p-3">House</th>
                    <th className="p-3">Subjects Recorded</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formClassStudents.map((s) => {
                    const studentResCount = (data?.results && data.results[s.id]?.length) || 0;
                    return (
                      <tr key={s.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-mono font-bold text-green-primary">{s.id}</td>
                        <td className="p-3 font-extrabold text-[#1B2521]">{s.name}</td>
                        <td className="p-3 font-semibold text-gray-700">{s.class}</td>
                        <td className="p-3 text-gray-600">{s.house}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#06452C] font-bold border border-emerald-200">
                            {studentResCount} Subjects
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {['Present', 'Absent', 'Late'].map((st) => (
                              <button
                                key={st}
                                onClick={() => setAttendance({ ...attendance, [s.id]: st })}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  attendance[s.id] === st
                                    ? st === 'Present'
                                      ? 'bg-green-primary text-white'
                                      : st === 'Absent'
                                      ? 'bg-red-600 text-white'
                                      : 'bg-amber-500 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedFormStudent(s.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              selectedFormStudent === s.id
                                ? 'bg-[#06452C] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Evaluate Conduct
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Class Teacher Remark & Affective Traits Rating Box */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h4 className="font-extrabold text-sm text-[#06452C] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Class Teacher Terminal Report Sign-Off & Behavioral Ratings</span>
              </h4>
              <p className="text-xs text-gray-500">
                Evaluating: <strong className="text-[#1B2521]">{formClassStudents.find(s => s.id === selectedFormStudent)?.name || selectedFormStudent}</strong>
              </p>
            </div>

            {formSavedMsg && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-primary" />
                <span>{formSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveFormTeacherRemark} className="space-y-4 text-xs">
              {/* Affective Matrix */}
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Affective Behavioral Traits Rating (1 = Poor, 5 = Excellent)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.keys(affectiveScores).map((trait) => (
                    <div key={trait} className="p-3 rounded-xl bg-[#FAFCFA] border border-gray-200 space-y-1">
                      <span className="font-bold text-gray-700 capitalize text-[11px] block">{trait}</span>
                      <select
                        value={affectiveScores[trait]}
                        onChange={(e) => setAffectiveScores({ ...affectiveScores, [trait]: Number(e.target.value) })}
                        className="w-full p-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-white text-green-primary"
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Very Good</option>
                        <option value={3}>3 - Good</option>
                        <option value={2}>2 - Fair</option>
                        <option value={1}>1 - Poor</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class Teacher Remark */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Official Class Teacher's Terminal Remark (Appears on Student Report Sheet)
                </label>
                <textarea
                  rows="3"
                  required
                  value={formTeacherRemark}
                  onChange={(e) => setFormTeacherRemark(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] italic"
                ></textarea>

                {/* Quick Remarks */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  <span className="text-[10px] text-gray-400 font-bold self-center">Presets:</span>
                  {quickRemarks.map((qr, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormTeacherRemark(qr)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-medium transition-colors"
                    >
                      "{qr}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!selectedFormStudent || formClassStudents.length === 0}
                  className={`sm:w-2/3 py-3.5 rounded-2xl font-black text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                    !selectedFormStudent || formClassStudents.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-75 shadow-none'
                      : 'bg-[#06452C] hover:bg-[#0B5D3B] cursor-pointer active:scale-[0.99]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Save Class Teacher's Remark & Behavioral Ratings →</span>
                </button>
                <button
                  type="button"
                  disabled={!selectedFormStudent || formClassStudents.length === 0}
                  onClick={() => {
                    const currentFormStudentObj = formClassStudents.find(s => s.id === selectedFormStudent) || formClassStudents[0];
                    if (currentFormStudentObj) {
                      setReportStudent(currentFormStudentObj);
                      setShowReportModal(true);
                    }
                  }}
                  className={`sm:w-1/3 py-3.5 rounded-2xl font-black text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${
                    !selectedFormStudent || formClassStudents.length === 0
                      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 cursor-pointer active:scale-[0.99]'
                  }`}
                >
                  <Printer className="w-4 h-4" />
                  <span>View / Print Report Sheet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 4: TEACHING SCHEDULE / TIMETABLE ================= */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-green-primary text-xs font-bold uppercase tracking-wider mb-1">
                <CalendarDays className="w-4 h-4" />
                <span>My Weekly Teaching Schedule</span>
              </div>
              <h3 className="font-extrabold text-lg text-[#1B2521]">{currentUser?.name || 'Faculty Member'} — Teaching Schedule</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Weekly assigned class periods and laboratory venues across the school.
              </p>
            </div>
          </div>

          {/* Day Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedTeacherTimetableDay(day)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTeacherTimetableDay === day
                    ? 'bg-[#06452C] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day === 'All' ? '📅 Full Week' : day}
              </button>
            ))}
          </div>

          {/* Schedule Cards by Day */}
          {teacherTimetable.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <CalendarDays className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-gray-600">No teaching periods scheduled yet for your subjects.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {(selectedTeacherTimetableDay === 'All' ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] : [selectedTeacherTimetableDay]).map((day) => {
                const daySlots = teacherTimetable.filter(s => s.day === day);
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

                          <div className="text-xs text-emerald-800 font-extrabold flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Class: {slot.className}</span>
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

      {/* Official Terminal Report Sheet Modal */}
      {showReportModal && (
        <OfficialReportCardModal
          student={reportStudent || formClassStudents.find(s => s.id === selectedFormStudent) || { name: 'Student', class: currentUser?.classAssigned || 'SSS 1B' }}
          results={
            (data?.results && (data.results[reportStudent?.id] || data.results[selectedFormStudent])) ||
            (data?.results && data.results['NSHS/2024/001']) ||
            []
          }
          sessionInfo={data?.sessionInfo}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Action Success / Feedback Popup Modal */}
      <SuccessModal
        isOpen={modalFeedback.isOpen}
        onClose={() => setModalFeedback(prev => ({ ...prev, isOpen: false }))}
        title={modalFeedback.title}
        message={modalFeedback.message}
        type={modalFeedback.type}
      />
    </div>
  );
}
