import React, { useState } from 'react';
import {
  BarChart3, Calendar, FileText, BookOpen, CreditCard, Megaphone,
  Printer, Download, Upload, CheckCircle2, Clock, AlertCircle, Building2, User
} from 'lucide-react';

export default function StudentDashboard({ data, onUploadReceipt, currentStudentId }) {
  const [activeTab, setActiveTab] = useState('results');
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

  return (
    <div className="space-y-6">
      {/* Student Profile Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-primary text-white text-lg sm:text-xl font-bold flex items-center justify-center flex-shrink-0">
            {student.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#1B2521] truncate">{student.name}</h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-normal mt-0.5">
              ID: <span className="text-green-primary font-bold">{student.id}</span> <span className="hidden sm:inline">·</span> <br className="sm:hidden" /> Class: {student.class} · House: {student.house}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <span className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold ${
            student.feeStatus === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            Fee Status: {student.feeStatus}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] sm:text-xs font-bold">
            Guardian: {student.guardian}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-2 whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {[
          { id: 'results', label: 'Term Results & Grades', icon: BarChart3 },
          { id: 'timetable', label: 'Class Timetable', icon: Calendar },
          { id: 'assignments', label: 'Digital Assignments', icon: FileText },
          { id: 'materials', label: 'Learning Materials', icon: BookOpen },
          { id: 'fees', label: 'Pay Fees & Receipt', icon: CreditCard },
          { id: 'announcements', label: 'School Notices', icon: Megaphone },
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-green-primary text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-[#55635C] hover:bg-gray-50'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Results Tab */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-lg text-[#1B2521]">Academic Report Card — {data.sessionInfo.currentTerm}</h3>
              <p className="text-xs text-gray-500">{data.sessionInfo.currentSession}</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg text-xs font-bold text-green-primary bg-green-light border border-green-primary/20 hover:bg-emerald-100 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report Card</span>
            </button>
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
                {studentResults.map((r, idx) => (
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
  );
}
