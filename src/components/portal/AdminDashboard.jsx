import React, { useState } from 'react';

export default function AdminDashboard({ data, onAddAnnouncement, onAddStudent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const [newStudent, setNewStudent] = useState({ name: '', class: 'JSS 1', house: 'Red House', guardian: '', guardianPhone: '' });
  const [msg, setMsg] = useState('');

  const filteredStudents = data.students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    setMsg('Announcement broadcasted to all students, parents, and teachers!');
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    const newId = `NSHS/2024/00${data.students.length + 1}`;
    onAddStudent({
      id: newId,
      name: newStudent.name,
      gender: 'Male',
      class: newStudent.class,
      house: newStudent.house,
      guardian: newStudent.guardian,
      guardianPhone: newStudent.guardianPhone,
      feeStatus: 'Unpaid',
      feeAmount: '₦125,000',
      paidAmount: '₦0',
    });
    setNewStudent({ name: '', class: 'JSS 1', house: 'Red House', guardian: '', guardianPhone: '' });
    setMsg(`Student ${newStudent.name} registered successfully with ID ${newId}!`);
  };

  return (
    <div className="space-y-6">
      {/* Searchable Central Database */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-[#1B2521]">Centralized School Database Search</h3>
            <p className="text-xs text-gray-500">Search student profiles, classes, guardians, and academic status instantly</p>
          </div>

          <input
            type="text"
            placeholder="🔍 Search name, ID, or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-primary w-full sm:w-64 bg-[#FAFCFA]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                <th className="p-3">Admission ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Class</th>
                <th className="p-3">House</th>
                <th className="p-3">Guardian Contact</th>
                <th className="p-3">Fee Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="p-3 font-bold text-green-primary">{s.id}</td>
                  <td className="p-3 font-bold text-[#1B2521]">{s.name}</td>
                  <td className="p-3">{s.class}</td>
                  <td className="p-3">{s.house}</td>
                  <td className="p-3 text-gray-600">{s.guardian} ({s.guardianPhone})</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      s.feeStatus === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.feeStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Announcement & Register Student Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Broadcast Announcement */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-[#1B2521]">Broadcast School Announcement</h3>

          {msg && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-800">
              ✓ {msg}
            </div>
          )}

          <form onSubmit={handleNoticeSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Notice Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Mid-Term Examination Timetable Released"
                value={newNotice.title}
                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Announcement Body</label>
              <textarea
                required
                rows="3"
                placeholder="Enter message text..."
                value={newNotice.content}
                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-extrabold text-xs text-white bg-green-primary hover:bg-green-dark"
            >
              📢 Post Announcement →
            </button>
          </form>
        </div>

        {/* Register New Student */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-[#1B2521]">Register New Student Profile</h3>

          <form onSubmit={handleStudentSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Student Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Oluwaseun Davies"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Class</label>
                <select
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                >
                  <option value="JSS 1">JSS 1</option>
                  <option value="JSS 2">JSS 2</option>
                  <option value="JSS 3">JSS 3</option>
                  <option value="SSS 1 (Science)">SSS 1 (Science)</option>
                  <option value="SSS 2 (Commercial)">SSS 2 (Commercial)</option>
                  <option value="SSS 3 (Science)">SSS 3 (Science)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">School House</label>
                <select
                  value={newStudent.house}
                  onChange={(e) => setNewStudent({ ...newStudent, house: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                >
                  <option value="Red House">Red House</option>
                  <option value="Blue House">Blue House</option>
                  <option value="Yellow House">Yellow House</option>
                  <option value="Green House">Green House</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Guardian Name & Phone</label>
              <input
                type="text"
                required
                placeholder="e.g. Mr. Davies (0802 000 1122)"
                value={newStudent.guardian}
                onChange={(e) => setNewStudent({ ...newStudent, guardian: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-extrabold text-xs text-white bg-[#06452C] hover:bg-[#0B5D3B]"
            >
              + Create Digital Record →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
