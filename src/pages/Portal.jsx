import React, { useState, useEffect } from 'react';
import {
  GraduationCap, BookOpen, CreditCard, Shield, LogOut, ArrowLeft,
  Sparkles, AlertTriangle, KeyRound, User, Lock, CheckCircle2,
  Loader2, ArrowRight, Briefcase, UserCheck
} from 'lucide-react';
import StudentDashboard from '../components/portal/StudentDashboard';
import TeacherDashboard from '../components/portal/TeacherDashboard';
import BursarDashboard from '../components/portal/BursarDashboard';
import AdminDashboard from '../components/portal/AdminDashboard';
import { initialPortalData } from '../data/mockPortalData';
import { API_URL } from '../config/api';

export default function Portal({ onNavigate }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('nshs_is_logged_in') === 'true';
  });
  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('nshs_active_role') || 'student';
  });
  const [loginCreds, setLoginCreds] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [portalData, setPortalData] = useState(() => {
    const saved = localStorage.getItem('nshs_portal_data');
    return saved ? JSON.parse(saved) : initialPortalData;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(() => {
    return localStorage.getItem('nshs_current_student_id') || 'NSHS/2024/001';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nshs_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [mainLoginTab, setMainLoginTab] = useState('student'); // 'student' | 'staff'
  const [staffRole, setStaffRole] = useState('teacher'); // 'teacher' | 'bursar' | 'admin'
  const [teacherAssignment, setTeacherAssignment] = useState('class_teacher'); // 'class_teacher' | 'subject_teacher'

  // Update activeRole whenever mainLoginTab or staffRole changes
  const handleSelectMainTab = (tab) => {
    setMainLoginTab(tab);
    if (tab === 'student') {
      setActiveRole('student');
      setLoginCreds({ identifier: '', password: '' });
    } else {
      setActiveRole(staffRole);
      if (staffRole === 'teacher') {
        setLoginCreds({
          identifier: teacherAssignment === 'class_teacher' ? 'science@newstateschools.org' : 'subject.teacher@newstateschools.org',
          password: '1234'
        });
      } else if (staffRole === 'bursar') {
        setLoginCreds({ identifier: 'bursar', password: '1234' });
      } else {
        setLoginCreds({ identifier: 'admin', password: '1234' });
      }
    }
    setLoginError('');
  };

  const handleSelectStaffRole = (roleKey) => {
    setStaffRole(roleKey);
    setActiveRole(roleKey);
    if (roleKey === 'teacher') {
      setLoginCreds({
        identifier: teacherAssignment === 'class_teacher' ? 'science@newstateschools.org' : 'subject.teacher@newstateschools.org',
        password: '1234'
      });
    } else if (roleKey === 'bursar') {
      setLoginCreds({ identifier: 'bursar', password: '1234' });
    } else if (roleKey === 'admin') {
      setLoginCreds({ identifier: 'admin', password: '1234' });
    }
    setLoginError('');
  };

  const handleSelectTeacherAssignment = (assignType) => {
    setTeacherAssignment(assignType);
    setLoginCreds({
      identifier: assignType === 'class_teacher' ? 'science@newstateschools.org' : 'subject.teacher@newstateschools.org',
      password: '1234'
    });
    setLoginError('');
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('nshs_auth_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchPortalData = async () => {
    try {
      const res = await fetch(`${API_URL}/data`, {
        headers: getAuthHeaders()
      });
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
  }, [isLoggedIn, activeRole]);

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const identifier = loginCreds.identifier.trim();
    if (!identifier) {
      setLoginError('Please enter your ID, Phone Number or Username.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

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
        setCurrentUser(data.user);
        
        localStorage.setItem('nshs_is_logged_in', 'true');
        localStorage.setItem('nshs_active_role', activeRole);
        localStorage.setItem('nshs_current_user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('nshs_auth_token', data.token);
        }
        
        if (activeRole === 'student') {
          setCurrentStudentId(data.user.id);
          localStorage.setItem('nshs_current_student_id', data.user.id);
        }
        
        // Re-fetch role-authorized data with the new token
        setTimeout(() => fetchPortalData(), 100);
        return;
      } else {
        setLoginError(data.error || 'Authentication failed');
        return;
      }
    } catch (err) {
      // Fallback for offline/demo mode
      console.warn('API unavailable, resolving from local staff database');
      if (activeRole === 'teacher') {
        const staffList = portalData?.staff || initialPortalData.staff || [];
        const found = staffList.find(
          (s) =>
            s.email?.toLowerCase() === identifier.toLowerCase() ||
            s.username?.toLowerCase() === identifier.toLowerCase() ||
            s.name?.toLowerCase().includes(identifier.toLowerCase())
        ) || staffList[0];

        setLoginError('');
        setIsLoggedIn(true);
        setCurrentUser(found);
        localStorage.setItem('nshs_is_logged_in', 'true');
        localStorage.setItem('nshs_active_role', 'teacher');
        localStorage.setItem('nshs_current_user', JSON.stringify(found));
        return;
      }

      setLoginError('');
      setIsLoggedIn(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('nshs_is_logged_in');
    localStorage.removeItem('nshs_active_role');
    localStorage.removeItem('nshs_current_user');
    localStorage.removeItem('nshs_current_student_id');
    localStorage.removeItem('nshs_auth_token');
  };

  // Data Handlers
  const handleUploadReceipt = async (newPayment) => {
    try {
      const res = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
    // 1. Optimistic state update for instant zero-latency UI response
    setPortalData((prev) => {
      const existingPayments = prev.feePayments || [];
      const updatedPayments = existingPayments.map((p) => {
        if (p.id === paymentId || p.paymentId === paymentId || p.reference === paymentId) {
          return { ...p, status: 'Approved' };
        }
        return p;
      });
      const targetPayment = existingPayments.find(p => p.id === paymentId || p.paymentId === paymentId || p.reference === paymentId);
      let updatedStudents = prev.students || [];
      if (targetPayment && targetPayment.studentId) {
        updatedStudents = updatedStudents.map(s => {
          if (s.id === targetPayment.studentId) {
            return { ...s, feeStatus: 'Approved', paidAmount: targetPayment.amount };
          }
          return s;
        });
      }
      const nextState = { ...prev, feePayments: updatedPayments, students: updatedStudents };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist to MongoDB API
    try {
      const res = await fetch(`${API_URL}/payments/${paymentId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
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
    // 1. Optimistic state update
    setPortalData((prev) => {
      const existingPayments = prev.feePayments || [];
      const updatedPayments = existingPayments.map((p) => {
        if (p.id === paymentId || p.paymentId === paymentId || p.reference === paymentId) {
          return { ...p, status: 'Declined' };
        }
        return p;
      });
      const nextState = { ...prev, feePayments: updatedPayments };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist to MongoDB API
    try {
      const res = await fetch(`${API_URL}/payments/${paymentId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
        body: JSON.stringify({ studentId, result: newScore, teacherId: currentUser?._id }),
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
        headers: getAuthHeaders(),
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
    // 1. Optimistic instant local update
    setPortalData((prev) => {
      const existing = prev.announcements || [];
      const updated = [anc, ...existing.filter(a => (a.id || a.announcementId) !== (anc.id || anc.announcementId))];
      const nextState = { ...prev, announcements: updated };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist to MongoDB API
    try {
      const res = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
    // 1. Optimistic instant local update
    setPortalData((prev) => {
      const existing = prev.students || [];
      const updated = [std, ...existing.filter(s => s.id !== std.id)];
      const nextState = { ...prev, students: updated };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist directly to MongoDB Atlas
    try {
      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(std),
      });
      if (res.ok) {
        const savedStudent = await res.json();
        setPortalData((prev) => {
          const existing = prev.students || [];
          const updated = existing.map(s => s.id === std.id ? savedStudent : s);
          const nextState = { ...prev, students: updated };
          localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
          return nextState;
        });
        fetchPortalData();
      }
    } catch (err) {
      console.error('Failed to register student on backend:', err);
    }
  };

  const handleUpdateApplication = async (applicationId, status) => {
    try {
      const res = await fetch(`${API_URL}/applications/${applicationId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.error('Failed to update application status:', err);
    }

    // Update local state immediately as well
    setPortalData((prev) => {
      const existing = prev.applications || [];
      const updated = existing.map(app => (app.applicationId === applicationId || app.id === applicationId) ? { ...app, status } : app);
      const nextState = { ...prev, applications: updated };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });
  };

  const handleUpdateStaff = async (staffIdOrEmail, updates) => {
    // 1. Optimistic local update
    setPortalData((prev) => {
      const existingStaff = prev.staff || [];
      const updatedStaff = existingStaff.map((s) => {
        if (s.email?.toLowerCase() === staffIdOrEmail?.toLowerCase() || s.staffId === staffIdOrEmail || s._id === staffIdOrEmail) {
          return { ...s, ...updates, isClassTeacher: Boolean(updates.classAssigned) };
        }
        return s;
      });
      const nextState = { ...prev, staff: updatedStaff };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist to API
    try {
      const res = await fetch(`${API_URL}/staff/${encodeURIComponent(staffIdOrEmail)}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.error('Failed to update staff allocation:', err);
    }
  };

  const handleAddStaff = async (newStaffMember) => {
    // 1. Optimistic local update
    setPortalData((prev) => {
      const existing = prev.staff || [];
      const updated = [...existing.filter(s => s.email !== newStaffMember.email), newStaffMember];
      const nextState = { ...prev, staff: updated };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist to API
    try {
      const res = await fetch(`${API_URL}/staff`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newStaffMember),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.error('Failed to add staff record:', err);
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

            {/* 1. Main Role Switcher: Student Login vs Staff Login */}
            <div className="bg-[#F4F7F5] p-1.5 rounded-2xl grid grid-cols-2 gap-1.5 mb-5 border border-gray-200/80">
              <button
                type="button"
                onClick={() => handleSelectMainTab('student')}
                className={`py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  mainLoginTab === 'student'
                    ? 'bg-[#06452C] text-white shadow-md border-b-2 border-emerald-400'
                    : 'text-[#55635C] hover:bg-emerald-50/60'
                }`}
              >
                <User className="w-4 h-4 text-emerald-300" />
                <span>Student Login</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMainTab('staff')}
                className={`py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  mainLoginTab === 'staff'
                    ? 'bg-[#06452C] text-white shadow-md border-b-2 border-emerald-400'
                    : 'text-[#55635C] hover:bg-emerald-50/60'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-300" />
                <span>Staff Login</span>
              </button>
            </div>

            {/* 2. When Staff Login is Active: SELECT STAFF ROLE */}
            {mainLoginTab === 'staff' && (
              <div className="space-y-3 mb-5">
                <div className="bg-[#FAFCFA] p-3.5 rounded-2xl border border-gray-200/80 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#06452C]">
                    SELECT STAFF ROLE
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'teacher', label: 'Teacher' },
                      { id: 'bursar', label: 'Bursar' },
                      { id: 'admin', label: 'Principal' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleSelectStaffRole(r.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                          staffRole === r.id
                            ? 'bg-[#06452C] text-white shadow-sm font-black ring-2 ring-emerald-500/30'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-300'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. If Teacher selected: TEACHER ASSIGNMENT ROLE */}
                {staffRole === 'teacher' && (
                  <div className="bg-[#F0F7F4] p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-green-primary">
                      TEACHER ASSIGNMENT ROLE
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectTeacherAssignment('class_teacher')}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                          teacherAssignment === 'class_teacher'
                            ? 'bg-[#06452C] text-white shadow-sm font-black ring-2 ring-emerald-500/30'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-300'
                        }`}
                      >
                        Class Teacher
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectTeacherAssignment('subject_teacher')}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                          teacherAssignment === 'subject_teacher'
                            ? 'bg-[#06452C] text-white shadow-sm font-black ring-2 ring-emerald-500/30'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-300'
                        }`}
                      >
                        Subject Teacher
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 text-center mb-4 flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-700" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5 text-xs">
                  {mainLoginTab === 'student'
                    ? 'Student Admission Number'
                    : staffRole === 'teacher'
                    ? 'Teacher Staff ID'
                    : staffRole === 'bursar'
                    ? 'Bursar Staff ID'
                    : 'Principal Staff ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder={
                      mainLoginTab === 'student'
                        ? 'e.g. FFC202500510 or NSHS/2026/001'
                        : staffRole === 'teacher'
                        ? 'e.g. TCH/PHYS/042 or Email'
                        : staffRole === 'bursar'
                        ? 'BURSAR-01'
                        : 'ADMIN-01'
                    }
                    value={loginCreds.identifier}
                    onChange={(e) => setLoginCreds({ ...loginCreds, identifier: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-3.5 rounded-xl border border-emerald-200/80 focus:border-green-primary focus:ring-2 focus:ring-emerald-500/20 bg-emerald-50/20 text-sm font-semibold text-[#1B2521] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5 text-xs">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-emerald-700" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginCreds.password}
                    onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-3.5 rounded-xl border border-emerald-200/80 focus:border-green-primary focus:ring-2 focus:ring-emerald-500/20 bg-emerald-50/20 text-sm font-semibold text-[#1B2521] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 rounded-xl font-extrabold text-sm text-white bg-green-primary hover:bg-green-dark transition-all shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing In Securely...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
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
                onClick={handleLogout}
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
                currentUser={currentUser}
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
                onUpdateApplication={handleUpdateApplication}
                onUpdateStaff={handleUpdateStaff}
                onAddStaff={handleAddStaff}
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
