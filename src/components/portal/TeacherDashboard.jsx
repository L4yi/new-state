import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator, FilePlus, Upload, Users, CheckCircle2,
  Calendar, BookOpen, Sparkles, UserCheck, UserX, Clock, ArrowRight,
  Award, ShieldCheck, FileText, Check, ListChecks, MessageSquare,
  Layers, Filter
} from 'lucide-react';

export default function TeacherDashboard({ data, currentUser, onSaveScore, onAddAssignment, onUploadMaterial }) {
  const [activeTab, setActiveTab] = useState('scores'); // 'scores', 'assignments', 'formclass'

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
    const allStudents = data?.students || [];
    if (!currentUser) return allStudents;

    return allStudents.filter(student => {
      // Check if teacher teaches any subject in this student's class, or is their form master
      const isFormMaster = currentUser.classAssigned && (
        student.class === currentUser.classAssigned ||
        student.class?.includes(currentUser.classAssigned) ||
        currentUser.classAssigned?.includes(student.class)
      );
      const teachesInClass = teacherSubjectsTaught.some(s =>
        student.class === s.className ||
        student.class?.includes(s.className) ||
        s.className?.includes(student.class)
      );
      return isFormMaster || teachesInClass;
    });
  }, [data?.students, currentUser, teacherSubjectsTaught]);

  // Students filtered by the active Class Toggle
  const classFilteredStudents = useMemo(() => {
    if (selectedClassFilter === 'All') return allowedStudents;
    return allowedStudents.filter(s =>
      s.class === selectedClassFilter ||
      s.class?.includes(selectedClassFilter) ||
      selectedClassFilter.includes(s.class)
    );
  }, [allowedStudents, selectedClassFilter]);

  // Form Class specific students
  const formClassStudents = useMemo(() => {
    if (!currentUser?.classAssigned) return [];
    return (data?.students || []).filter(s =>
      s.class === currentUser.classAssigned ||
      s.class?.includes(currentUser.classAssigned) ||
      currentUser.classAssigned.includes(s.class)
    );
  }, [data?.students, currentUser]);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [scores, setScores] = useState({ ca1: '', ca2: '', exam: '' });
  const [attendance, setAttendance] = useState({});
  const [savedMsg, setSavedMsg] = useState('');

  // Form Master remarks & ratings state
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

  // Sync selectedStudent when classFilteredStudents changes
  useEffect(() => {
    if (classFilteredStudents.length > 0) {
      if (!classFilteredStudents.some(s => s.id === selectedStudent)) {
        setSelectedStudent(classFilteredStudents[0].id);
      }
    } else {
      setSelectedStudent('');
    }
  }, [classFilteredStudents, selectedStudent]);

  // Sync selectedFormStudent
  useEffect(() => {
    if (formClassStudents.length > 0 && !selectedFormStudent) {
      setSelectedFormStudent(formClassStudents[0].id);
    }
  }, [formClassStudents, selectedFormStudent]);

  // 3. STRICT SUBJECT LOCK: Determine subjects STRICTLY connected to this teacher's ID
  const studentObj = (data?.students || []).find(s => s.id === selectedStudent);

  const availableSubjects = useMemo(() => {
    if (!currentUser) return ['Mathematics'];

    // If a student is selected, find the exact subjects this teacher teaches in THIS student's class
    if (studentObj) {
      const matchSubjects = teacherSubjectsTaught
        .filter(s =>
          studentObj.class === s.className ||
          studentObj.class?.includes(s.className) ||
          s.className?.includes(studentObj.class)
        )
        .map(s => s.subjectName);

      if (matchSubjects.length > 0) {
        return Array.from(new Set(matchSubjects));
      }
    }

    // If a class filter is active, return subjects taught in that class
    if (selectedClassFilter !== 'All') {
      const matchedByClass = teacherSubjectsTaught
        .filter(s =>
          selectedClassFilter === s.className ||
          selectedClassFilter.includes(s.className) ||
          s.className?.includes(selectedClassFilter)
        )
        .map(s => s.subjectName);

      if (matchedByClass.length > 0) {
        return Array.from(new Set(matchedByClass));
      }
    }

    // Otherwise return all distinct subjects assigned to this teacher across all their classes
    const allSubjects = teacherSubjectsTaught.map(s => s.subjectName).filter(Boolean);
    return allSubjects.length > 0 ? Array.from(new Set(allSubjects)) : ['Mathematics'];
  }, [currentUser, studentObj, selectedClassFilter, teacherSubjectsTaught]);

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

  const teacherDistinctSubjects = useMemo(() => {
    return Array.from(new Set(teacherSubjectsTaught.map(s => s.subjectName).filter(Boolean)));
  }, [teacherSubjectsTaught]);

  // New Assignment Form State
  const [newAsn, setNewAsn] = useState({
    subject: teacherDistinctSubjects[0] || 'Mathematics',
    targetClass: distinctClasses[0] || 'All',
    title: '',
    dueDate: '',
    desc: '',
  });
  const [asnMsg, setAsnMsg] = useState('');

  // New Study Material Form State
  const [newMat, setNewMat] = useState({
    title: '',
    subject: teacherDistinctSubjects[0] || 'Mathematics',
    format: 'PDF',
  });
  const [matMsg, setMatMsg] = useState('');

  const calculateGrade = (total) => {
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

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    const ca1Num = parseInt(scores.ca1) || 0;
    const ca2Num = parseInt(scores.ca2) || 0;
    const examNum = parseInt(scores.exam) || 0;
    const total = ca1Num + ca2Num + examNum;
    const grade = calculateGrade(total);

    onSaveScore(selectedStudent, {
      subject: selectedSubject,
      ca1: ca1Num,
      ca2: ca2Num,
      exam: examNum,
      total,
      grade,
      remark: total >= 70 ? 'Excellent' : total >= 50 ? 'Good' : 'Needs Improvement',
    });

    setSavedMsg(`Score saved for ${(data?.students || []).find((s) => s.id === selectedStudent)?.name}! ${selectedSubject}: Total ${total}/100 (${grade})`);
    setTimeout(() => setSavedMsg(''), 4500);
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    onAddAssignment({
      id: `ASN-${Math.floor(10 + Math.random() * 90)}`,
      subject: newAsn.subject,
      title: newAsn.title,
      dueDate: newAsn.dueDate,
      desc: newAsn.desc,
      status: 'Pending Submission',
    });
    setNewAsn({
      subject: teacherDistinctSubjects[0] || 'Mathematics',
      targetClass: distinctClasses[0] || 'All',
      title: '',
      dueDate: '',
      desc: ''
    });
    setAsnMsg('Assignment created & published to students!');
    setTimeout(() => setAsnMsg(''), 4000);
  };

  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    onUploadMaterial({
      title: newMat.title,
      subject: newMat.subject,
      format: newMat.format,
      size: '2.8 MB',
      dateAdded: new Date().toISOString().split('T')[0],
    });
    setNewMat({ title: '', subject: teacherDistinctSubjects[0] || 'Physics', format: 'PDF' });
    setMatMsg('Learning material uploaded to central repository!');
    setTimeout(() => setMatMsg(''), 4000);
  };

  const handleSaveFormTeacherRemark = (e) => {
    e.preventDefault();
    const student = formClassStudents.find(s => s.id === selectedFormStudent);
    setFormSavedMsg(`Form Master evaluation and terminal remark saved for ${student?.name || selectedFormStudent}!`);
    setTimeout(() => setFormSavedMsg(''), 4500);
  };

  const quickRemarks = [
    'Outstanding academic performance; keep up the diligence.',
    'Very good student with high leadership potential.',
    'Satisfactory performance; encouraged to be more focused in class.',
    'Brilliant result; recommended for academic prize award.'
  ];

  return (
    <div className="space-y-6">
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
                  <Users className="w-3.5 h-3.5" />
                  <span>Class Teacher (Form Master): {currentUser.classAssigned}</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                  <span>Subject Teacher Only</span>
                </span>
              )}

              {teacherSubjectsTaught.length > 0 && (
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-green-primary text-xs font-bold border border-emerald-200/60 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Assigned: {teacherSubjectsTaught.map(s => `${s.subjectName} (${s.className})`).join(' · ')}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200/80 text-xs font-bold text-gray-600 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Teacher Portal · Term 1</span>
          </div>
        </div>

        {/* Tab Switcher Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isClassTeacher ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-2.5`}>
          <button
            onClick={() => setActiveTab('scores')}
            className={`p-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border ${
              activeTab === 'scores'
                ? 'bg-green-primary text-white border-green-primary shadow-md'
                : 'bg-[#FAFCFA] text-gray-700 hover:bg-gray-100 hover:text-[#1B2521] border-gray-200/80'
            }`}
          >
            <Calculator className="w-4 h-4 flex-shrink-0" />
            <span>Continuous Assessment & Score Entry</span>
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
            <span>Assignments & Study Materials</span>
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
              <span>Form Master Tools ({currentUser.classAssigned})</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= TAB 1: SUBJECT SCORE ENTRY ================= */}
      {activeTab === 'scores' && (
        <div className="space-y-4">
          
          {/* ================= INTERACTIVE CLASS TOGGLE / WORKSPACE SWITCHER ================= */}
          {distinctClasses.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block">
                    Class Workspace Toggle
                  </span>
                  <p className="text-xs text-emerald-100">
                    Switch between your classes to filter students and lock score entry:
                  </p>
                </div>
              </div>

              {/* Class Toggle Buttons */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-emerald-900/90 rounded-xl border border-emerald-700/50 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedClassFilter('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                    selectedClassFilter === 'All'
                      ? 'bg-emerald-400 text-emerald-950 shadow-md'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                  }`}
                >
                  All Classes ({allowedStudents.length})
                </button>

                {distinctClasses.map((cls) => {
                  const countInClass = allowedStudents.filter(s =>
                    s.class === cls || s.class?.includes(cls) || cls.includes(s.class)
                  ).length;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedClassFilter(cls)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                        selectedClassFilter === cls
                          ? 'bg-emerald-400 text-emerald-950 shadow-md'
                          : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{cls}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedClassFilter === cls ? 'bg-emerald-900/40 text-emerald-950 font-black' : 'bg-emerald-800 text-emerald-300'
                      }`}>
                        {countInClass}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-lg text-[#1B2521]">Continuous Assessment & Exam Score Entry</h3>
                <p className="text-xs text-gray-500">
                  Subject dropdown is strictly locked to subjects linked to your Teacher ID.
                </p>
              </div>

              {savedMsg && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-primary" />
                  <span>{savedMsg}</span>
                </div>
              )}

              <form onSubmit={handleScoreSubmit} className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-gray-700">Select Student</label>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Showing {classFilteredStudents.length} students {selectedClassFilter !== 'All' ? `in ${selectedClassFilter}` : ''}
                    </span>
                  </div>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-medium"
                  >
                    {classFilteredStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.class} · {s.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* STRICT SUBJECT DROPDOWN (ONLY TEACHER'S ASSIGNED SUBJECTS) */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-gray-700">Select Subject (Locked to Your Assigned Subjects)</label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ ID Connected Only
                    </span>
                  </div>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-emerald-300 text-sm focus:outline-none focus:border-green-primary bg-emerald-50/40 font-bold text-[#06452C]"
                  >
                    {availableSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">CA 1 (Max 20)</label>
                    <input
                      type="number"
                      max="20"
                      min="0"
                      required
                      value={scores.ca1}
                      onChange={(e) => setScores({ ...scores, ca1: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">CA 2 (Max 20)</label>
                    <input
                      type="number"
                      max="20"
                      min="0"
                      required
                      value={scores.ca2}
                      onChange={(e) => setScores({ ...scores, ca2: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Exam (Max 60)</label>
                    <input
                      type="number"
                      max="60"
                      min="0"
                      required
                      value={scores.exam}
                      onChange={(e) => setScores({ ...scores, exam: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-green-primary"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">Calculated Total Score:</span>
                  <span className="font-black text-sm text-[#06452C]">
                    {(parseInt(scores.ca1) || 0) + (parseInt(scores.ca2) || 0) + (parseInt(scores.exam) || 0)} / 100
                    {' '}({calculateGrade((parseInt(scores.ca1) || 0) + (parseInt(scores.ca2) || 0) + (parseInt(scores.exam) || 0))})
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-black text-xs text-white bg-green-primary hover:bg-green-dark transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save {selectedSubject} Score for {studentObj?.name || 'Student'} →</span>
                </button>
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
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-[#1B2521]">Create & Post Digital Assignment</h3>
              <p className="text-xs text-gray-500">Publish homework questions to students' dashboards</p>
            </div>

            {asnMsg && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-800">
                ✓ {asnMsg}
              </div>
            )}

            <form onSubmit={handleAssignmentSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject</label>
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

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Due Date</label>
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
                <label className="block font-bold text-gray-700 mb-1">Assignment Title</label>
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
                <label className="block font-bold text-gray-700 mb-1">Instructions / Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="State instructions and question numbers..."
                  value={newAsn.desc}
                  onChange={(e) => setNewAsn({ ...newAsn, desc: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-black text-xs text-white bg-green-primary hover:bg-green-dark"
              >
                + Post Assignment to Class →
              </button>
            </form>
          </div>

          {/* Upload Materials */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-[#1B2521]">Upload Study Material & Notes</h3>
              <p className="text-xs text-gray-500">Upload PDF lesson notes to student central library</p>
            </div>

            {matMsg && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-800">
                ✓ {matMsg}
              </div>
            )}

            <form onSubmit={handleMaterialSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waves & Optics Lecture Notes"
                  value={newMat.title}
                  onChange={(e) => setNewMat({ ...newMat, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject</label>
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
                  <label className="block font-bold text-gray-700 mb-1">Format</label>
                  <select
                    value={newMat.format}
                    onChange={(e) => setNewMat({ ...newMat, format: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="ZIP">ZIP Archive</option>
                    <option value="DOCX">Word Document</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-black text-xs text-white bg-[#06452C] hover:bg-[#0B5D3B]"
              >
                📤 Upload to Library →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CLASS TEACHER / FORM MASTER MASTER DOSSIER ================= */}
      {activeTab === 'formclass' && isClassTeacher && (
        <div className="space-y-6">
          {/* Class Overview Header */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#06452C] text-white text-[10px] font-black uppercase">
                  Form Master Portal
                </span>
                <h3 className="font-extrabold text-lg text-[#1B2521]">{currentUser.classAssigned} Broadsheet & Assessment</h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Class population: {formClassStudents.length} students · Manage attendance, affective conduct ratings & report card sign-offs
              </p>
            </div>
          </div>

          {/* Form Master Broadsheet Summary */}
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

          {/* Form Teacher Remark & Affective Traits Rating Box */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h4 className="font-extrabold text-sm text-[#06452C] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Form Master's Terminal Report Sign-Off & Behavioral Ratings</span>
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

              {/* Form Teacher Remark */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Official Form Teacher's Terminal Remark (Appears on Student Report Sheet)
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

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-black text-xs text-white bg-[#06452C] hover:bg-[#0B5D3B] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Form Master's Remark & Behavioral Ratings →</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
