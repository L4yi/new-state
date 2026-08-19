import React, { useState, useEffect } from 'react';
import { initialPortalData } from '../data/mockPortalData';
import StudentDashboard from '../components/portal/StudentDashboard';
import TeacherDashboard from '../components/portal/TeacherDashboard';
import BursarDashboard from '../components/portal/BursarDashboard';
import AdminDashboard from '../components/portal/AdminDashboard';

export default function Portal({ onNavigate }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeRole, setActiveRole] = useState('student');
  const [loginCreds, setLoginCreds] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [portalData, setPortalData] = useState(() => {
    const saved = localStorage.getItem('nshs_portal_data');
    return saved ? JSON.parse(saved) : initialPortalData;
  });

  const [currentStudentId, setCurrentStudentId] = useState('NSHS/2024/001');

  useEffect(() => {
    localStorage.setItem('nshs_portal_data', JSON.stringify(portalData));
  }, [portalData]);

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginCreds.identifier.trim()) {
      setLoginError('Please enter your ID, Phone Number or Username.');
      return;
    }
    setLoginError('');
    setIsLoggedIn(true);
  };

  // Data Handlers
  const handleUploadReceipt = (newPayment) => {
    setPortalData((prev) => ({
      ...prev,
      feePayments: [newPayment, ...prev.feePayments],
      students: prev.students.map((s) =>
        s.id === newPayment.studentId ? { ...s, feeStatus: 'Pending' } : s
      ),
    }));
  };

  const handleApprovePayment = (paymentId) => {
    const targetPayment = portalData.feePayments.find((p) => p.id === paymentId);
    setPortalData((prev) => ({
      ...prev,
      feePayments: prev.feePayments.map((p) =>
        p.id === paymentId ? { ...p, status: 'Approved' } : p
      ),
      students: prev.students.map((s) =>
        s.id === targetPayment?.studentId ? { ...s, feeStatus: 'Approved' } : s
      ),
    }));
  };

  const handleRejectPayment = (paymentId) => {
    setPortalData((prev) => ({
      ...prev,
      feePayments: prev.feePayments.map((p) =>
        p.id === paymentId ? { ...p, status: 'Declined' } : p
      ),
    }));
  };

  const handleSaveScore = (studentId, newScore) => {
    setPortalData((prev) => {
      const existing = prev.results[studentId] || [];
      const updated = [newScore, ...existing.filter((r) => r.subject !== newScore.subject)];
      return {
        ...prev,
        results: { ...prev.results, [studentId]: updated },
      };
    });
  };

  const handleAddAssignment = (asn) => {
    setPortalData((prev) => ({
      ...prev,
      assignments: [asn, ...prev.assignments],
    }));
  };

  const handleUploadMaterial = (mat) => {
    setPortalData((prev) => ({
      ...prev,
      learningMaterials: [mat, ...prev.learningMaterials],
    }));
  };

  const handleAddAnnouncement = (anc) => {
    setPortalData((prev) => ({
      ...prev,
      announcements: [anc, ...prev.announcements],
    }));
  };

  const handleAddStudent = (std) => {
    setPortalData((prev) => ({
      ...prev,
      students: [std, ...prev.students],
    }));
  };

  const roleConfig = {
    student: {
      title: 'Student & Parent Portal Login',
      placeholder: 'e.g. NSHS/2024/001 or Phone Number',
      badge: 'Student / Parent',
    },
    teacher: {
      title: 'Faculty & Teacher Portal Login',
      placeholder: 'Teacher ID or Email address',
      badge: 'Teacher / Staff',
    },
    bursar: {
      title: 'Bursar & Finance Office Login',
      placeholder: 'Bursar Staff Username',
      badge: 'Bursar Office',
    },
    admin: {
      title: 'Administrator & Principal Login',
      placeholder: 'Admin Username',
      badge: 'System Admin',
    },
  };

  return (
    <div className="min-h-screen bg-[#06452C] flex flex-col justify-between relative overflow-hidden font-sans text-white">
      {/* Background Decorative Pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url('/nigerian-students.jpg')` }}
      />

      {/* Standalone Portal Navigation Header */}
      <header className="relative z-10 max-w-[1280px] w-full mx-auto px-6 py-6 flex justify-between items-center border-b border-emerald-800/60">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-11 h-11 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-md">
            <img src="/school-logo.png" alt="New State High School Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              New State High School
            </div>
            <div className="text-[10px] tracking-widest uppercase text-emerald-300/80 font-bold">
              School Management Portal
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-200 bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1.5"
        >
          ← Back to Main Website
        </button>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 max-w-[1280px] w-full mx-auto px-6 py-8 flex-grow flex items-center justify-center">
        {!isLoggedIn ? (
          /* STANDALONE LOGIN CARD WITH EMBEDDED ROLE SELECTOR */
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 text-[#1B2521] shadow-2xl border border-white/20 relative">
            <div className="text-center space-y-2 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-green-50 mx-auto flex items-center justify-center p-2.5 border border-green-primary/10">
                <img src="/school-logo.png" alt="School Crest Logo" className="w-full h-full object-contain" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-green-primary text-xs font-extrabold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-primary animate-pulse" />
                NEW STATE HIGH SCHOOL PORTAL
              </div>

              <h2 className="text-2xl font-black tracking-tight text-[#1B2521] mt-1">
                {roleConfig[activeRole].title}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {portalData.sessionInfo.currentSession} · {portalData.sessionInfo.currentTerm}
              </p>
            </div>

            {/* Embedded Role Selector Buttons Inside Form Box */}
            <div className="bg-[#F4F7F5] p-1.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1 mb-6 border border-gray-200/80">
              {[
                { id: 'student', label: '👨‍🎓 Student' },
                { id: 'teacher', label: '👨‍🏫 Teacher' },
                { id: 'bursar', label: '💳 Bursar' },
                { id: 'admin', label: '⚙️ Admin' },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setActiveRole(role.id);
                    setLoginError('');
                  }}
                  className={`py-2 rounded-xl text-[11px] font-bold transition-all text-center ${
                    activeRole === role.id
                      ? 'bg-green-primary text-white shadow-sm'
                      : 'text-[#55635C] hover:bg-white/60'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 text-center mb-4">
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Account ID / Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder={roleConfig[activeRole].placeholder}
                  value={loginCreds.identifier}
                  onChange={(e) => setLoginCreds({ ...loginCreds, identifier: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Password / PIN *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginCreds.password}
                  onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-extrabold text-sm text-white bg-green-primary hover:bg-green-dark transition-all shadow-md mt-2"
              >
                Sign In to Dashboard →
              </button>
            </form>

            <div className="pt-6 mt-6 border-t border-gray-100 text-center text-xs text-gray-400">
              Need technical help? Contact ICT support at <span className="text-green-primary font-bold">0813 400 0644</span>
            </div>
          </div>
        ) : (
          /* LOGGED IN DASHBOARD VIEW */
          <div className="w-full text-[#1B2521] space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-md gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-primary animate-pulse" />
                <div>
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Logged in User</span>
                  <div className="text-base font-extrabold text-[#1B2521]">
                    {loginCreds.identifier} · <span className="text-green-primary">{roleConfig[activeRole].badge}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-1.5"
              >
                🔒 Sign Out
              </button>
            </div>

            {activeRole === 'student' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-gray-200 text-xs shadow-sm">
                  <span className="font-bold text-gray-600">Switch Student Account:</span>
                  <select
                    value={currentStudentId}
                    onChange={(e) => setCurrentStudentId(e.target.value)}
                    className="font-bold text-green-primary bg-green-50 p-2 rounded-xl outline-none border border-green-200"
                  >
                    {portalData.students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.class})
                      </option>
                    ))}
                  </select>
                </div>

                <StudentDashboard
                  data={portalData}
                  onUploadReceipt={handleUploadReceipt}
                  currentStudentId={currentStudentId}
                />
              </div>
            )}

            {activeRole === 'teacher' && (
              <TeacherDashboard
                data={portalData}
                onSaveScore={handleSaveScore}
                onAddAssignment={handleAddAssignment}
                onUploadMaterial={handleUploadMaterial}
              />
            )}

            {activeRole === 'bursar' && (
              <BursarDashboard
                data={portalData}
                onApprovePayment={handleApprovePayment}
                onRejectPayment={handleRejectPayment}
              />
            )}

            {activeRole === 'admin' && (
              <AdminDashboard
                data={portalData}
                onAddAnnouncement={handleAddAnnouncement}
                onAddStudent={handleAddStudent}
              />
            )}
          </div>
        )}
      </main>

      {/* Standalone Portal Footer */}
      <footer className="relative z-10 max-w-[1280px] w-full mx-auto px-6 py-4 border-t border-emerald-800/60 text-center text-xs text-emerald-200/80">
        © 2026 New State High School · Domine Dirige Nos · mushin, Lagos State, Nigeria
      </footer>
    </div>
  );
}
