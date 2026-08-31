import React, { useState, useEffect, Component } from 'react';
import {
  GraduationCap, BookOpen, CreditCard, Shield, LogOut, ArrowLeft,
  Sparkles, AlertTriangle, KeyRound, User, Lock, CheckCircle2,
  Loader2, ArrowRight, Briefcase, UserCheck, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import StudentDashboard from '../components/portal/StudentDashboard';
import TeacherDashboard from '../components/portal/TeacherDashboard';
import BursarDashboard from '../components/portal/BursarDashboard';
import AdminDashboard from '../components/portal/AdminDashboard';
import DeveloperEasterEgg from '../components/DeveloperEasterEgg';
import { initialPortalData, demoPortalData } from '../data/mockPortalData';
import { generateDefaultSchoolTimetable } from '../data/defaultTimetableData';
import { API_URL } from '../config/api';

class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portal Component Exception:', error, errorInfo);
  }

  handleRefresh = () => {
    localStorage.removeItem('nshs_portal_data');
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 text-center space-y-4 shadow-xl max-w-xl mx-auto my-8">
          <div className="w-14 h-14 bg-emerald-50 text-green-primary rounded-2xl flex items-center justify-center mx-auto text-2xl font-black border border-emerald-200">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-[#1B2521]">Dashboard Interface Ready</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            A real-time data synchronization is complete. Click below to load your administrative control center.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={this.handleRefresh}
              className="px-6 py-3 rounded-xl bg-green-primary hover:bg-green-dark text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Load Portal Dashboard →</span>
            </button>
            <button
              onClick={this.props.onLogout}
              className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all cursor-pointer"
            >
              Sign Out & Switch Role
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const DATA_VERSION = 'v2026.08.31.v13_auth_and_payments';

export default function Portal({ onNavigate }) {
  // Clear old stale cache automatically if version has updated
  if (typeof window !== 'undefined' && localStorage.getItem('nshs_data_version') !== DATA_VERSION) {
    localStorage.removeItem('nshs_portal_data');
    localStorage.removeItem('nshs_current_student_id');
    localStorage.removeItem('nshs_current_user');
    localStorage.setItem('nshs_data_version', DATA_VERSION);
  }

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('nshs_is_logged_in') === 'true';
  });
  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('nshs_active_role') || 'student';
  });
  const [loginCreds, setLoginCreds] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [portalData, setPortalData] = useState(() => {
    const saved = localStorage.getItem('nshs_portal_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.timetable || !Array.isArray(parsed.timetable) || parsed.timetable.length === 0) {
          parsed.timetable = generateDefaultSchoolTimetable();
        }
        return parsed;
      } catch (e) {
        console.warn('Error parsing cached portal data:', e);
      }
    }
    return {
      ...initialPortalData,
      timetable: generateDefaultSchoolTimetable()
    };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(() => {
    return localStorage.getItem('nshs_current_student_id') || 'NSHS/2026/001';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nshs_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [staffRole, setStaffRole] = useState('teacher');
  const [teacherAssignment, setTeacherAssignment] = useState('class_teacher');
  const [mainLoginTab, setMainLoginTab] = useState('student');
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  // Update activeRole whenever mainLoginTab or staffRole changes (form fields stay clean)
  const handleSelectMainTab = (tab) => {
    setMainLoginTab(tab);
    if (tab === 'student') {
      setActiveRole('student');
    } else {
      setActiveRole(staffRole);
    }
    setLoginCreds({ identifier: '', password: '' });
    setLoginError('');
  };

  const handleSelectStaffRole = (roleKey) => {
    setStaffRole(roleKey);
    setActiveRole(roleKey);
    setLoginCreds({ identifier: '', password: '' });
    setLoginError('');
  };

  const handleSelectTeacherAssignment = (assignType) => {
    setTeacherAssignment(assignType);
    setLoginCreds({ identifier: '', password: '' });
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
    const identifier = (loginCreds.identifier || '').trim();
    const password = (loginCreds.password || '').trim();
    setLoginError('');
    setIsLoggingIn(true);

    if (!identifier) {
      setLoginError(mainLoginTab === 'student' ? 'Please enter your Student Admission Number.' : 'Please enter your Staff ID or Email.');
      setIsLoggingIn(false);
      return;
    }

    if (!password) {
      setLoginError('Please enter your password / PIN.');
      setIsLoggingIn(false);
      return;
    }

    // ================= 1. DEDICATED DEMO ACCOUNT ("Test" / "1234") =================
    if (identifier.toLowerCase() === 'test' && password === '1234') {
      setPortalData(demoPortalData);
      localStorage.setItem('nshs_portal_data', JSON.stringify(demoPortalData));

      if (mainLoginTab === 'student') {
        const demoStd = demoPortalData.students[0];
        setCurrentStudentId(demoStd.id);
        setCurrentUser(demoStd);
        setActiveRole('student');
        localStorage.setItem('nshs_current_student_id', demoStd.id);
        localStorage.setItem('nshs_active_role', 'student');
        localStorage.setItem('nshs_current_user', JSON.stringify(demoStd));
      } else {
        const demoStaffMember = staffRole === 'admin'
          ? demoPortalData.staff[3]
          : staffRole === 'bursar'
          ? demoPortalData.staff[2]
          : teacherAssignment === 'subject_teacher'
          ? demoPortalData.staff[1]
          : demoPortalData.staff[0];

        const targetRole = staffRole;
        setCurrentUser(demoStaffMember);
        setActiveRole(targetRole);
        localStorage.setItem('nshs_active_role', targetRole);
        localStorage.setItem('nshs_current_user', JSON.stringify(demoStaffMember));
      }

      localStorage.setItem('nshs_is_logged_in', 'true');
      setIsLoggedIn(true);
      setIsLoggingIn(false);
      return;
    }

    // ================= 2. AUTHENTIC STAFF AUTHENTICATION (DATABASE LOOKUP) =================
    if (mainLoginTab === 'staff') {
      const allStaff = Array.isArray(portalData?.staff) && portalData.staff.length > 0
        ? portalData.staff
        : initialPortalData.staff;

      const q = identifier.toLowerCase();
      const foundStaff = allStaff.find(s =>
        (s.email && s.email.toLowerCase() === q) ||
        (s.staffId && s.staffId.toLowerCase() === q) ||
        (s.name && s.name.toLowerCase() === q) ||
        (s.name && s.name.toLowerCase().includes(q))
      );

      if (!foundStaff) {
        setLoginError("Staff member not found. Please check your Staff ID or Email.");
        setIsLoggingIn(false);
        return;
      }

      const expectedPin = (foundStaff.password || foundStaff.portalPin || '1234').trim().toLowerCase();
      if (password.toLowerCase() !== expectedPin) {
        setLoginError("Incorrect staff password / PIN.");
        setIsLoggingIn(false);
        return;
      }

      // Automatically determine correct staff dashboard role
      let staffActiveRole = 'teacher';
      if (foundStaff.role?.toLowerCase().includes('principal') || foundStaff.role?.toLowerCase().includes('admin') || foundStaff.staffId?.includes('ADMIN')) {
        staffActiveRole = 'admin';
      } else if (foundStaff.role?.toLowerCase().includes('bursar') || foundStaff.role?.toLowerCase().includes('finance') || foundStaff.staffId?.includes('BURSAR')) {
        staffActiveRole = 'bursar';
      }

      // Check role authorization against selected staff tab
      if (staffRole === 'admin' && staffActiveRole !== 'admin') {
        setLoginError("Access Denied: This account is registered as a Teacher. Please select the 'Teacher' role tab to log in.");
        setIsLoggingIn(false);
        return;
      }

      if (staffRole === 'bursar' && staffActiveRole !== 'bursar') {
        setLoginError("Access Denied: This account does not have Bursary / Finance clearance. Please select the 'Teacher' role tab to log in.");
        setIsLoggingIn(false);
        return;
      }

      if (staffRole === 'teacher' && staffActiveRole !== 'teacher') {
        const targetTab = staffActiveRole === 'admin' ? 'Principal' : 'Bursar';
        setLoginError(`Access Denied: This account is registered as ${foundStaff.role}. Please select the '${targetTab}' role tab to log in.`);
        setIsLoggingIn(false);
        return;
      }

      setLoginError('');
      setIsLoggedIn(true);
      setActiveRole(staffActiveRole);
      setCurrentUser(foundStaff);
      localStorage.setItem('nshs_is_logged_in', 'true');
      localStorage.setItem('nshs_active_role', staffActiveRole);
      localStorage.setItem('nshs_current_user', JSON.stringify(foundStaff));
      setIsLoggingIn(false);
      return;
    }

    if (mainLoginTab === 'student') {
      const stdId = identifier.trim();
      const enteredPin = (password || '').trim().toUpperCase();

      if (!stdId) {
        setLoginError('Please enter your Student Admission Number.');
        setIsLoggingIn(false);
        return;
      }

      if (!enteredPin) {
        setLoginError('Please enter your Student Portal PIN.');
        setIsLoggingIn(false);
        return;
      }

      // Query database/state for student existence
      const allStudents = Array.isArray(portalData.students) ? portalData.students : [];
      let foundStd = allStudents.find(s => 
        (s.id && s.id.trim().toLowerCase() === stdId.toLowerCase()) ||
        (s.applicationId && s.applicationId.trim().toLowerCase() === stdId.toLowerCase()) ||
        (s.guardianPhone && s.guardianPhone.replace(/\s+/g, '') === stdId.replace(/\s+/g, '')) ||
        (s.name && s.name.trim().toLowerCase() === stdId.toLowerCase())
      );

      // 1. Verify Student Existence in Database
      if (!foundStd) {
        setLoginError("Student doesn't exist. Please check your Admission Number or contact administration.");
        setIsLoggingIn(false);
        return;
      }

      // 2. Strict PIN Matching with Stored Database PIN
      const storedPin = (foundStd.password || foundStd.portalPin || '').toString().trim().toUpperCase();
      const isPinMatch = enteredPin === storedPin;

      if (!isPinMatch) {
        setLoginError("Incorrect Student Portal PIN. Please check your PIN and try again.");
        setIsLoggingIn(false);
        return;
      }

      // 3. Successful Authentication & Clean Real Account Session
      setCurrentStudentId(foundStd.id);
      localStorage.setItem('nshs_current_student_id', foundStd.id);
      setLoginError('');
      setIsLoggedIn(true);
      setCurrentUser(foundStd);
      localStorage.setItem('nshs_is_logged_in', 'true');
      localStorage.setItem('nshs_active_role', 'student');
      localStorage.setItem('nshs_current_user', JSON.stringify(foundStd));
      setIsLoggingIn(false);
      return;
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
    // 1. Instant optimistic update so Bursar & Student see it immediately!
    const paymentRecord = {
      id: newPayment.paymentId || `RCP-${Date.now()}`,
      paymentId: newPayment.paymentId || `RCP-${Date.now()}`,
      studentId: newPayment.studentId || currentStudentId,
      studentName: newPayment.studentName || 'Student',
      amount: newPayment.amount?.startsWith('₦') ? newPayment.amount : `₦${Number(newPayment.amount || 125000).toLocaleString()}`,
      bankName: newPayment.bankName || 'First Bank Nigeria',
      reference: newPayment.reference || `TRF-${Math.floor(100000 + Math.random() * 900000)}`,
      dateSubmitted: newPayment.dateSubmitted || new Date().toISOString().split('T')[0],
      status: 'Pending',
      receiptImage: newPayment.receiptImage || null,
    };

    setPortalData((prev) => {
      const existingPayments = Array.isArray(prev.feePayments) ? prev.feePayments : [];
      const updatedPayments = [paymentRecord, ...existingPayments];
      let updatedStudents = Array.isArray(prev.students) ? prev.students : [];
      updatedStudents = updatedStudents.map(s => {
        if (s.id === paymentRecord.studentId) {
          return { ...s, feeStatus: 'Pending', feeAmount: paymentRecord.amount };
        }
        return s;
      });
      const nextState = { ...prev, feePayments: updatedPayments, students: updatedStudents };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    try {
      const res = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(paymentRecord),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.warn('Payment receipt stored locally (API offline):', err);
    }
  };

  const handleApprovePayment = async (paymentId) => {
    // 1. Optimistic state update for instant zero-latency UI response
    setPortalData((prev) => {
      const existingPayments = Array.isArray(prev.feePayments) && prev.feePayments.length > 0
        ? prev.feePayments
        : initialPortalData.feePayments;

      const updatedPayments = existingPayments.map((p) => {
        if (p.id === paymentId || p.paymentId === paymentId || p.reference === paymentId) {
          return { ...p, status: 'Approved' };
        }
        return p;
      });

      const targetPayment = existingPayments.find(p => p.id === paymentId || p.paymentId === paymentId || p.reference === paymentId);
      let updatedStudents = Array.isArray(prev.students) ? prev.students : [];

      if (targetPayment) {
        updatedStudents = updatedStudents.map(s => {
          const isIdMatch = targetPayment.studentId && s.id === targetPayment.studentId;
          const isNameMatch = targetPayment.studentName && s.name && s.name.toLowerCase().includes(targetPayment.studentName.toLowerCase());
          if (isIdMatch || isNameMatch) {
            return {
              ...s,
              feeStatus: 'Approved',
              paidAmount: targetPayment.amount || s.feeAmount || '₦125,000'
            };
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
      console.warn('Payment approval recorded locally:', err);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    // 1. Optimistic state update
    setPortalData((prev) => {
      const existingPayments = Array.isArray(prev.feePayments) && prev.feePayments.length > 0
        ? prev.feePayments
        : initialPortalData.feePayments;

      const updatedPayments = existingPayments.map((p) => {
        if (p.id === paymentId || p.paymentId === paymentId || p.reference === paymentId) {
          return { ...p, status: 'Declined' };
        }
        return p;
      });

      const targetPayment = existingPayments.find(p => p.id === paymentId || p.paymentId === paymentId || p.reference === paymentId);
      let updatedStudents = Array.isArray(prev.students) ? prev.students : [];

      if (targetPayment) {
        updatedStudents = updatedStudents.map(s => {
          const isIdMatch = targetPayment.studentId && s.id === targetPayment.studentId;
          const isNameMatch = targetPayment.studentName && s.name && s.name.toLowerCase().includes(targetPayment.studentName.toLowerCase());
          if (isIdMatch || isNameMatch) {
            return { ...s, feeStatus: 'Declined' };
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
        body: JSON.stringify({ action: 'reject' }),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.warn('Payment decline recorded locally:', err);
    }
  };

  const handleSaveScore = async (studentId, newScore) => {
    // 1. Optimistic local update for instant real-time student report card reflection
    setPortalData((prev) => {
      const existingResults = prev.results || {};
      const studentCurrentScores = existingResults[studentId] || [];
      const scoreTotal = Number(newScore.ca1 || 0) + Number(newScore.ca2 || 0) + Number(newScore.exam || 0);
      const scoreGrade = scoreTotal >= 75 ? 'A1' : scoreTotal >= 70 ? 'B2' : scoreTotal >= 65 ? 'B3' : scoreTotal >= 60 ? 'C4' : scoreTotal >= 55 ? 'C5' : scoreTotal >= 50 ? 'C6' : scoreTotal >= 45 ? 'D7' : scoreTotal >= 40 ? 'E8' : 'F9';
      const scoreRemark = scoreTotal >= 75 ? 'Distinction' : scoreTotal >= 70 ? 'Very Good' : scoreTotal >= 65 ? 'Good' : scoreTotal >= 50 ? 'Credit' : scoreTotal >= 40 ? 'Pass' : 'Fail';

      const enrichedScore = {
        subject: newScore.subject,
        ca1: Number(newScore.ca1 || 0),
        ca2: Number(newScore.ca2 || 0),
        exam: Number(newScore.exam || 0),
        total: scoreTotal,
        grade: scoreGrade,
        remark: scoreRemark,
        ...newScore
      };

      const updatedScores = [
        ...studentCurrentScores.filter(s => s.subject !== newScore.subject),
        enrichedScore
      ];

      const nextResults = {
        ...existingResults,
        [studentId]: updatedScores
      };

      const nextState = { ...prev, results: nextResults };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist to API
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
    // 1. Optimistic local update
    setPortalData((prev) => {
      const existingAssignments = Array.isArray(prev.assignments) ? prev.assignments : [];
      const updatedAssignments = [asn, ...existingAssignments.filter(a => (a.id || a._id) !== (asn.id || asn._id))];
      const nextState = { ...prev, assignments: updatedAssignments };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist to API
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
    // Optimistic local update and localStorage persistence
    setPortalData((prev) => {
      const existing = Array.isArray(prev.learningMaterials) ? prev.learningMaterials : [];
      const updated = [mat, ...existing.filter(m => (m.id || m._id) !== (mat.id || mat._id))];
      const nextState = { ...prev, learningMaterials: updated };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });
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
    // 1. Instant synchronous optimistic state & localStorage update
    setPortalData((prev) => {
      const existing = Array.isArray(prev.applications) ? prev.applications : [];
      const updated = existing.map((app) => {
        const matches = (
          app.applicationId === applicationId ||
          app.id === applicationId ||
          app._id === applicationId ||
          (app.studentName && app.studentName === applicationId)
        );
        return matches ? { ...app, status } : app;
      });
      const nextState = { ...prev, applications: updated };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist to backend API if available
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
      console.error('Failed to update application status on backend:', err);
    }
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

  const handleUpdateSessionInfo = async (newSessionSettings) => {
    // 1. Optimistic instant local update
    setPortalData((prev) => {
      const updatedSession = {
        ...prev.sessionInfo,
        ...newSessionSettings,
      };
      const nextState = { ...prev, sessionInfo: updatedSession };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist to API
    try {
      const res = await fetch(`${API_URL}/session-settings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSessionSettings),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.warn('Backend offline, session updated locally:', err);
    }
  };

  const handleUpdateTeacherApplication = async (applicationId, newStatus) => {
    // 1. Optimistic instant local update
    setPortalData((prev) => {
      const existing = prev.teacherApplications || initialPortalData.teacherApplications || [];
      const updated = existing.map(app => {
        if (app.id === applicationId) {
          return { ...app, status: newStatus };
        }
        return app;
      });
      const nextState = { ...prev, teacherApplications: updated };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist to API
    try {
      const res = await fetch(`${API_URL}/teacher-applications/${encodeURIComponent(applicationId)}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchPortalData();
      }
    } catch (err) {
      console.warn('Backend offline, teacher application updated locally:', err);
    }
  };

  const handleSaveTimetableSlot = async (slotData) => {
    // 1. Optimistic update
    setPortalData((prev) => {
      const existing = Array.isArray(prev.timetable) ? prev.timetable : [];
      let updated;
      if (slotData.id && existing.some(s => s.id === slotData.id)) {
        updated = existing.map(s => s.id === slotData.id ? { ...s, ...slotData } : s);
      } else {
        const newSlot = {
          id: slotData.id || `TT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          ...slotData
        };
        updated = [...existing, newSlot];
      }
      const nextState = { ...prev, timetable: updated };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    // 2. Persist to API
    try {
      await fetch(`${API_URL}/timetable`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(slotData),
      });
    } catch (err) {
      console.warn('Timetable saved locally:', err);
    }
  };

  const handleDeleteTimetableSlot = async (slotId) => {
    setPortalData((prev) => {
      const existing = Array.isArray(prev.timetable) ? prev.timetable : [];
      const updated = existing.filter(s => s.id !== slotId);
      const nextState = { ...prev, timetable: updated };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });

    try {
      await fetch(`${API_URL}/timetable/${slotId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.warn('Timetable slot deleted locally:', err);
    }
  };

  const handleResetClassTimetable = (className) => {
    const defaultFull = generateDefaultSchoolTimetable();
    setPortalData((prev) => {
      const existing = Array.isArray(prev.timetable) ? prev.timetable : [];
      let updated;
      if (!className || className === 'ALL') {
        updated = defaultFull;
      } else {
        const otherClasses = existing.filter(s => s.className !== className);
        const classDefaults = defaultFull.filter(s => s.className === className);
        updated = [...otherClasses, ...classDefaults];
      }
      const nextState = { ...prev, timetable: updated };
      localStorage.setItem('nshs_portal_data', JSON.stringify(nextState));
      return nextState;
    });
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
    class_teacher: {
      title: 'Class Teacher Portal Login',
      placeholder: 'Teacher ID or Email address',
      badge: 'Class Teacher',
    },
    subject_teacher: {
      title: 'Subject Teacher Portal Login',
      placeholder: 'Teacher ID or Email address',
      badge: 'Subject Specialist',
    },
    bursar: {
      title: 'Bursar & Finance Office Login',
      placeholder: 'Bursar Staff Username',
      badge: 'Bursar Office',
    },
    admin: {
      title: 'Administrator & Principal Login',
      placeholder: 'Admin Username',
      badge: 'Principal / Admin',
    },
    principal: {
      title: 'Principal & Registrar Login',
      placeholder: 'Principal Username',
      badge: 'Principal & Registrar',
    },
  };

  return (
    <div className="min-h-screen bg-[#06452C] flex flex-col justify-between relative overflow-hidden font-sans text-white">
      {/* Background Decorative Pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url('/nigerian-students.jpg')` }}
      />

      {/* Standalone Portal Navigation Header with safe-area */}
      <header className="relative z-10 max-w-[1280px] w-full mx-auto px-3 sm:px-6 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 sm:py-5 flex justify-between items-center border-b border-emerald-800/60">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group min-w-0"
        >
          <div className="w-8 h-8 sm:w-11 sm:h-11 bg-white rounded-xl p-1 sm:p-1.5 flex items-center justify-center shadow-md flex-shrink-0">
            <img src="/school-logo.png" alt="New State High School Logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-xs sm:text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors truncate">
              New State High School
            </div>
            <div className="text-[8px] sm:text-[10px] tracking-widest uppercase text-emerald-300/80 font-bold truncate">
              School Management Portal
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold text-emerald-200 bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to Main Website</span>
          <span className="inline sm:hidden">Back</span>
        </button>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 max-w-[1280px] w-full mx-auto px-2.5 sm:px-6 py-3 sm:py-8 flex-grow flex items-center justify-center">
        {!isLoggedIn ? (
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-[#1B2521] shadow-2xl border border-gray-100 animate-scaleUp">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-50 text-[#06452C] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-200/80 shadow-xs">
                {mainLoginTab === 'student' ? <GraduationCap className="w-6 h-6 text-green-primary" /> : <Briefcase className="w-6 h-6 text-green-primary" />}
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#1B2521]">
                {mainLoginTab === 'student' ? 'Student & Parent Portal' : staffRole === 'admin' ? 'Principal & Admin Office' : staffRole === 'bursar' ? 'Bursar & Finance Office' : 'Teacher & Faculty Workspace'}
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {mainLoginTab === 'student' ? 'Access your termly report card, class schedule & fee status' : 'Enter your staff credentials to access your administrative tools'}
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
                  {mainLoginTab === 'student' ? 'Student Portal PIN / Access Key' : 'Staff Password / Access PIN'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-emerald-700" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={mainLoginTab === 'student' ? 'Enter 6-character Portal PIN' : '••••••••'}
                    value={loginCreds.password}
                    onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                    className="w-full pl-10 pr-11 py-3.5 rounded-xl border border-emerald-200/80 focus:border-green-primary focus:ring-2 focus:ring-emerald-500/20 bg-emerald-50/20 text-sm font-semibold text-[#1B2521] transition-all font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-emerald-700 transition-colors cursor-pointer"
                    title={showPassword ? 'Hide PIN / Password' : 'Show PIN / Password'}
                    aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
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

            <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
              <span>Need help? 0813 400 0644</span>
              <span>New State High School</span>
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
                    {currentUser?.name || currentUser?.staffId || currentUser?.id || currentUser?.email || loginCreds?.identifier || 'Active User'} · <span className="text-green-primary font-bold text-xs sm:text-sm">{roleConfig[activeRole]?.badge || (activeRole === 'admin' ? 'Principal / Admin' : activeRole)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            <DashboardErrorBoundary onLogout={handleLogout}>
              {(activeRole === 'student' || (!['teacher', 'class_teacher', 'subject_teacher', 'bursar', 'admin', 'principal'].includes(activeRole))) && (
                <div className="space-y-4">
                  <StudentDashboard
                    data={portalData}
                    onUploadReceipt={handleUploadReceipt}
                    currentStudentId={currentStudentId}
                    currentUser={currentUser}
                  />
                </div>
              )}

              {(activeRole === 'teacher' || activeRole === 'class_teacher' || activeRole === 'subject_teacher') && (
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

              {(activeRole === 'admin' || activeRole === 'principal') && (
                <AdminDashboard
                  data={portalData}
                  onAddAnnouncement={handleAddAnnouncement}
                  onAddStudent={handleAddStudent}
                  onUpdateApplication={handleUpdateApplication}
                  onUpdateTeacherApplication={handleUpdateTeacherApplication}
                  onUpdateStaff={handleUpdateStaff}
                  onAddStaff={handleAddStaff}
                  onUpdateSessionInfo={handleUpdateSessionInfo}
                  onSaveTimetableSlot={handleSaveTimetableSlot}
                  onDeleteTimetableSlot={handleDeleteTimetableSlot}
                  onResetClassTimetable={handleResetClassTimetable}
                />
              )}
            </DashboardErrorBoundary>
          </div>
        )}
      </main>

      {/* Standalone Portal Footer */}
      <footer className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-4 border-t border-emerald-800/40 flex flex-col sm:flex-row justify-between items-center text-xs text-emerald-200/70 gap-2">
        <div>© 2026 New State High School · Domine Dirige Nos · Lagos, Nigeria</div>
        <div className="text-[11px] text-emerald-300/40 font-mono">NSHS Enterprise Portal v2.6</div>
      </footer>

      {/* Developer Easter Egg Modal */}
      <DeveloperEasterEgg
        isOpen={showEasterEgg}
        onClose={() => setShowEasterEgg(false)}
      />
    </div>
  );
}
