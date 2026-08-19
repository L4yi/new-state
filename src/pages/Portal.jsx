import React, { useState, useEffect } from 'react';
import {
  GraduationCap, BookOpen, CreditCard, Shield, LogOut, ArrowLeft,
  Sparkles, AlertTriangle, KeyRound, User, Lock, CheckCircle2
} from 'lucide-react';
import StudentDashboard from '../components/portal/StudentDashboard';
import TeacherDashboard from '../components/portal/TeacherDashboard';
import BursarDashboard from '../components/portal/BursarDashboard';
import AdminDashboard from '../components/portal/AdminDashboard';
import { initialPortalData } from '../data/mockPortalData';
import { API_URL } from '../config/api';

export default function Portal({ onNavigate }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeRole, setActiveRole] = useState('student');
  const [loginCreds, setLoginCreds] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [portalData, setPortalData] = useState(() => {
    const saved = localStorage.getItem('nshs_portal_data');
    return saved ? JSON.parse(saved) : initialPortalData;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState('NSHS/2024/001');

  const fetchPortalData = async () => {
    try {
      const res = await fetch(`${API_URL}/data`);
      if (res.ok) {
        const data = await res.json();
        setPortalData(data);
        localStorage.setItem('nshs_portal_data', JSON.stringify(data));
      }
    } catch (err) {
      console.warn('Backend unavailable, using local cached data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const identifier = loginCreds.identifier.trim();
    if (!identifier) {
      setLoginError('Please enter your ID, Phone Number or Username.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: loginCreds.password, role: activeRole }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setLoginError('');
        setIsLoggedIn(true);
        if (activeRole === 'student') {
          setCurrentStudentId(data.user.id);
        }
      } else {
        setLoginError(data.error || 'Authentication failed');
      }
    } catch (err) {
      // Fallback for offline demo mode
      console.warn('API connection failed, falling back to local session');
      setLoginError('');
      setIsLoggedIn(true);
    }
  };

  // Data Handlers
  const handleUploadReceipt = async (newPayment) => {
    try {
      const res = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.error('Payment upload failed:', err);
    }
  };

  const handleApprovePayment = async (paymentId) => {
    try {
      const res = await fetch(`${API_URL}/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.error('Payment approval failed:', err);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    try {
      const res = await fetch(`${API_URL}/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.error('Payment rejection failed:', err);
    }
  };

  const handleSaveScore = async (studentId, newScore) => {
    try {
      const res = await fetch(`${API_URL}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, result: newScore }),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  };

  const handleAddAssignment = async (asn) => {
    try {
      const res = await fetch(`${API_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asn),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.error('Failed to add assignment:', err);
    }
  };

  const handleUploadMaterial = (mat) => {
    // Keep local for now
    setPortalData((prev) => ({
      ...prev,
      learningMaterials: [mat, ...prev.learningMaterials],
    }));
  };

  const handleAddAnnouncement = async (anc) => {
    try {
      const res = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anc),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.error('Failed to add announcement:', err);
    }
  };

  const handleAddStudent = async (std) => {
    try {
      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(std),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.error('Failed to register student:', err);
    }
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
      <header className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center border-b border-emerald-800/60">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-xl p-1 sm:p-1.5 flex items-center justify-center shadow-md">
            <img src="/school-logo.png" alt="New State High School Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              New State High School
            </div>
            <div className="text-[9px] sm:text-[10px] tracking-widest uppercase text-emerald-300/80 font-bold">
              School Management Portal
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold text-emerald-200 bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to Main Website</span>
          <span className="inline sm:hidden">Back</span>
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
                {portalData?.sessionInfo?.currentSession || '2026/2027 Academic Session'} · {portalData?.sessionInfo?.currentTerm || 'First Term'}
              </p>
            </div>

            {/* Embedded Role Selector Buttons Inside Form Box */}
            <div className="bg-[#F4F7F5] p-1.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1 mb-6 border border-gray-200/80">
              {[
                { id: 'student', label: 'Student', icon: GraduationCap },
                { id: 'teacher', label: 'Teacher', icon: BookOpen },
                { id: 'bursar', label: 'Bursar', icon: CreditCard },
                { id: 'admin', label: 'Admin', icon: Shield },
              ].map((role) => {
                const RoleIcon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setActiveRole(role.id);
                      setLoginError('');
                    }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeRole === role.id
                        ? 'bg-green-primary text-white shadow-sm'
                        : 'text-[#55635C] hover:bg-white/60'
                    }`}
                  >
                    <RoleIcon className="w-3.5 h-3.5" />
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 text-center mb-4 flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-700" />
                <span>{loginError}</span>
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
            <div className="flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-md gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-green-primary animate-pulse flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none mb-1">Logged in User</span>
                  <div className="text-sm sm:text-base font-extrabold text-[#1B2521] truncate">
                    {loginCreds.identifier} · <span className="text-green-primary font-bold text-xs sm:text-sm">{roleConfig[activeRole].badge}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Sign Out</span>
              </button>
            </div>

            {activeRole === 'student' && (
              <div className="space-y-4">
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
