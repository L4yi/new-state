import React, { useState, useEffect } from 'react';
import {
  Calculator, FilePlus, Upload, Users, CheckCircle2,
  Calendar, BookOpen, Sparkles, UserCheck, UserX, Clock, ArrowRight,
  Award, ShieldCheck, FileText, Check, ListChecks, MessageSquare
} from 'lucide-react';

export default function TeacherDashboard({ data, currentUser, onSaveScore, onAddAssignment, onUploadMaterial }) {
  const [activeTab, setActiveTab] = useState('scores'); // 'scores', 'assignments', 'formclass'

  const isClassTeacher = Boolean(currentUser?.classAssigned);
  const assignedClass = currentUser?.classAssigned || 'SSS 3 - Arm A';

  // 1. Filter students this teacher has access to see/grade
  const allowedStudents = data?.students?.filter(student => {
    if (!currentUser) return true; // Offline/fallback
    const isTeacherOfClass = currentUser.classAssigned === student.class;
    const teachesInClass = currentUser.subjectsTaught?.some(s => s.className === student.class);
    return isTeacherOfClass || teachesInClass;
  }) || [];

  // Form Class specific students
  const formClassStudents = data?.students?.filter(s => s.class === currentUser?.classAssigned) || allowedStudents;

  const [selectedStudent, setSelectedStudent] = useState(allowedStudents[0]?.id || '');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [scores, setScores] = useState({ ca1: '', ca2: '', exam: '' });
  const [attendance, setAttendance] = useState({});
  const [savedMsg, setSavedMsg] = useState('');

  // Form Master remarks & ratings state
  const [selectedFormStudent, setSelectedFormStudent] = useState(formClassStudents[0]?.id || '');
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

  // 2. Determine subjects available for the selected student
  const studentObj = data?.students?.find(s => s.id === selectedStudent);
  const isClassTeacherForSelected = currentUser && studentObj && currentUser.classAssigned === studentObj.class;

  const availableSubjects = (() => {
    if (!currentUser || !studentObj) {
      return ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Computer Studies (AI & Coding)'];
    }
    if (isClassTeacherForSelected) {
      return ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Computer Studies (AI & Coding)'];
    }
    return currentUser.subjectsTaught
      ?.filter(s => s.className === studentObj.class)
      ?.map(s => s.subjectName) || ['Mathematics'];
  })();

  // Reset selected subject if it's no longer available for the chosen student
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(selectedSubject)) {
      setSelectedSubject(availableSubjects[0]);
    }
  }, [selectedStudent, availableSubjects]);

  const teacherSubjects = currentUser?.subjectsTaught
    ?.map((s) => s.subjectName)
    ?.filter((value, index, self) => self.indexOf(value) === index) || ['Mathematics'];

  // New Assignment Form State
  const [newAsn, setNewAsn] = useState({
    subject: teacherSubjects[0] || 'Mathematics',
    title: '',
    dueDate: '',
    desc: '',
  });
  const [asnMsg, setAsnMsg] = useState('');

  // New Study Material Form State
  const [newMat, setNewMat] = useState({
    title: '',
    subject: teacherSubjects[0] || 'Physics',
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

    setSavedMsg(`Score saved for ${data?.students?.find((s) => s.id === selectedStudent)?.name}! Total: ${total}/100 (${grade})`);
    setTimeout(() => setSavedMsg(''), 4000);
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
    setNewAsn({ subject: teacherSubjects[0] || 'Mathematics', title: '', dueDate: '', desc: '' });
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
    setNewMat({ title: '', subject: teacherSubjects[0] || 'Physics', format: 'PDF' });
    setMatMsg('Learning material uploaded to central repository!');
    setTimeout(() => setMatMsg(''), 4000);
  };

  const handleSaveFormTeacherRemark = (e) => {
    e.preventDefault();
    const student = formClassStudents.find(s => s.id === selectedFormStudent);
    setFormSavedMsg(`Form Master evaluation and terminal remark saved for ${student?.name || selectedFormStudent}!`);
    setTimeout(() => setFormSavedMsg(''), 4000);
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
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black text-[#1B2521]">{currentUser?.name || 'Mr. Babatunde Ogunlesi'}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-green-primary text-[11px] font-bold border border-green-primary/20">
              {currentUser?.department || 'Faculty Staff'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {isClassTeacher ? (
              <span className="px-3 py-1 rounded-lg bg-green-primary text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                <Users className="w-3.5 h-3.5" />
                <span>Class Teacher: {currentUser.classAssigned}</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                <span>Subject Teacher Only</span>
              </span>
            )}

            {currentUser?.subjectsTaught?.length > 0 && (
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-green-primary text-xs font-bold border border-emerald-200/60 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Subjects: {currentUser.subjectsTaught.map(s => `${s.subjectName} (${s.className})`).join(' · ')}</span>
              </span>
            )}
          </div>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'scores'
                ? 'bg-green-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Score Entry</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'assignments'
                ? 'bg-green-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Assignments & Notes</span>
          </button>

          {isClassTeacher && (
            <button
              onClick={() => setActiveTab('formclass')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'formclass'
                  ? 'bg-green-primary text-white shadow-sm'
                  : 'bg-emerald-50 text-green-primary hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>My Form Class ({currentUser.classAssigned})</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= TAB 1: SUBJECT SCORE ENTRY ================= */}
      {activeTab === 'scores' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-[#1B2521]">Continuous Assessment & Exam Score Entry</h3>
              <p className="text-xs text-gray-500">
                Enter CA1 (20), CA2 (20), and Terminal Exam (60) for your assigned subjects
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
                <label className="block font-bold text-gray-700 mb-1">Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-medium"
                >
                  {allowedStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.class} · {s.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-[#06452C]"
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
                className="w-full py-3.5 rounded-xl font-black text-xs text-white bg-green-primary hover:bg-green-dark transition-all shadow-md"
              >
                Save Subject Score to Student Record →
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-[#1B2521]">WAEC / NECO Grading Standards</h3>
              <p className="text-xs text-gray-500">Official Nigerian secondary school grade scales</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-green-50 border border-green-200">
                <span className="font-bold text-green-900">75% - 100%</span>
                <span className="font-black text-green-800">A1 (Distinction)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 border border-blue-200">
                <span className="font-bold text-blue-900">70% - 74%</span>
                <span className="font-black text-blue-800">B2 (Very Good)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 border border-blue-200">
                <span className="font-bold text-blue-900">65% - 69%</span>
                <span className="font-black text-blue-800">B3 (Good)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-900">50% - 64%</span>
                <span className="font-black text-amber-800">C4 - C6 (Credit)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-50 border border-red-200">
                <span className="font-bold text-red-900">0% - 49%</span>
                <span className="font-black text-red-800">D7 - F9 (Pass / Fail)</span>
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
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  >
                    {teacherSubjects.map((sub) => (
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
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  >
                    {teacherSubjects.map((sub) => (
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
