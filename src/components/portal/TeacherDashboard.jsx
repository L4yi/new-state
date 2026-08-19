import React, { useState } from 'react';

export default function TeacherDashboard({ data, onSaveScore, onAddAssignment, onUploadMaterial }) {
  const [selectedStudent, setSelectedStudent] = useState(data.students[0].id);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [scores, setScores] = useState({ ca1: '', ca2: '', exam: '' });
  const [attendance, setAttendance] = useState({
    'NSHS/2024/001': 'Present',
    'NSHS/2024/002': 'Present',
    'NSHS/2024/003': 'Absent',
  });
  const [savedMsg, setSavedMsg] = useState('');

  // New Assignment Form State
  const [newAsn, setNewAsn] = useState({
    subject: 'Mathematics',
    title: '',
    dueDate: '',
    desc: '',
  });
  const [asnMsg, setAsnMsg] = useState('');

  // New Study Material Form State
  const [newMat, setNewMat] = useState({
    title: '',
    subject: 'Physics',
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

    setSavedMsg(`Score saved for ${data.students.find((s) => s.id === selectedStudent)?.name}! Total: ${total}/100 (${grade})`);
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
    setNewAsn({ subject: 'Mathematics', title: '', dueDate: '', desc: '' });
    setAsnMsg('Assignment created & published to students!');
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
    setNewMat({ title: '', subject: 'Physics', format: 'PDF' });
    setMatMsg('Learning material uploaded to central repository!');
  };

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1B2521]">Mr. Babatunde Ogunlesi</h2>
          <p className="text-xs text-gray-500">Subject Specialist: Mathematics & Physics · SSS 3 Form Teacher</p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-green-light text-green-primary text-xs font-bold border border-green-primary/20">
          Faculty Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Grade Calculator & Assignment Creator */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Score Entry & Automatic Grade Calculator */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-[#1B2521]">Automatic Score Entry & Result Calculator</h3>
              <p className="text-xs text-gray-500">Enter CA1 (20) + CA2 (20) + Exam (60) — total & letter grade calculated automatically</p>
            </div>

            {savedMsg && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-800">
                ✓ {savedMsg}
              </div>
            )}

            <form onSubmit={handleScoreSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                >
                  {data.students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.class} - {s.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="English Language">English Language</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Studies (AI Coding)">Computer Studies (AI Coding)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">CA 1 (Max 20)</label>
                  <input
                    type="number"
                    max="20"
                    required
                    value={scores.ca1}
                    onChange={(e) => setScores({ ...scores, ca1: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">CA 2 (Max 20)</label>
                  <input
                    type="number"
                    max="20"
                    required
                    value={scores.ca2}
                    onChange={(e) => setScores({ ...scores, ca2: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Exam (Max 60)</label>
                  <input
                    type="number"
                    max="60"
                    required
                    value={scores.exam}
                    onChange={(e) => setScores({ ...scores, exam: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-extrabold text-xs text-white bg-green-primary hover:bg-green-dark transition-all"
              >
                Calculate & Publish Grade →
              </button>
            </form>
          </div>

          {/* 2. Create & Post Digital Assignment */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-[#1B2521]">Create & Post Digital Assignment</h3>
              <p className="text-xs text-gray-500">Assign homework, set deadlines, and push directly to student portals</p>
            </div>

            {asnMsg && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-800">
                ✓ {asnMsg}
              </div>
            )}

            <form onSubmit={handleAssignmentSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject</label>
                  <select
                    value={newAsn.subject}
                    onChange={(e) => setNewAsn({ ...newAsn, subject: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Computer Studies (AI Coding)">Computer Studies (AI Coding)</option>
                    <option value="English Language">English Language</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Submission Deadline</label>
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
                  placeholder="e.g. Quadratic Formula & Graphs Exercise 3B"
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
                  placeholder="Instructions for students..."
                  value={newAsn.desc}
                  onChange={(e) => setNewAsn({ ...newAsn, desc: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-extrabold text-xs text-white bg-[#06452C] hover:bg-[#0B5D3B]"
              >
                + Post Assignment to Class →
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Attendance & Upload Study Materials */}
        <div className="lg:col-span-5 space-y-6">
          {/* 3. Digital Attendance Register */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-[#1B2521]">Digital Attendance Register</h3>
              <p className="text-xs text-gray-500">Mark daily attendance for class JSS 1 - SSS 3</p>
            </div>

            <div className="space-y-3">
              {data.students.map((s) => (
                <div key={s.id} className="p-3 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-[#1B2521]">{s.name}</div>
                    <div className="text-[10px] text-gray-400">{s.class}</div>
                  </div>

                  <div className="flex gap-1">
                    {['Present', 'Absent', 'Late'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setAttendance({ ...attendance, [s.id]: st })}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold ${
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
                </div>
              ))}
            </div>

            <button
              onClick={() => alert('Daily class attendance register saved successfully!')}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-gray-100 hover:bg-gray-200 text-[#1B2521]"
            >
              Save Attendance Register
            </button>
          </div>

          {/* 4. Upload Learning Materials */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-[#1B2521]">Upload Study Material & PDF Notes</h3>
              <p className="text-xs text-gray-500">Add course materials to central student library</p>
            </div>

            {matMsg && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-800">
                ✓ {matMsg}
              </div>
            )}

            <form onSubmit={handleMaterialSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Material Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Chapter 4 Motion PDF Notes"
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
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="AI & Coding">AI & Coding</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">File Format</label>
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
                className="w-full py-3.5 rounded-xl font-extrabold text-xs text-white bg-green-primary hover:bg-green-dark"
              >
                📤 Upload to Library →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
