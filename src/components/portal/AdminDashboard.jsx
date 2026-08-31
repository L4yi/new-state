import React, { useState } from 'react';
import {
  Search, Megaphone, UserPlus, Shield, CheckCircle2, Database, Send, Users, User,
  Award, Calendar, Phone, Mail, MapPin, HeartPulse, CreditCard, Sparkles, Printer, FileText, ChevronDown,
  Building2, Hash, IdCard, MessageSquare, CheckSquare, GraduationCap, BookOpen, FileCheck,
  KeyRound, RefreshCw, Copy, Check, ShieldCheck, QrCode, Inbox, ArrowRight, XCircle, Clock,
  Briefcase, Plus, Download, FileSpreadsheet, Loader2, CalendarDays, Trash2, Edit3, RotateCcw, AlertTriangle, X
} from 'lucide-react';
import { printDocument } from '../../utils/printUtils';
import { STANDARD_PERIODS, JSS_SUBJECTS, SSS_SUBJECTS, STANDARD_ROOMS, STANDARD_DAYS } from '../../data/defaultTimetableData';
import SuccessModal from './SuccessModal';

// Generates a clean, cryptographically random, unambiguous 6-character alphanumeric PIN
const generateRandomPin = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let pin = '';
  for (let i = 0; i < 6; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pin;
};

export default function AdminDashboard({
  data,
  onAddAnnouncement,
  onAddStudent,
  onUpdateApplication,
  onUpdateStaff,
  onAddStaff,
  onUpdateSessionInfo,
  onSaveTimetableSlot,
  onDeleteTimetableSlot,
  onResetClassTimetable
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalFeedback, setModalFeedback] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  const defaultAvailableSessions = ['2027/2028', '2026/2027', '2025/2026', '2024/2025', '2023/2024'];
  const [availableSessions, setAvailableSessions] = useState(() => {
    return Array.isArray(data?.sessionInfo?.availableSessions) ? data.sessionInfo.availableSessions : defaultAvailableSessions;
  });
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newSessionForm, setNewSessionForm] = useState({
    sessionName: '2027/2028',
    startingTerm: '1st Term',
    resumptionDate: '2027-09-13',
    schoolDays: '118'
  });
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const [sessionForm, setSessionForm] = useState({
    currentSession: data?.sessionInfo?.currentSession || '2025/2026',
    currentTerm: data?.sessionInfo?.currentTerm || '3rd Term',
    nextTermBegins: data?.sessionInfo?.nextTermBegins || '2026-09-14',
    schoolDays: data?.sessionInfo?.schoolDays || '118'
  });
  const [sessionFeedback, setSessionFeedback] = useState('');
  const [isUpdatingSession, setIsUpdatingSession] = useState(false);

  const handleCreateNewSession = async (e) => {
    if (e) e.preventDefault();
    const cleanSession = newSessionForm.sessionName.trim();
    if (!cleanSession) return;

    setIsCreatingSession(true);
    const updatedSessions = availableSessions.includes(cleanSession)
      ? availableSessions
      : [cleanSession, ...availableSessions];

    setAvailableSessions(updatedSessions);

    const newSettings = {
      ...sessionForm,
      currentSession: cleanSession,
      currentTerm: newSessionForm.startingTerm || '1st Term',
      nextTermBegins: newSessionForm.resumptionDate || '2027-09-13',
      schoolDays: newSessionForm.schoolDays || '118',
      availableSessions: updatedSessions,
      newSession: cleanSession,
    };

    setSessionForm(newSettings);

    try {
      if (onUpdateSessionInfo) {
        await onUpdateSessionInfo(newSettings);
      }
      setShowNewSessionModal(false);
      setSessionFeedback(`New Academic Session (${cleanSession}) created and activated school-wide!`);
      setTimeout(() => setSessionFeedback(''), 5500);
    } catch (err) {
      console.error('Failed to create new session:', err);
    } finally {
      setIsCreatingSession(false);
    }
  };
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const [noticeMsg, setNoticeMsg] = useState('');
  const [registeredStudentSlip, setRegisteredStudentSlip] = useState(null);
  const [copiedPin, setCopiedPin] = useState(false);
  const [selectedApplicationForReview, setSelectedApplicationForReview] = useState(null);
  const [staffUpdateFeedback, setStaffUpdateFeedback] = useState('');
  const [isEnrollingStudent, setIsEnrollingStudent] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isBroadcastingNotice, setIsBroadcastingNotice] = useState(false);

  // Add new teacher form state
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Sciences & Technology',
    role: 'Teacher',
    subject: 'Physics',
    classAssigned: 'None',
  });

  // Intricate Student Registration Form State with Internal Entrance Criteria
  const [studentForm, setStudentForm] = useState({
    surname: '',
    firstName: '',
    middleName: '',
    gender: 'Male',
    dob: '2010-05-15',
    ninOrLasrra: '',
    stateOfOrigin: 'Lagos',
    lga: 'Mushin',
    nationality: 'Nigerian',
    bloodGroup: 'O+',
    genotype: 'AA',
    religion: 'Christianity',
    admissionCriteria: 'Internal Entrance Examination',
    entranceExamScore: '84%',
    priorClass: 'Primary 6',
    entryClass: 'JSS 1',
    classArm: 'Arm A',
    academicTrack: 'Junior Secondary Foundation',
    house: 'Red House (Tiger)',
    boardingStatus: 'Day Student',
    previousSchool: 'Crown Model Primary School, Palm Avenue',
    medicalConditions: 'None',
    guardianName: '',
    guardianRelationship: 'Father',
    guardianPhone: '',
    guardianEmail: '',
    fatherOccupation: 'Civil Servant / Business Executive',
    motherName: '',
    motherOccupation: 'Educationist / Trader',
    motherPhone: '',
    guardianAddress: '36 Palm Avenue, Mushin, Lagos',
    emergencyContact: '',
    emergencyPhone: '',
    whatsappAlertsEnabled: true,
    feeStatus: 'Unpaid',
    initialDeposit: '0',
    portalPin: generateRandomPin(),
  });

  const studentsList = Array.isArray(data?.students) ? data.students : [];
  const filteredStudents = studentsList.filter(
    (s) =>
      (s?.name || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s?.id || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s?.class || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s?.guardian && (s.guardian || '')?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fallback sample applications if none submitted yet
  const defaultApplications = [
    {
      applicationId: 'APP-2026-081',
      studentName: 'Chukwuemeka David Adebayo',
      gender: 'Male',
      dob: '2011-04-12',
      currentClass: 'Primary 6',
      classApplyingFor: 'JSS 1',
      guardianName: 'Dr. Emeka Adebayo',
      guardianRelationship: 'Father',
      primaryPhone: '0803 456 7890',
      email: 'emeka.adebayo@gmail.com',
      address: '14 Palm Avenue, Mushin, Lagos',
      previousSchool: 'St. Jude Model Primary School, Lagos',
      medicalConditions: 'None',
      status: 'Pending Review',
      dateSubmitted: '2026-08-19'
    },
    {
      applicationId: 'APP-2026-082',
      studentName: 'Amina Fatima Bello',
      gender: 'Female',
      dob: '2010-09-24',
      currentClass: 'JSS 3',
      classApplyingFor: 'SSS 1 (Science)',
      guardianName: 'Alhaji Ibrahim Bello',
      guardianRelationship: 'Father',
      primaryPhone: '0802 345 6789',
      email: 'ibrahim.bello@yahoo.com',
      address: '22 Agege Motor Road, Mushin, Lagos',
      previousSchool: 'Federal Government College, Lagos',
      medicalConditions: 'Asthmatic (Mild)',
      status: 'Pending Review',
      dateSubmitted: '2026-08-20'
    },
    {
      applicationId: 'APP-2026-083',
      studentName: 'Blessing Chioma Okafor',
      gender: 'Female',
      dob: '2011-02-18',
      currentClass: 'Primary 6',
      classApplyingFor: 'JSS 1',
      guardianName: 'Mrs. Nkechi Okafor',
      guardianRelationship: 'Mother',
      primaryPhone: '0813 987 6543',
      email: 'nkechi.okafor@outlook.com',
      address: '5 Olateju Street, Mushin, Lagos',
      previousSchool: 'Grace Children School, Lagos',
      medicalConditions: 'None',
      status: 'Pending Review',
      dateSubmitted: '2026-08-20'
    }
  ];

  const applicationsList = (Array.isArray(data?.applications) && data.applications.length > 0)
    ? data.applications
    : defaultApplications;

  const pendingAppsCount = applicationsList.filter(a => a?.status === 'Pending Review').length;

  const filteredApplications = applicationsList.filter(
    (app) =>
      (app?.studentName || app?.name || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app?.applicationId || app?.id || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app?.classApplyingFor || app?.class || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app?.guardianName || app?.guardian || '')?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Default teachers list with standard Arm naming
  const defaultStaff = [
    {
      staffId: 'STF/2026/001',
      name: 'Mr. Babatunde Ogunlesi',
      email: 'b.ogunlesi@newstateschools.org',
      role: 'Senior Teacher / Subject Master',
      department: 'Sciences & Technology',
      phone: '0813 400 0644',
      isClassTeacher: true,
      classAssigned: 'SSS 3 - Arm A',
      subjectsTaught: [
        { subjectName: 'Physics', className: 'SSS 3 - Arm A' },
        { subjectName: 'Physics', className: 'SSS 2 - Arm A' },
        { subjectName: 'Further Mathematics', className: 'SSS 3 - Arm A' }
      ]
    },
    {
      staffId: 'STF/2026/002',
      name: 'Mrs. Folashade Adeleke',
      email: 'f.adeleke@newstateschools.org',
      role: 'Teacher / Subject Master',
      department: 'Languages & Arts',
      phone: '0802 345 6789',
      isClassTeacher: true,
      classAssigned: 'JSS 1 - Arm A',
      subjectsTaught: [
        { subjectName: 'English Language', className: 'JSS 1 - Arm A' },
        { subjectName: 'Literature in English', className: 'SSS 1 - Arm A' }
      ]
    },
    {
      staffId: 'STF/2026/003',
      name: 'Mr. Emeka Okafor',
      email: 'e.okafor@newstateschools.org',
      role: 'Subject Teacher',
      department: 'Commercial Studies',
      phone: '0803 876 5432',
      isClassTeacher: false,
      classAssigned: null,
      subjectsTaught: [
        { subjectName: 'Mathematics', className: 'SSS 1 - Arm A' },
        { subjectName: 'Economics', className: 'SSS 2 - Arm A' }
      ]
    },
    {
      staffId: 'STF/2026/004',
      name: 'Dr. S. O. Balogun',
      email: 's.balogun@newstateschools.org',
      role: 'Subject Teacher & ICT Director',
      department: 'ICT & AI Coding',
      phone: '0814 123 9876',
      isClassTeacher: false,
      classAssigned: null,
      subjectsTaught: [
        { subjectName: 'Computer Studies (AI & Coding)', className: 'JSS 1 - Arm A' },
        { subjectName: 'Computer Studies (AI & Coding)', className: 'SSS 3 - Arm A' }
      ]
    }
  ];

  const staffList = (Array.isArray(data?.staff) && data.staff.length > 0) ? data.staff : defaultStaff;

  const filteredStaff = staffList.filter(
    (st) =>
      (st?.name || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (st?.email || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (st?.department && (st.department || '')?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (st?.classAssigned && (st.classAssigned || '')?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
  ];

  const availableClassArms = [
    'None (Subject Teacher Only)',
    'JSS 1 - Arm A',
    'JSS 1 - Arm B',
    'JSS 2 - Arm A',
    'JSS 2 - Arm B',
    'JSS 3 - Arm A',
    'JSS 3 - Arm B',
    'SSS 1 - Arm A',
    'SSS 1 - Arm B',
    'SSS 2 - Arm A',
    'SSS 2 - Arm B',
    'SSS 3 - Arm A',
    'SSS 3 - Arm B'
  ];

  // 1-Click Master Data Exporter (CSV / Excel Compatible)
  const exportToCSV = (filename, rows, headers) => {
    const processRow = (row) => {
      return row.map((val) => {
        if (val === null || val === undefined) return '""';
        let str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(',');
    };

    const csvContent = '\uFEFF' + [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(processRow)
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportStudentsCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Class', 'Gender', 'State of Origin', 'Guardian Name', 'Guardian Phone', 'Address', 'Fee Status'];
    const rows = studentsList.map(s => [
      s.id || '',
      s.name || '',
      s.class || '',
      s.gender || 'Male',
      s.stateOfOrigin || 'Lagos',
      s.guardian || '',
      s.guardianPhone || '',
      s.address || 'Lagos, Nigeria',
      s.feeStatus || 'Unpaid'
    ]);
    exportToCSV('NSHS_Students_Master_Registry', rows, headers);
  };

  const exportStaffCSV = () => {
    const headers = ['Staff ID', 'Full Name', 'Department', 'Role', 'Primary Subject', 'Assigned Class', 'Phone', 'Email'];
    const rows = staffList.map(st => [
      st.staffId || '',
      st.name || '',
      st.department || '',
      st.role || '',
      st.subjectsTaught?.[0]?.subjectName || 'General Subject',
      st.classAssigned || 'None',
      st.phone || '',
      st.email || ''
    ]);
    exportToCSV('NSHS_Staff_Directory', rows, headers);
  };

  const exportApplicationsCSV = () => {
    const headers = ['Application ID', 'Applicant Name', 'Gender', 'Class Applied', 'Guardian Name', 'Phone', 'Email', 'Status', 'Date Submitted'];
    const rows = applicationsList.map(a => [
      a.applicationId || '',
      a.studentName || '',
      a.gender || '',
      a.classApplyingFor || '',
      a.guardianName || '',
      a.primaryPhone || '',
      a.email || '',
      a.status || '',
      a.dateSubmitted || ''
    ]);
    exportToCSV('NSHS_Admissions_Applications', rows, headers);
  };

  // Timetable & Schedules State
  const [selectedTimetableClass, setSelectedTimetableClass] = useState('SSS 3 - Arm A');
  const [selectedTimetableDay, setSelectedTimetableDay] = useState('All');
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotForm, setSlotForm] = useState({
    id: '',
    className: 'SSS 3 - Arm A',
    day: 'Monday',
    period: '1st Period',
    time: '08:00 AM - 08:45 AM',
    subject: 'Mathematics',
    teacherName: 'Mr. Babatunde Ogunlesi',
    room: 'Room 201 (Senior Block)'
  });
  const [isSavingSlot, setIsSavingSlot] = useState(false);
  const [timetableFeedback, setTimetableFeedback] = useState('');
  const [showPrintTimetableModal, setShowPrintTimetableModal] = useState(false);

  const timetableList = Array.isArray(data?.timetable) ? data.timetable : [];
  const classTimetable = timetableList.filter(s =>
    s.className === selectedTimetableClass ||
    s.className?.includes(selectedTimetableClass) ||
    selectedTimetableClass?.includes(s.className)
  );

  const handleSaveSlotSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!slotForm.subject?.trim()) return;

    setIsSavingSlot(true);
    const targetClass = slotForm.className || selectedTimetableClass;
    const slotPayload = {
      ...slotForm,
      id: slotForm.id || `TT-${targetClass.replace(/\s+/g, '')}-${slotForm.day.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      className: targetClass
    };

    try {
      if (onSaveTimetableSlot) {
        await onSaveTimetableSlot(slotPayload);
      }
      setShowAddSlotModal(false);
      setEditingSlot(null);
      setTimetableFeedback(`Timetable period for ${slotPayload.subject} (${slotPayload.day}) saved successfully!`);
      setModalFeedback({
        isOpen: true,
        title: 'Timetable Period Saved!',
        message: `${slotPayload.subject} scheduled for ${targetClass} on ${slotPayload.day} (${slotPayload.time || slotPayload.period}).`,
        type: 'success'
      });
      setTimeout(() => setTimetableFeedback(''), 4500);
    } catch (err) {
      console.error('Failed to save timetable slot:', err);
    } finally {
      setIsSavingSlot(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this period slot from the timetable?')) return;
    try {
      if (onDeleteTimetableSlot) {
        await onDeleteTimetableSlot(slotId);
      }
      setTimetableFeedback('Period slot removed from schedule.');
      setModalFeedback({
        isOpen: true,
        title: 'Period Slot Deleted',
        message: 'The selected subject period slot has been removed from the class schedule.',
        type: 'delete'
      });
      setTimeout(() => setTimetableFeedback(''), 3500);
    } catch (err) {
      console.error('Failed to delete timetable slot:', err);
    }
  };

  const handleResetTimetableForClass = (className) => {
    if (!window.confirm(`Reset timetable for ${className} to the official standard Lagos State curriculum template?`)) return;
    if (onResetClassTimetable) {
      onResetClassTimetable(className);
      setTimetableFeedback(`Timetable for ${className} reset to standard school template!`);
      setModalFeedback({
        isOpen: true,
        title: 'Timetable Schedule Reset',
        message: `Class timetable for ${className} has been restored to standard curriculum template.`,
        type: 'delete'
      });
      setTimeout(() => setTimetableFeedback(''), 4500);
    }
  };

  const handleClassAssignmentChange = (teacher, selectedClass) => {
    const classVal = selectedClass === 'None (Subject Teacher Only)' || selectedClass === 'None' ? null : selectedClass;
    if (onUpdateStaff) {
      onUpdateStaff(teacher.email || teacher.staffId || teacher.id, {
        classAssigned: classVal,
        isClassTeacher: Boolean(classVal)
      });
    }
    const feedbackText = classVal
      ? `Teacher ${teacher.name} assigned as Class Teacher for ${classVal}!`
      : `Teacher ${teacher.name} updated to Subject Specialist (Non-Class Teacher)!`;
    setStaffUpdateFeedback(feedbackText);
    setModalFeedback({
      isOpen: true,
      title: 'Teacher Allocation Updated!',
      message: feedbackText,
      type: 'success'
    });
    setTimeout(() => setStaffUpdateFeedback(''), 4500);
  };

  const handleCreateStaffSubmit = async (e) => {
    e.preventDefault();
    if (!newStaffForm.name || !newStaffForm.email) return;

    const classVal = newStaffForm.classAssigned === 'None' || newStaffForm.classAssigned === 'None (Subject Teacher Only)'
      ? null
      : newStaffForm.classAssigned;

    const newStaffObj = {
      staffId: `STF/2026/00${staffList.length + 1}`,
      name: newStaffForm.name,
      email: newStaffForm.email,
      phone: newStaffForm.phone || '08134000644',
      role: newStaffForm.role,
      department: newStaffForm.department,
      password: '1234',
      isClassTeacher: Boolean(classVal),
      classAssigned: classVal,
      subjectsTaught: [
        { subjectName: newStaffForm.subject, className: classVal || 'JSS 1 - Arm A' }
      ]
    };

    setIsAddingStaff(true);
    try {
      if (onAddStaff) {
        await onAddStaff(newStaffObj);
      }
      setShowAddStaffModal(false);
      setNewStaffForm({
        name: '',
        email: '',
        phone: '',
        department: 'Sciences & Technology',
        role: 'Teacher',
        subject: 'Physics',
        classAssigned: 'None',
      });
      setStaffUpdateFeedback(`Staff member ${newStaffObj.name} successfully onboarded!`);
      setModalFeedback({
        isOpen: true,
        title: 'Teacher Onboarded Successfully!',
        message: `${newStaffObj.name} (${newStaffObj.staffId}) has been added with email ${newStaffObj.email}.`,
        type: 'success'
      });
      setTimeout(() => setStaffUpdateFeedback(''), 4500);
    } catch (err) {
      console.error('Error onboarding staff member:', err);
    } finally {
      setIsAddingStaff(false);
    }
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setIsBroadcastingNotice(true);
    try {
      if (onAddAnnouncement) {
        await onAddAnnouncement({
          id: `ANN-${Math.floor(10 + Math.random() * 90)}`,
          title: newNotice.title,
          author: 'Principal / Admin Office',
          date: new Date().toISOString().split('T')[0],
          content: newNotice.content,
        });
      }
      const titleSaved = newNotice.title;
      setNewNotice({ title: '', content: '' });
      setNoticeMsg('Announcement broadcasted to all students, parents, and teachers!');
      setModalFeedback({
        isOpen: true,
        title: 'Announcement Broadcasted!',
        message: `"${titleSaved}" is now live on the Student, Teacher, and Staff portals.`,
        type: 'success'
      });
      setTimeout(() => setNoticeMsg(''), 4000);
    } catch (err) {
      console.error('Error broadcasting announcement:', err);
    } finally {
      setIsBroadcastingNotice(false);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setIsEnrollingStudent(true);
    const nextNum = studentsList.length + 1;
    const newId = `NSHS/2026/00${nextNum}`;
    const fullName = `${studentForm.surname.toUpperCase()} ${studentForm.firstName} ${studentForm.middleName}`.trim();
    const isJSS = studentForm.entryClass.startsWith('JSS');
    const termFee = isJSS ? '₦95,000' : '₦125,000';
    const assignedPin = studentForm.portalPin || generateRandomPin();

    const newStudentData = {
      id: newId,
      name: fullName,
      gender: studentForm.gender,
      dob: studentForm.dob,
      ninOrLasrra: studentForm.ninOrLasrra,
      stateOfOrigin: studentForm.stateOfOrigin,
      lga: studentForm.lga,
      nationality: studentForm.nationality,
      bloodGroup: studentForm.bloodGroup,
      genotype: studentForm.genotype,
      religion: studentForm.religion,
      admissionCriteria: 'Internal Entrance Examination',
      entranceExamScore: studentForm.entranceExamScore,
      priorClass: studentForm.priorClass,
      class: `${studentForm.entryClass} - ${studentForm.classArm}`,
      entryClass: studentForm.entryClass,
      classArm: studentForm.classArm,
      academicTrack: studentForm.academicTrack,
      house: studentForm.house,
      boardingStatus: 'Day Student',
      previousSchool: studentForm.previousSchool,
      medicalConditions: studentForm.medicalConditions,
      guardian: `${studentForm.guardianName} (${studentForm.guardianRelationship})`,
      guardianName: studentForm.guardianName,
      guardianRelationship: studentForm.guardianRelationship,
      guardianPhone: studentForm.guardianPhone,
      guardianEmail: studentForm.guardianEmail,
      fatherOccupation: studentForm.fatherOccupation,
      motherName: studentForm.motherName,
      motherOccupation: studentForm.motherOccupation,
      motherPhone: studentForm.motherPhone,
      guardianAddress: studentForm.guardianAddress,
      emergencyContact: `${studentForm.emergencyContact || studentForm.guardianName} (${studentForm.emergencyPhone || studentForm.guardianPhone})`,
      whatsappAlertsEnabled: studentForm.whatsappAlertsEnabled,
      feeStatus: studentForm.feeStatus,
      feeAmount: termFee,
      paidAmount: studentForm.feeStatus === 'Approved' ? termFee : (studentForm.initialDeposit ? `₦${Number(studentForm.initialDeposit).toLocaleString()}` : '₦0'),
      password: assignedPin,
      admissionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    try {
      if (onAddStudent) {
        await onAddStudent(newStudentData);
      }
      setRegisteredStudentSlip(newStudentData);

      // If enrolling an existing online application, update its status
      if (selectedApplicationForReview && onUpdateApplication) {
        await onUpdateApplication(selectedApplicationForReview.applicationId || selectedApplicationForReview.id, 'Accepted & Enrolled');
      }
      setModalFeedback({
        isOpen: true,
        title: 'Student Enrolled Successfully!',
        message: `Admission recorded for ${newStudentData.name} (${newStudentData.id}) into ${newStudentData.class} with Portal PIN ${newStudentData.password}.`,
        type: 'success'
      });
    } catch (err) {
      console.error('Error adding student:', err);
    } finally {
      setIsEnrollingStudent(false);
    }
  };

  const handleReviewAndEnroll = (app) => {
    setSelectedApplicationForReview(app);
    const nameParts = (app.studentName || '').trim().split(' ');
    const surname = nameParts[nameParts.length - 1] || '';
    const firstName = nameParts[0] || '';
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
    const isJSS = (app.classApplyingFor || 'JSS 1').startsWith('JSS');
    const track = app.classApplyingFor?.includes('Science') ? 'Science & Technology' :
                  app.classApplyingFor?.includes('Commercial') ? 'Business & Commercial' :
                  app.classApplyingFor?.includes('Arts') ? 'Arts & Humanities' : 'Junior Secondary Foundation';

    setStudentForm((prev) => ({
      ...prev,
      surname,
      firstName,
      middleName,
      gender: app.gender || 'Male',
      dob: app.dob || '2010-05-15',
      priorClass: app.currentClass || 'Primary 6',
      entryClass: app.classApplyingFor || 'JSS 1',
      academicTrack: track,
      guardianName: app.guardianName || app.fatherName || app.motherName || '',
      guardianRelationship: app.guardianRelationship || 'Father',
      guardianPhone: app.primaryPhone || '',
      guardianEmail: app.email || '',
      guardianAddress: app.address || 'Mushin / Lagos, Nigeria',
      previousSchool: app.previousSchool || '',
      medicalConditions: app.medicalConditions || 'None',
      entranceExamScore: '85%',
      portalPin: generateRandomPin(),
    }));

    setActiveAdminTab('register');
    setRegisteredStudentSlip(null);
  };

  const handleDeclineApplication = (app) => {
    const appId = app?.applicationId || app?.id || app?._id || (typeof app === 'string' ? app : null);
    if (appId && onUpdateApplication) {
      onUpdateApplication(appId, 'Declined');
      alertFeedback(`Application for ${app?.studentName || 'Applicant'} has been declined.`);
    }
  };

  const handleCopyPin = (pinText) => {
    navigator.clipboard.writeText(pinText);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  const resetForm = () => {
    setRegisteredStudentSlip(null);
    setCopiedPin(false);
    setSelectedApplicationForReview(null);
    setStudentForm({
      surname: '',
      firstName: '',
      middleName: '',
      gender: 'Male',
      dob: '2010-05-15',
      ninOrLasrra: '',
      stateOfOrigin: 'Lagos',
      lga: 'Mushin',
      nationality: 'Nigerian',
      bloodGroup: 'O+',
      genotype: 'AA',
      religion: 'Christianity',
      admissionCriteria: 'Internal Entrance Examination',
      entranceExamScore: '84%',
      priorClass: 'Primary 6',
      entryClass: 'JSS 1',
      classArm: 'Arm A',
      academicTrack: 'Junior Secondary Foundation',
      house: 'Red House (Tiger)',
      boardingStatus: 'Day Student',
      previousSchool: '',
      medicalConditions: 'None',
      guardianName: '',
      guardianRelationship: 'Father',
      guardianPhone: '',
      guardianEmail: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      motherPhone: '',
      guardianAddress: '',
      emergencyContact: '',
      emergencyPhone: '',
      whatsappAlertsEnabled: true,
      feeStatus: 'Unpaid',
      initialDeposit: '0',
      portalPin: generateRandomPin(),
    });
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingSession(true);
    try {
      if (onUpdateSessionInfo) {
        await onUpdateSessionInfo(sessionForm);
      }
      setSessionFeedback(`Academic Session (${sessionForm.currentSession}) and ${sessionForm.currentTerm} successfully set and broadcasted across all student & teacher portals!`);
      setTimeout(() => setSessionFeedback(''), 5500);
    } catch (err) {
      console.error('Failed to update session settings:', err);
    } finally {
      setIsUpdatingSession(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Admin Summary Bar & Tab Navigation */}
      <div className="p-3.5 sm:p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4 print:hidden">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#1B2521] tracking-tight">Principal & Registrar Control Center</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-green-primary text-[10px] sm:text-xs font-extrabold border border-emerald-200 shadow-xs">
                Admin Level 1
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
              Manage incoming online applications, central student registry, teacher allocations, session terms, and broadcast notices.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full lg:w-auto">
            {/* Quick Export Actions for Principal & Bursary */}
            <div className="flex flex-wrap items-center gap-1.5 bg-emerald-50/80 p-1.5 rounded-2xl border border-emerald-200 w-full sm:w-auto">
              <span className="text-[11px] font-black text-[#06452C] px-1 flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export:</span>
              </span>
              <button
                onClick={exportStudentsCSV}
                title="Download full student enrollment list to Excel/CSV"
                className="flex-1 sm:flex-initial px-2 py-1 rounded-lg bg-white hover:bg-[#06452C] hover:text-white text-[#06452C] text-[11px] font-bold border border-emerald-200 shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                <Download className="w-3 h-3" />
                <span>Students ({studentsList.length})</span>
              </button>
              <button
                onClick={exportStaffCSV}
                title="Download teachers & staff directory to Excel/CSV"
                className="flex-1 sm:flex-initial px-2 py-1 rounded-lg bg-white hover:bg-[#06452C] hover:text-white text-[#06452C] text-[11px] font-bold border border-emerald-200 shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                <Download className="w-3 h-3" />
                <span>Staff ({staffList.length})</span>
              </button>
              <button
                onClick={exportApplicationsCSV}
                title="Download incoming admission applicants list to Excel/CSV"
                className="flex-1 sm:flex-initial px-2 py-1 rounded-lg bg-white hover:bg-[#06452C] hover:text-white text-[#06452C] text-[11px] font-bold border border-emerald-200 shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                <Download className="w-3 h-3" />
                <span>Applicants ({applicationsList.length})</span>
              </button>
            </div>

            {/* Direct Interactive Session & Present Term Selector for Admin */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F0F7F4] p-1.5 rounded-2xl border border-emerald-300/80 shadow-xs w-full sm:w-auto">
              <div className="flex items-center gap-1 px-1 text-[#06452C] font-black text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Active:</span>
              </div>

              {/* School Year Dropdown */}
              <select
                value={sessionForm.currentSession}
                onChange={async (e) => {
                  const val = e.target.value;
                  if (val === '__CREATE_NEW__') {
                    setShowNewSessionModal(true);
                    return;
                  }
                  const updated = { ...sessionForm, currentSession: val };
                  setSessionForm(updated);
                  if (onUpdateSessionInfo) {
                    await onUpdateSessionInfo(updated);
                  }
                  setSessionFeedback(`Academic Session switched to ${val} school-wide!`);
                  setTimeout(() => setSessionFeedback(''), 4000);
                }}
                className="flex-1 sm:flex-initial py-1 px-2 rounded-xl border border-emerald-300 bg-white text-xs font-black text-[#06452C] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
                title="Select Academic School Year"
              >
                {(Array.isArray(availableSessions) ? availableSessions : defaultAvailableSessions).map((sess) => (
                  <option key={sess} value={sess}>
                    {sess}
                  </option>
                ))}
                <option value="__CREATE_NEW__">+ Create New Year...</option>
              </select>

              {/* Present Term Dropdown */}
              <select
                value={sessionForm.currentTerm}
                onChange={async (e) => {
                  const val = e.target.value;
                  const updated = { ...sessionForm, currentTerm: val };
                  setSessionForm(updated);
                  if (onUpdateSessionInfo) {
                    await onUpdateSessionInfo(updated);
                  }
                  setSessionFeedback(`Present Active Term set to ${val} school-wide!`);
                  setTimeout(() => setSessionFeedback(''), 4000);
                }}
                className="flex-1 sm:flex-initial py-1 px-2 rounded-xl border border-emerald-300 bg-white text-xs font-black text-[#06452C] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
                title="Select Present Active Term"
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
              </select>

              <button
                type="button"
                onClick={() => setShowNewSessionModal(true)}
                title="Create brand new academic school year"
                className="px-2.5 py-1 rounded-xl bg-[#06452C] hover:bg-[#0B5D3B] text-white text-xs font-black flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="inline">New Year</span>
              </button>
            </div>
          </div>
        </div>

        {sessionFeedback && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#06452C] flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{sessionFeedback}</span>
          </div>
        )}

        {/* Full-Width Tab Grid Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {/* 1. Online Applications */}
          <button
            onClick={() => { setActiveAdminTab('applications'); setRegisteredStudentSlip(null); }}
            className={`p-2.5 sm:p-3 rounded-2xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-between gap-1.5 border ${
              activeAdminTab === 'applications'
                ? 'bg-green-primary text-white border-green-primary shadow-md'
                : 'bg-[#FAFCFA] text-gray-700 hover:bg-gray-100 hover:text-[#1B2521] border-gray-200/80'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Inbox className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Applications</span>
            </div>
            {pendingAppsCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex-shrink-0 leading-none ${
                activeAdminTab === 'applications' ? 'bg-amber-400 text-emerald-950' : 'bg-red-500 text-white'
              }`}>
                {pendingAppsCount}
              </span>
            )}
          </button>

          {/* 2. Student Registry */}
          <button
            onClick={() => { setActiveAdminTab('database'); setRegisteredStudentSlip(null); }}
            className={`p-2.5 sm:p-3 rounded-2xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-between gap-1.5 border ${
              activeAdminTab === 'database'
                ? 'bg-green-primary text-white border-green-primary shadow-md'
                : 'bg-[#FAFCFA] text-gray-700 hover:bg-gray-100 hover:text-[#1B2521] border-gray-200/80'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Database className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Registry</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex-shrink-0 leading-none ${
              activeAdminTab === 'database' ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {studentsList.length}
            </span>
          </button>

          {/* 3. Admissions & Enrollment */}
          <button
            onClick={() => { setActiveAdminTab('register'); setSelectedApplicationForReview(null); }}
            className={`p-2.5 sm:p-3 rounded-2xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 border ${
              activeAdminTab === 'register'
                ? 'bg-green-primary text-white border-green-primary shadow-md'
                : 'bg-[#FAFCFA] text-gray-700 hover:bg-gray-100 hover:text-[#1B2521] border-gray-200/80'
            }`}
          >
            <UserPlus className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Admissions Form</span>
          </button>

          {/* 4. Teachers & Staff */}
          <button
            onClick={() => { setActiveAdminTab('staff'); setRegisteredStudentSlip(null); }}
            className={`p-2.5 sm:p-3 rounded-2xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-between gap-1.5 border ${
              activeAdminTab === 'staff'
                ? 'bg-green-primary text-white border-green-primary shadow-md'
                : 'bg-[#FAFCFA] text-gray-700 hover:bg-gray-100 hover:text-[#1B2521] border-gray-200/80'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Staff Directory</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex-shrink-0 leading-none ${
              activeAdminTab === 'staff' ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {staffList.length}
            </span>
          </button>

          {/* 5. Timetable & Schedules */}
          <button
            onClick={() => { setActiveAdminTab('timetable'); setRegisteredStudentSlip(null); }}
            className={`p-2.5 sm:p-3 rounded-2xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-between gap-1.5 border ${
              activeAdminTab === 'timetable'
                ? 'bg-green-primary text-white border-green-primary shadow-md'
                : 'bg-[#FAFCFA] text-gray-700 hover:bg-gray-100 hover:text-[#1B2521] border-gray-200/80'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <CalendarDays className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Timetable</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex-shrink-0 leading-none ${
              activeAdminTab === 'timetable' ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {classTimetable.length}
            </span>
          </button>

          {/* 6. Broadcast Notices */}
          <button
            onClick={() => { setActiveAdminTab('announcements'); setRegisteredStudentSlip(null); }}
            className={`p-2.5 sm:p-3 rounded-2xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 border ${
              activeAdminTab === 'announcements'
                ? 'bg-green-primary text-white border-green-primary shadow-md'
                : 'bg-[#FAFCFA] text-gray-700 hover:bg-gray-100 hover:text-[#1B2521] border-gray-200/80'
            }`}
          >
            <Megaphone className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">School Notices</span>
          </button>

          {/* 7. Academic Session & Term Control */}
          <button
            onClick={() => { setActiveAdminTab('session'); setRegisteredStudentSlip(null); }}
            className={`p-2.5 sm:p-3 rounded-2xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 border ${
              activeAdminTab === 'session'
                ? 'bg-green-primary text-white border-green-primary shadow-md'
                : 'bg-[#FAFCFA] text-gray-700 hover:bg-gray-100 hover:text-[#1B2521] border-gray-200/80'
            }`}
          >
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Session & Term</span>
          </button>
        </div>
      </div>

      {/* ================= 1. ONLINE ADMISSIONS APPLICATIONS TAB ================= */}
      {activeAdminTab === 'applications' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-lg text-[#1B2521]">Prospective Student Online Applications</h3>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                  {pendingAppsCount} Pending Review
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Incoming candidate admission forms submitted on the public website. Click "Review & Enroll" to admit student.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search applicant, class, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-primary w-full bg-[#FAFCFA] font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/90 text-gray-600 font-bold border-b border-gray-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 whitespace-nowrap">App Reference</th>
                  <th className="py-3.5 px-4">Applicant Full Name</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Class Applying For</th>
                  <th className="py-3.5 px-4">Prior Class & School</th>
                  <th className="py-3.5 px-4">Primary Guardian Contact</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Date Applied</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-400 italic">
                      No online student applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app?.applicationId || app?.id || Math.random()} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-green-primary whitespace-nowrap">
                        {app?.applicationId || app?.id || 'APP-2026'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-[#1B2521] uppercase text-xs tracking-tight">
                          {app?.studentName || app?.name || 'Applicant'}
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium mt-0.5">
                          {app?.gender || 'Male'} · DOB: {app?.dob || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-block font-extrabold text-[#06452C] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 text-xs">
                          {app?.classApplyingFor || app?.class || 'JSS 1'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        <div className="font-bold text-[#1B2521] text-xs leading-snug">{app?.currentClass || 'Primary 6'}</div>
                        <div className="text-[11px] text-gray-400 truncate max-w-[160px] leading-snug mt-0.5">{app?.previousSchool || 'Crown Primary'}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        <div className="font-bold text-[#1B2521] text-xs leading-snug">{app?.guardianName || app?.fatherName || app?.guardian || 'Guardian'}</div>
                        <div className="text-[11px] text-green-primary font-mono font-bold leading-snug mt-0.5">{app?.primaryPhone || app?.phone || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                        {app?.dateSubmitted || '2026-08-20'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                          app?.status === 'Accepted & Enrolled' ? 'bg-green-100 text-green-800' :
                          app?.status === 'Declined' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {app?.status || 'Pending Review'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                        {app?.status === 'Accepted & Enrolled' ? (
                          <span className="text-xs font-bold text-green-primary inline-flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                          </span>
                        ) : app?.status === 'Declined' ? (
                          <div className="inline-flex gap-2 items-center">
                            <span className="text-xs font-bold text-red-600 inline-flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                              <XCircle className="w-3.5 h-3.5" /> Declined
                            </span>
                            <button
                              type="button"
                              onClick={() => handleReviewAndEnroll(app)}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#06452C] font-bold text-[11px] transition-all cursor-pointer"
                              title="Re-open and enroll applicant"
                            >
                              Re-open & Enroll
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex gap-2 items-center">
                            <button
                              type="button"
                              onClick={() => handleReviewAndEnroll(app)}
                              className="px-3.5 py-2 rounded-xl bg-green-primary hover:bg-green-dark text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                              <span>Review & Enroll</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeclineApplication(app)}
                              className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                              title="Decline Application"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 2. CENTRAL STUDENT REGISTRY DATABASE ================= */}
      {activeAdminTab === 'database' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-[#1B2521]">Central Student Archive & Registry</h3>
              <p className="text-xs text-gray-500">Live search across student names, admission numbers, classes, and guardian contacts</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, ID, class, guardian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-primary w-full bg-[#FAFCFA] font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/90 text-gray-600 font-bold border-b border-gray-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 whitespace-nowrap">Admission ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Class & Arm</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">House Allocation</th>
                  <th className="py-3.5 px-4">Primary Guardian Contact</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Tuition Status</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Student Portal PIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400 italic">
                      No student records match your query.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s?.id || Math.random()} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-green-primary whitespace-nowrap">{s?.id || 'NSHS/2026/001'}</td>
                      <td className="py-4 px-4 font-extrabold text-[#1B2521] text-xs">{s?.name || 'Student'}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-bold text-gray-800 text-xs">{s?.class || 'JSS 1'}</span>
                        {s?.academicTrack && <span className="block text-[11px] text-gray-400 font-medium">{s.academicTrack}</span>}
                      </td>
                      <td className="py-4 px-4 text-gray-700 font-medium whitespace-nowrap">{s?.house || 'Red House'}</td>
                      <td className="py-4 px-4 text-gray-600">
                        <div className="font-bold text-[#1B2521] text-xs leading-snug">{s?.guardian || 'Guardian'}</div>
                        <div className="text-[11px] text-gray-400 font-mono leading-snug mt-0.5">{s?.guardianPhone || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                          s?.feeStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                          s?.feeStatus === 'Pending' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {s?.feeStatus || 'Unpaid'} ({s?.feeAmount || '₦0'})
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-xs bg-emerald-50 text-green-primary px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm inline-block">
                          {s?.password || '1234'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 3. INTRICATE NEW STUDENT ADMISSIONS DOSSIER ================= */}
      {activeAdminTab === 'register' && (
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          {registeredStudentSlip ? (
            /* ================= EXECUTIVE PROFESSIONAL OFFICIAL ADMISSION LETTER & SLIP ================= */
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Screen-Only Control Toolbar */}
              <div className="print:hidden p-4 rounded-2xl bg-emerald-900 text-white flex flex-col sm:flex-row justify-between items-center gap-3 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center border border-emerald-400/40">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white">Student Successfully Enrolled!</h4>
                    <p className="text-[11px] text-emerald-200">Official Admission Letter ready for physical printing or PDF download</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => printDocument('printable-admission-slip', `${registeredStudentSlip?.name || 'Student'} - Official Admission Letter`)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs transition-all flex items-center gap-2 shadow-sm active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Official Letter (PDF)</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                  >
                    + Register Another
                  </button>
                  <button
                    onClick={() => { setActiveAdminTab('applications'); setRegisteredStudentSlip(null); }}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                  >
                    View Applications →
                  </button>
                </div>
              </div>

              {/* ================= PRINTABLE OFFICIAL LETTERHEAD DOCUMENT ================= */}
              <div id="printable-admission-slip" className="bg-[#FCFCFA] rounded-2xl p-6 sm:p-10 border-2 border-emerald-900/40 shadow-xl relative overflow-hidden text-[#1B2521] print:border-0 print:shadow-none print:p-0 print:bg-white print:m-0">
                
                {/* Official Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                  <span className="font-serif font-black text-8xl sm:text-9xl text-emerald-950 rotate-[-30deg] tracking-widest uppercase">
                    NEW STATE
                  </span>
                </div>

                {/* 1. Official Nigerian School Crest Header */}
                <div className="border-b-2 border-[#06452C] pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-10">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 p-2 bg-emerald-50 rounded-2xl border-2 border-emerald-300/80 flex-shrink-0 flex items-center justify-center shadow-sm">
                    <img src="/school-logo.png" alt="School Crest Logo" className="w-full h-full object-contain" />
                  </div>

                  <div className="flex-grow space-y-1">
                    <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#06452C]">
                      Lagos State Ministry of Basic & Secondary Education
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#06452C] tracking-tight uppercase leading-none font-serif">
                      NEW STATE HIGH SCHOOL
                    </h1>
                    <div className="text-xs font-black text-[#1B2521] tracking-wide">
                      MOTTO: <span className="text-[#06452C] italic">DOMINE DIRIGE NOS</span> (LORD DIRECT US)
                    </div>
                    <p className="text-[11px] text-gray-600 leading-tight">
                      36 Palm Avenue, Mushin, Lagos State, Nigeria · Tel: +234 813 400 0644 · Email: info@newstateschools.org
                    </p>
                    <div className="inline-flex items-center gap-2 pt-0.5 text-[10px] font-extrabold text-[#06452C] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      <span>Govt. Approved Comprehensive Secondary School</span>
                      <span>•</span>
                      <span>WAEC & NECO Center No: 0481903</span>
                    </div>
                  </div>

                  <div className="text-center sm:text-right flex-shrink-0 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-4 space-y-1">
                    <span className="inline-block px-3 py-1 bg-[#06452C] text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-sm">
                      OFFICIAL ADMISSION SLIP
                    </span>
                    <div className="text-xs font-mono font-black text-green-primary">{registeredStudentSlip.id}</div>
                    <div className="text-[10px] text-gray-500 font-bold">Session: 2026/2027</div>
                    <div className="text-[10px] text-gray-500">{registeredStudentSlip.admissionDate || 'August 20, 2026'}</div>
                  </div>
                </div>

                {/* 2. Official Provisional Admission Title & Formal Salutation */}
                <div className="mt-5 space-y-2 relative z-10">
                  <div className="text-center py-2 px-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <h2 className="text-sm sm:text-base font-black text-[#06452C] uppercase tracking-wider font-serif">
                      PROVISIONAL LETTER OF ADMISSION & ENROLMENT DOSSIER
                    </h2>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed pt-1">
                    This is to officially certify that upon satisfactory performance in the <strong className="text-[#06452C]">New State High School Internal Entrance Screening Examination</strong>, the candidate named below has been offered provisional admission into New State High School for the <strong className="text-[#06452C]">2026/2027 Academic Session</strong>.
                  </p>
                </div>

                {/* 3. Comprehensive Official 4-Quadrant Data Grid */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs relative z-10">
                  
                  {/* Quadrant 1: Candidate Identity */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-[#06452C] font-black text-[11px] uppercase tracking-wider pb-1 border-b border-gray-100">
                      <User className="w-3.5 h-3.5" />
                      <span>1. Candidate Bio-Data & Identity</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Full Legal Name</span>
                        <span className="font-black text-[#1B2521] text-xs uppercase">{registeredStudentSlip.name}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Admission Number</span>
                        <span className="font-mono font-black text-green-primary text-xs">{registeredStudentSlip.id}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Gender & DOB</span>
                        <span className="font-semibold text-gray-800">{registeredStudentSlip.gender} · {registeredStudentSlip.dob}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">State & LGA</span>
                        <span className="font-semibold text-gray-800">{registeredStudentSlip.stateOfOrigin} State ({registeredStudentSlip.lga})</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Blood Group & Genotype</span>
                        <span className="font-bold text-gray-800">{registeredStudentSlip.bloodGroup} · {registeredStudentSlip.genotype}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">National / State ID</span>
                        <span className="font-semibold text-gray-700">{registeredStudentSlip.ninOrLasrra || 'Verified On File'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quadrant 2: Academic Placement & Program */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-[#06452C] font-black text-[11px] uppercase tracking-wider pb-1 border-b border-gray-100">
                      <Award className="w-3.5 h-3.5" />
                      <span>2. Academic Stream & Placement</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Admitted Entry Class</span>
                        <span className="font-extrabold text-[#06452C] text-xs">{registeredStudentSlip.class}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Prior Class Passed</span>
                        <span className="font-bold text-gray-800">{registeredStudentSlip.priorClass || 'Primary 6'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Internal Screening Score</span>
                        <span className="font-black text-green-primary">{registeredStudentSlip.entranceExamScore || '84% (Merit Pass)'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Academic Track</span>
                        <span className="font-semibold text-gray-800">{registeredStudentSlip.academicTrack || 'General Foundation'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Allocated House</span>
                        <span className="font-bold text-gray-800">{registeredStudentSlip.house}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">School Attendance Mode</span>
                        <span className="font-black text-[#06452C]">Day Student Only</span>
                      </div>
                    </div>
                  </div>

                  {/* Quadrant 3: Parent & Guardian Details */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-[#06452C] font-black text-[11px] uppercase tracking-wider pb-1 border-b border-gray-100">
                      <Phone className="w-3.5 h-3.5" />
                      <span>3. Primary Guardian & Emergency Records</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="col-span-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Primary Guardian Name</span>
                        <span className="font-black text-[#1B2521] text-xs">{registeredStudentSlip.guardian}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Guardian Phone (WhatsApp)</span>
                        <span className="font-bold text-gray-800">{registeredStudentSlip.guardianPhone}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">WhatsApp SMS Alerts</span>
                        <span className="font-bold text-emerald-700">✓ Active Dispatch</span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Residential Address</span>
                        <span className="font-medium text-gray-700">{registeredStudentSlip.guardianAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quadrant 4: Tuition & Bursar Clearance */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-[#06452C] font-black text-[11px] uppercase tracking-wider pb-1 border-b border-gray-100">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>4. Tuition Assessment & Bursary Setup</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Prescribed Term Tuition</span>
                        <span className="font-black text-[#06452C] text-xs">{registeredStudentSlip.feeAmount}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Initial Payment Status</span>
                        <span className={`font-black inline-block px-2 py-0.5 rounded text-[10px] ${
                          registeredStudentSlip.feeStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                          registeredStudentSlip.feeStatus === 'Pending' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {registeredStudentSlip.feeStatus}
                        </span>
                      </div>

                      <div className="col-span-2 text-[10px] text-gray-500 pt-1 leading-tight">
                        Bank transfers to be made to official Zenith Bank / First Bank school accounts with candidate's Admission ID as payment reference.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Secure Student Portal & CBT Credentials Voucher */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-[#06452C] text-white border-2 border-emerald-600/40 relative z-10 shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-300 font-black text-[10px] uppercase tracking-wider">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Confidential Student Portal & CBT Access Voucher</span>
                      </div>
                      <p className="text-xs text-emerald-100">
                        Use these credentials to log in for terminal report cards, lesson notes, and CBT assessments.
                      </p>
                      <div className="text-[10px] text-emerald-200 font-mono">
                        Portal URL: <span className="underline">https://newstatehighschool.web.app/portal</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20">
                      <div>
                        <span className="text-[9px] font-bold text-emerald-200 uppercase tracking-widest block">Portal PIN</span>
                        <span className="font-mono font-black text-xl text-white tracking-widest">
                          {registeredStudentSlip.password}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyPin(registeredStudentSlip.password)}
                        className="print:hidden px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-[11px] transition-all flex items-center gap-1 shadow-sm"
                      >
                        {copiedPin ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPin ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Institutional Endorsement, Signatures & Stamp */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300 grid grid-cols-3 gap-4 text-center items-end relative z-10">
                  {/* Registrar Signature */}
                  <div className="space-y-1 text-left">
                    <div className="font-serif italic font-black text-gray-800 text-sm border-b border-gray-400 pb-1 w-36">
                      S. O. Balogun
                    </div>
                    <div className="text-[10px] font-black text-[#06452C] uppercase">Registrar / Admissions</div>
                    <div className="text-[9px] text-gray-500">New State High School</div>
                  </div>

                  {/* Official Institutional Stamp */}
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-800 flex flex-col items-center justify-center text-center p-1 transform -rotate-6 text-[#06452C] bg-emerald-50/40">
                      <ShieldCheck className="w-4 h-4 text-[#06452C]" />
                      <span className="text-[8px] font-black tracking-tighter uppercase leading-none mt-0.5">NEW STATE HIGH SCHOOL</span>
                      <span className="text-[7px] font-bold text-red-700 tracking-widest my-0.5 font-mono">★ APPROVED ★</span>
                      <span className="text-[7px] font-extrabold uppercase leading-none">ADMISSIONS OFFICE</span>
                    </div>
                  </div>

                  {/* Principal Endorsement */}
                  <div className="space-y-1 text-right">
                    <div className="font-serif italic font-black text-gray-800 text-sm border-b border-gray-400 pb-1 w-36 ml-auto">
                      Dr. A. O. Adeleke
                    </div>
                    <div className="text-[10px] font-black text-[#06452C] uppercase">Principal / Director</div>
                    <div className="text-[9px] text-gray-500">Stamp & Official Signature</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Section Intricate Form */
            <form onSubmit={handleStudentSubmit} className="space-y-8">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 text-green-primary font-black text-xs uppercase tracking-widest">
                  <UserPlus className="w-4 h-4" />
                  <span>Student Admissions Dossier & Registry Form (Internal Entrance Standard)</span>
                </div>
                <h3 className="text-2xl font-black text-[#1B2521] mt-1">
                  {selectedApplicationForReview ? `Enroll Applicant: ${selectedApplicationForReview.studentName}` : 'Intricate Student Enrollment'}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedApplicationForReview ? 'Pre-filled from online admissions application. Set screening score and allocate class arm.' : 'Complete student personal bio-data, internal entrance exam scores, prior class, entry class, parental records, and medical profile.'}
                </p>
              </div>

              {/* SECTION 1: PERSONAL BIO-DATA */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <User className="w-4 h-4" />
                  <span>Section 1: Student Personal Bio-Data & Identity</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Surname (Last Name) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ADELEKE"
                      value={studentForm.surname}
                      onChange={(e) => setStudentForm({ ...studentForm, surname: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Oluwaseun"
                      value={studentForm.firstName}
                      onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Babatunde"
                      value={studentForm.middleName}
                      onChange={(e) => setStudentForm({ ...studentForm, middleName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Gender *</label>
                    <select
                      value={studentForm.gender}
                      onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={studentForm.dob}
                      onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">NIN / LASRRA / Birth Cert No.</label>
                    <input
                      type="text"
                      placeholder="e.g. NIN: 90218491028"
                      value={studentForm.ninOrLasrra}
                      onChange={(e) => setStudentForm({ ...studentForm, ninOrLasrra: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={studentForm.nationality}
                      onChange={(e) => setStudentForm({ ...studentForm, nationality: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">State of Origin *</label>
                    <select
                      value={studentForm.stateOfOrigin}
                      onChange={(e) => setStudentForm({ ...studentForm, stateOfOrigin: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      {nigerianStates.map((st) => (
                        <option key={st} value={st}>{st} State</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Local Govt. Area (LGA)</label>
                    <input
                      type="text"
                      placeholder="e.g. Mushin / Ikeja"
                      value={studentForm.lga}
                      onChange={(e) => setStudentForm({ ...studentForm, lga: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
                    <select
                      value={studentForm.bloodGroup}
                      onChange={(e) => setStudentForm({ ...studentForm, bloodGroup: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Genotype</label>
                    <select
                      value={studentForm.genotype}
                      onChange={(e) => setStudentForm({ ...studentForm, genotype: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      {['AA', 'AS', 'SS', 'AC'].map((gt) => (
                        <option key={gt} value={gt}>{gt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Religion / Faith</label>
                    <select
                      value={studentForm.religion}
                      onChange={(e) => setStudentForm({ ...studentForm, religion: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="Christianity">Christianity</option>
                      <option value="Islam">Islam</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Medical Conditions / Allergies</label>
                    <input
                      type="text"
                      placeholder="e.g. Asthmatic, Penicillin Allergy, None"
                      value={studentForm.medicalConditions}
                      onChange={(e) => setStudentForm({ ...studentForm, medicalConditions: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: INTERNAL ENTRANCE EXAM & ACADEMIC ALLOCATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <Award className="w-4 h-4" />
                  <span>Section 2: Internal Entrance Examination & Academic Class Allocation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Internal Entrance Screening Score (%) *</label>
                    <input
                      type="text"
                      placeholder="e.g. 84% / 100"
                      value={studentForm.entranceExamScore}
                      onChange={(e) => setStudentForm({ ...studentForm, entranceExamScore: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-green-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Previous School Attended</label>
                    <input
                      type="text"
                      placeholder="e.g. Crown Model Primary School, Palm Avenue"
                      value={studentForm.previousSchool}
                      onChange={(e) => setStudentForm({ ...studentForm, previousSchool: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Prior Class Passed *</label>
                    <select
                      value={studentForm.priorClass}
                      onChange={(e) => setStudentForm({ ...studentForm, priorClass: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                    >
                      <option value="Primary 6">Primary 6</option>
                      <option value="Primary 5">Primary 5</option>
                      <option value="Primary 4">Primary 4</option>
                      <option value="JSS 1">JSS 1</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 3">JSS 3</option>
                      <option value="SSS 1">SSS 1</option>
                      <option value="SSS 2">SSS 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Entry Class *</label>
                    <select
                      value={studentForm.entryClass}
                      onChange={(e) => {
                        const val = e.target.value;
                        const track = val.includes('Science') ? 'Science & Technology' :
                                      val.includes('Commercial') ? 'Business & Commercial' :
                                      val.includes('Arts') ? 'Arts & Humanities' : 'Junior Secondary Foundation';
                        setStudentForm({ ...studentForm, entryClass: val, academicTrack: track });
                      }}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                    >
                      <option value="JSS 1">JSS 1 (Junior Secondary)</option>
                      <option value="JSS 2">JSS 2 (Junior Secondary)</option>
                      <option value="JSS 3">JSS 3 (Junior Secondary)</option>
                      <option value="SSS 1 (Science)">SSS 1 (Science Track)</option>
                      <option value="SSS 1 (Arts)">SSS 1 (Arts Track)</option>
                      <option value="SSS 1 (Commercial)">SSS 1 (Commercial Track)</option>
                      <option value="SSS 2 (Science)">SSS 2 (Science Track)</option>
                      <option value="SSS 2 (Commercial)">SSS 2 (Commercial Track)</option>
                      <option value="SSS 3 (Science)">SSS 3 (Science Track - WAEC Prep)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Class Arm / Division *</label>
                    <select
                      value={studentForm.classArm}
                      onChange={(e) => setStudentForm({ ...studentForm, classArm: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                    >
                      <option value="Arm A">Arm A</option>
                      <option value="Arm B">Arm B</option>
                      <option value="Arm C">Arm C</option>
                      <option value="Arm D">Arm D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">House Allocation *</label>
                    <select
                      value={studentForm.house}
                      onChange={(e) => setStudentForm({ ...studentForm, house: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="Red House (Tiger)">Red House (Tiger) 🔴</option>
                      <option value="Blue House (Eagle)">Blue House (Eagle) 🔵</option>
                      <option value="Yellow House (Falcon)">Yellow House (Falcon) 🟡</option>
                      <option value="Green House (Palm)">Green House (Palm) 🟢</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Academic Track Stream</label>
                    <input
                      type="text"
                      readOnly
                      value={studentForm.academicTrack}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-600 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">School Attendance Mode</label>
                    <input
                      type="text"
                      readOnly
                      value="Day Student Only (Comprehensive)"
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-emerald-50 text-[#06452C] font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PARENT & GUARDIAN INFORMATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <Phone className="w-4 h-4" />
                  <span>Section 3: Parent & Primary Guardian Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Primary Guardian Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Babatunde Adeleke"
                      value={studentForm.guardianName}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Relationship *</label>
                    <select
                      value={studentForm.guardianRelationship}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianRelationship: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Uncle / Aunt">Uncle / Aunt</option>
                      <option value="Sponsor / Corporate">Sponsor / Corporate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Primary Phone (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0803 123 4567"
                      value={studentForm.guardianPhone}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Father's Occupation</label>
                    <input
                      type="text"
                      placeholder="e.g. Civil Servant, Engineer"
                      value={studentForm.fatherOccupation}
                      onChange={(e) => setStudentForm({ ...studentForm, fatherOccupation: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mother's Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Mrs. Folashade Adeleke"
                      value={studentForm.motherName}
                      onChange={(e) => setStudentForm({ ...studentForm, motherName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mother's Occupation</label>
                    <input
                      type="text"
                      placeholder="e.g. Business Executive, Nurse"
                      value={studentForm.motherOccupation}
                      onChange={(e) => setStudentForm({ ...studentForm, motherOccupation: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mother's Direct Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g. 0802 987 6543"
                      value={studentForm.motherPhone}
                      onChange={(e) => setStudentForm({ ...studentForm, motherPhone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Guardian Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. parent@gmail.com"
                      value={studentForm.guardianEmail}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianEmail: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Residential Address in Lagos *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 36 Palm Avenue, Mushin, Lagos State"
                      value={studentForm.guardianAddress}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianAddress: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                {/* WhatsApp Alert Opt-In Checkbox */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="whatsappAlerts"
                    checked={studentForm.whatsappAlertsEnabled}
                    onChange={(e) => setStudentForm({ ...studentForm, whatsappAlertsEnabled: e.target.checked })}
                    className="w-4 h-4 text-green-primary rounded focus:ring-green-primary"
                  />
                  <label htmlFor="whatsappAlerts" className="text-xs font-bold text-[#06452C] cursor-pointer">
                    Enable automated WhatsApp SMS fee receipts, daily attendance & terminal report alerts for this guardian.
                  </label>
                </div>
              </div>

              {/* SECTION 4: TUITION & RANDOM ALPHANUMERIC PIN SETUP */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-black text-xs text-[#06452C] uppercase tracking-wider pb-1 border-b border-gray-100">
                  <CreditCard className="w-4 h-4" />
                  <span>Section 4: Tuition Billing & Secure Alphanumeric PIN</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Term Tuition Rate</label>
                    <input
                      type="text"
                      readOnly
                      value={studentForm.entryClass.startsWith('JSS') ? '₦95,000 / Term' : '₦125,000 / Term'}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-emerald-50 text-green-primary font-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Initial Payment Status</label>
                    <select
                      value={studentForm.feeStatus}
                      onChange={(e) => setStudentForm({ ...studentForm, feeStatus: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                    >
                      <option value="Unpaid">Unpaid (Awaiting Bank Transfer)</option>
                      <option value="Pending">Pending Bursar Verification</option>
                      <option value="Approved">Fully Paid & Approved</option>
                    </select>
                  </div>

                  {/* Random Alphanumeric PIN Box with Regenerate Button */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-green-primary" />
                        Random Student PIN (Alphanumeric) *
                      </span>
                      <button
                        type="button"
                        onClick={() => setStudentForm({ ...studentForm, portalPin: generateRandomPin() })}
                        className="text-[10px] text-green-primary hover:underline font-extrabold flex items-center gap-0.5"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Re-roll PIN</span>
                      </button>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={studentForm.portalPin}
                        onChange={(e) => setStudentForm({ ...studentForm, portalPin: e.target.value.toUpperCase() })}
                        className="w-full p-3 rounded-xl border-2 border-emerald-300 text-sm bg-emerald-50/50 text-[#06452C] font-mono font-black tracking-widest uppercase focus:outline-none focus:border-green-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyPin(studentForm.portalPin)}
                        className="px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                        title="Copy PIN"
                      >
                        {copiedPin ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3.5 rounded-2xl border border-gray-300 text-[#1B2521] text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isEnrollingStudent}
                  className="px-6 sm:px-8 py-3.5 rounded-2xl bg-[#06452C] hover:bg-[#0B5D3B] text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer active:scale-95"
                >
                  {isEnrollingStudent ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Enrolling Student & Issuing Slip...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Enroll Student & Issue Admission Slip →</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ================= 4. TEACHERS & STAFF DIRECTORY & CLASS TEACHER ALLOCATION ================= */}
      {activeAdminTab === 'staff' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-[#1B2521]">Academic Staff & Teacher Allocations</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-green-primary text-xs font-black border border-green-primary/20">
                  {staffList.length} Teachers
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Designate Subject Teachers and assign Class Teachers to respective class arms.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search teacher, email, subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-primary w-full bg-[#FAFCFA] font-medium"
                />
              </div>

              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2.5 rounded-xl bg-green-primary hover:bg-green-dark text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-sm flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Teacher</span>
              </button>
            </div>
          </div>

          {staffUpdateFeedback && (
            <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-primary" />
              <span>{staffUpdateFeedback}</span>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-gray-200/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/90 text-gray-600 font-bold border-b border-gray-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 whitespace-nowrap">Staff ID</th>
                  <th className="py-3.5 px-4">Teacher Full Name</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Department</th>
                  <th className="py-3.5 px-4">Subjects Taught</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Class Teacher Assignment</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Access Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStaff.map((teacher) => (
                  <tr key={teacher?.staffId || teacher?.email || Math.random()} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-green-primary whitespace-nowrap">{teacher?.staffId || 'STF/2026/001'}</td>
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-[#1B2521] text-xs">{teacher?.name || 'Academic Staff'}</div>
                      <div className="text-[11px] text-gray-400 font-medium mt-0.5">{teacher?.email || 'staff@newstateschools.org'} · {teacher?.phone || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-700 whitespace-nowrap">{teacher?.department || 'Academics'}</td>
                    <td className="py-4 px-4">
                      {teacher?.subjectsTaught && Array.isArray(teacher.subjectsTaught) && teacher.subjectsTaught.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {teacher.subjectsTaught.map((st, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-[11px] font-semibold border border-gray-200">
                              {st?.subjectName || st} ({st?.className || 'Class'})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">General Subject Teacher</span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={teacher?.classAssigned || 'None (Subject Teacher Only)'}
                        onChange={(e) => handleClassAssignmentChange(teacher, e.target.value)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all focus:outline-none ${
                          teacher?.classAssigned
                            ? 'bg-emerald-50 text-[#06452C] border-emerald-300 shadow-sm'
                            : 'bg-[#FAFCFA] text-gray-700 border-gray-200'
                        }`}
                      >
                        {availableClassArms.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-black">
                        Active Teacher
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Staff Modal */}
          {showAddStaffModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-black text-lg text-[#1B2521]">Add New Academic Teacher</h3>
                    <p className="text-xs text-gray-500">Create login credentials and assign subjects</p>
                  </div>
                  <button
                    onClick={() => setShowAddStaffModal(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateStaffSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Teacher Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mr. Emmanuel Balogun"
                      value={newStaffForm.name}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Address (Login Username) *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. e.balogun@newstateschools.org"
                      value={newStaffForm.email}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Primary Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0803 123 4567"
                      value={newStaffForm.phone}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Department</label>
                      <select
                        value={newStaffForm.department}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                      >
                        <option value="Sciences & Technology">Sciences & Technology</option>
                        <option value="Languages & Arts">Languages & Arts</option>
                        <option value="Commercial Studies">Commercial Studies</option>
                        <option value="ICT & AI Coding">ICT & AI Coding</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Primary Subject</label>
                      <select
                        value={newStaffForm.subject}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, subject: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="English Language">English Language</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Computer Studies (AI & Coding)">Computer Studies</option>
                        <option value="Economics">Economics</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Assign as Class Teacher?</label>
                    <select
                      value={newStaffForm.classAssigned}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, classAssigned: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-[#06452C]"
                    >
                      {availableClassArms.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddStaffModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAddingStaff}
                      className="px-6 py-2.5 rounded-xl bg-green-primary hover:bg-green-dark text-white font-black shadow-md flex items-center gap-1.5 disabled:opacity-75 cursor-pointer"
                    >
                      {isAddingStaff ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Onboarding...</span>
                        </>
                      ) : (
                        <span>Add Teacher →</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 5. TIMETABLE & CLASS SCHEDULES MANAGEMENT TAB ================= */}
      {activeAdminTab === 'timetable' && (
        <div className="space-y-6">
          {/* Header & Quick Action Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-green-primary text-xs font-bold uppercase tracking-wider mb-1">
                <CalendarDays className="w-4 h-4" />
                <span>Academic Timetable & Schedule Engine</span>
              </div>
              <h3 className="text-xl font-black text-[#1B2521]">Class Timetables & Period Allocations</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize weekly periods, assign subject teachers, and manage venues for every class arm.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setEditingSlot(null);
                  setSlotForm({
                    id: '',
                    className: selectedTimetableClass,
                    day: selectedTimetableDay === 'All' ? 'Monday' : selectedTimetableDay,
                    period: '1st Period',
                    time: '08:00 AM - 08:45 AM',
                    subject: 'Mathematics',
                    teacherName: staffList[0]?.name || 'Mr. Babatunde Ogunlesi',
                    room: selectedTimetableClass.startsWith('SSS') ? 'Room 201 (Senior Block)' : 'Room 101 (Junior Block)'
                  });
                  setShowAddSlotModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-green-primary hover:bg-green-dark text-white font-extrabold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Period Slot</span>
              </button>

              <button
                type="button"
                onClick={() => handleResetTimetableForClass(selectedTimetableClass)}
                className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all border border-gray-200 flex items-center gap-1.5 cursor-pointer"
                title="Reset to standard Lagos State curriculum template"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
                <span>Reset Class</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPrintTimetableModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#06452C] font-bold text-xs transition-all border border-emerald-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const headers = ['Class', 'Day', 'Period', 'Time', 'Subject', 'Teacher', 'Room'];
                  const rows = classTimetable.map(s => [
                    s.className, s.day, s.period, s.time, s.subject, s.teacherName, s.room
                  ]);
                  exportToCSV(`${selectedTimetableClass.replace(/\s+/g, '_')}_Timetable`, rows, headers);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#06452C] font-bold text-xs transition-all border border-emerald-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {timetableFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#06452C] flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{timetableFeedback}</span>
            </div>
          )}

          {/* Filter Bar: Class Selector & Day Tabs */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-gray-700 uppercase">Select Target Class:</span>
                <select
                  value={selectedTimetableClass}
                  onChange={(e) => setSelectedTimetableClass(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-emerald-500/40 bg-emerald-50 text-xs font-black text-[#06452C] focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  {availableClassArms.filter(c => !c.includes('None')).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-gray-500 font-medium">
                Showing <strong className="text-gray-900 font-bold">{classTimetable.length} scheduled periods</strong> for {selectedTimetableClass}
              </div>
            </div>

            {/* Day Selector Pill Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
              {['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedTimetableDay(day)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedTimetableDay === day
                      ? 'bg-[#06452C] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day === 'All' ? '📅 Full Week' : day}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Grid by Day */}
          {classTimetable.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-3">
              <CalendarDays className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="text-base font-bold text-gray-700">No Timetable Slots Found for {selectedTimetableClass}</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                This class doesn't have any periods configured yet. Click below to auto-populate the official standard schedule or add slots manually.
              </p>
              <button
                type="button"
                onClick={() => handleResetTimetableForClass(selectedTimetableClass)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-green-primary hover:bg-green-dark text-white font-extrabold text-xs shadow-sm cursor-pointer"
              >
                Auto-Generate Standard Timetable
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {(selectedTimetableDay === 'All' ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] : [selectedTimetableDay]).map((day) => {
                const daySlots = classTimetable.filter(s => s.day === day);
                if (daySlots.length === 0) return null;

                return (
                  <div key={day} className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-primary" />
                        <h4 className="text-sm sm:text-base font-black text-[#1B2521] uppercase tracking-wide">{day} Schedule</h4>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{daySlots.length} Periods</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="p-4 rounded-2xl border border-gray-200 bg-[#FAFCFA] hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3 group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-start">
                              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-[10px]">
                                {slot.period || 'Period'}
                              </span>
                              <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {slot.time}
                              </span>
                            </div>

                            <h5 className="font-extrabold text-sm text-[#1B2521] pt-1">{slot.subject}</h5>

                            <div className="text-xs text-gray-600 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                              <span className="truncate">{slot.teacherName || 'Subject Teacher'}</span>
                            </div>

                            <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{slot.room || 'Classroom'}</span>
                            </div>
                          </div>

                          <div className="flex justify-end items-center gap-2 pt-2 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSlot(slot);
                                setSlotForm({
                                  id: slot.id,
                                  className: slot.className || selectedTimetableClass,
                                  day: slot.day || day,
                                  period: slot.period || '1st Period',
                                  time: slot.time || '08:00 AM - 08:45 AM',
                                  subject: slot.subject || '',
                                  teacherName: slot.teacherName || '',
                                  room: slot.room || 'Room 201'
                                });
                                setShowAddSlotModal(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
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

      {/* ================= 6. BROADCAST ANNOUNCEMENTS ================= */}
      {activeAdminTab === 'announcements' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-black text-[#1B2521]">Broadcast Official School Announcement</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Notices posted here appear instantly on all student, teacher, and bursar dashboards.
            </p>
          </div>

          {noticeMsg && (
            <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs font-bold text-green-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-primary" />
              <span>{noticeMsg}</span>
            </div>
          )}

          <form onSubmit={handleNoticeSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Notice Headline / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. First Term Mid-Term Examination Schedule Released"
                value={newNotice.title}
                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Announcement Circular Body *</label>
              <textarea
                required
                rows="5"
                placeholder="Write official announcement details..."
                value={newNotice.content}
                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isBroadcastingNotice}
              className="w-full py-4 rounded-2xl font-black text-xs text-white bg-[#06452C] hover:bg-[#0B5D3B] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer active:scale-95"
            >
              {isBroadcastingNotice ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Dispatching Circular...</span>
                </>
              ) : (
                <>
                  <Megaphone className="w-4 h-4" />
                  <span>Dispatch School Circular →</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ================= 6. ACADEMIC SESSION & ACTIVE TERM CONTROL ================= */}
      {activeAdminTab === 'session' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-green-primary flex items-center justify-center border border-emerald-200">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1B2521]">Academic School Year & Term Control</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update active session and term. Changes immediately propagate to teachers' collation, students' broadsheets, and printable report sheets.
                </p>
              </div>
            </div>
          </div>

          {sessionFeedback && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#06452C] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{sessionFeedback}</span>
            </div>
          )}

          <form onSubmit={handleSessionSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-bold text-gray-700 text-xs">
                    Academic Session / School Year *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewSessionModal(true)}
                    className="text-xs font-black text-green-primary hover:text-green-dark flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Year</span>
                  </button>
                </div>
                <select
                  value={sessionForm.currentSession}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__CREATE_NEW__') {
                      setShowNewSessionModal(true);
                      return;
                    }
                    setSessionForm({ ...sessionForm, currentSession: val });
                  }}
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-[#06452C]"
                >
                  {(Array.isArray(availableSessions) ? availableSessions : defaultAvailableSessions).map((sess) => (
                    <option key={sess} value={sess}>
                      {sess} Academic Session
                    </option>
                  ))}
                  <option value="__CREATE_NEW__">+ Create New School Year...</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  Active School Term *
                </label>
                <select
                  value={sessionForm.currentTerm}
                  onChange={(e) => setSessionForm({ ...sessionForm, currentTerm: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold text-[#06452C]"
                >
                  <option value="3rd Term">3rd Term (Promotional & Cumulative Collation)</option>
                  <option value="2nd Term">2nd Term (Easter Term)</option>
                  <option value="1st Term">1st Term (Christmas / First Term)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  Next Term Resumption Date *
                </label>
                <input
                  type="date"
                  required
                  value={sessionForm.nextTermBegins}
                  onChange={(e) => setSessionForm({ ...sessionForm, nextTermBegins: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  Total Official School Days in Term *
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  max="150"
                  value={sessionForm.schoolDays}
                  onChange={(e) => setSessionForm({ ...sessionForm, schoolDays: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA] font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#06452C] text-white space-y-2 text-xs shadow-sm">
              <div className="flex items-center gap-2 text-emerald-300 font-black text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Live School-Wide Broadcast Preview</span>
              </div>
              <p className="text-emerald-100">
                Active Session: <strong>{sessionForm.currentSession}</strong> · Active Term: <strong>{sessionForm.currentTerm}</strong>. Next term scheduled to commence on <strong>{sessionForm.nextTermBegins}</strong>.
              </p>
            </div>

            <button
              type="submit"
              disabled={isUpdatingSession}
              className="w-full py-4 rounded-xl font-extrabold text-sm text-white bg-green-primary hover:bg-green-dark transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
            >
              {isUpdatingSession ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Broadcasting Academic Term Settings...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save & Apply Active School Session & Term →</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ================= MODAL: CREATE BRAND NEW ACADEMIC SCHOOL YEAR ================= */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-5 animate-scaleUp">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-green-primary flex items-center justify-center border border-emerald-200">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1B2521]">Create Academic School Year</h3>
                  <p className="text-[11px] text-gray-500">Provision a new session for registration & grading</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewSessionModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewSession} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  New School Year Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2027/2028"
                  value={newSessionForm.sessionName}
                  onChange={(e) => setNewSessionForm({ ...newSessionForm, sessionName: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-sm font-bold text-[#06452C] bg-[#FAFCFA] focus:outline-none focus:border-green-primary"
                />
                <p className="text-[10px] text-gray-400 mt-1">Format: YYYY/YYYY (e.g. 2027/2028, 2028/2029)</p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Starting Term for New Session *
                </label>
                <select
                  value={newSessionForm.startingTerm}
                  onChange={(e) => setNewSessionForm({ ...newSessionForm, startingTerm: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 bg-[#FAFCFA] focus:outline-none focus:border-green-primary"
                >
                  <option value="1st Term">1st Term (First / Christmas Term)</option>
                  <option value="2nd Term">2nd Term (Easter Term)</option>
                  <option value="3rd Term">3rd Term (Promotional Term)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Resumption Date *
                </label>
                <input
                  type="date"
                  required
                  value={newSessionForm.resumptionDate}
                  onChange={(e) => setNewSessionForm({ ...newSessionForm, resumptionDate: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold bg-[#FAFCFA] focus:outline-none focus:border-green-primary"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="w-1/2 py-3.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSession}
                  className="w-1/2 py-3.5 rounded-xl font-extrabold text-white bg-green-primary hover:bg-green-dark transition-all text-xs shadow-md flex items-center justify-center gap-1.5 disabled:opacity-75 cursor-pointer"
                >
                  {isCreatingSession ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create & Activate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PERIOD SLOT ================= */}
      {showAddSlotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden my-8">
            <div className="bg-[#06452C] text-white p-5 sm:p-6 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">
                    {editingSlot ? 'Edit Timetable Period' : 'Add New Timetable Period Slot'}
                  </h4>
                  <p className="text-[11px] text-emerald-200">{slotForm.className || selectedTimetableClass}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowAddSlotModal(false); setEditingSlot(null); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlotSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Class *</label>
                  <select
                    value={slotForm.className}
                    onChange={(e) => setSlotForm({ ...slotForm, className: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 font-bold bg-[#FAFCFA] focus:outline-none focus:border-green-primary cursor-pointer"
                  >
                    {availableClassArms.filter(c => !c.includes('None')).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Day of the Week *</label>
                  <select
                    value={slotForm.day}
                    onChange={(e) => setSlotForm({ ...slotForm, day: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 font-bold bg-[#FAFCFA] focus:outline-none focus:border-green-primary cursor-pointer"
                  >
                    {STANDARD_DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Period Name *</label>
                  <select
                    value={slotForm.period}
                    onChange={(e) => {
                      const periodVal = e.target.value;
                      const matched = STANDARD_PERIODS.find(p => p.period === periodVal);
                      setSlotForm({
                        ...slotForm,
                        period: periodVal,
                        time: matched ? matched.time : slotForm.time
                      });
                    }}
                    className="w-full p-3 rounded-xl border border-gray-200 font-bold bg-[#FAFCFA] focus:outline-none focus:border-green-primary cursor-pointer"
                  >
                    {STANDARD_PERIODS.map((p) => (
                      <option key={p.period} value={p.period}>{p.period}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Period Time (Duration) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:00 AM - 08:45 AM"
                    value={slotForm.time}
                    onChange={(e) => setSlotForm({ ...slotForm, time: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 font-bold bg-[#FAFCFA] focus:outline-none focus:border-green-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subject Name *</label>
                <div className="space-y-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) setSlotForm({ ...slotForm, subject: e.target.value });
                    }}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold bg-gray-50 cursor-pointer"
                  >
                    <option value="">-- Quick Preset Subjects --</option>
                    {(slotForm.className.startsWith('SSS') ? SSS_SUBJECTS : JSS_SUBJECTS).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Or type exact subject name..."
                    value={slotForm.subject}
                    onChange={(e) => setSlotForm({ ...slotForm, subject: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold bg-[#FAFCFA] focus:outline-none focus:border-green-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Teacher</label>
                <select
                  value={slotForm.teacherName}
                  onChange={(e) => setSlotForm({ ...slotForm, teacherName: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 font-bold bg-[#FAFCFA] focus:outline-none focus:border-green-primary cursor-pointer"
                >
                  <option value="Subject Master">Subject Master (Unassigned)</option>
                  {staffList.map((st) => (
                    <option key={st.staffId || st.email || st.name} value={st.name}>
                      {st.name} ({st.department || 'Staff'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Classroom / Laboratory / Venue</label>
                <div className="space-y-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) setSlotForm({ ...slotForm, room: e.target.value });
                    }}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold bg-gray-50 cursor-pointer"
                  >
                    <option value="">-- Quick Standard Venues --</option>
                    {STANDARD_ROOMS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="e.g. SSS 3A Classroom or Physics Lab"
                    value={slotForm.room}
                    onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 font-bold bg-[#FAFCFA] focus:outline-none focus:border-green-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddSlotModal(false); setEditingSlot(null); }}
                  className="w-1/2 py-3.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSlot}
                  className="w-1/2 py-3.5 rounded-xl font-extrabold text-white bg-green-primary hover:bg-green-dark transition-all text-xs shadow-md flex items-center justify-center gap-1.5 disabled:opacity-75 cursor-pointer"
                >
                  {isSavingSlot ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Saving Slot...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{editingSlot ? 'Update Period' : 'Add Period'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRINT OFFICIAL CLASS TIMETABLE ================= */}
      {showPrintTimetableModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-gray-200 overflow-hidden my-auto print:border-0 print:shadow-none print:max-w-none print:w-full print:rounded-none">
            {/* Header Control Bar */}
            <div className="print:hidden bg-[#06452C] text-white p-4 sm:p-5 flex justify-between items-center border-b border-emerald-800">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-5 h-5 text-emerald-300" />
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">Official Class Timetable — {selectedTimetableClass}</h4>
                  <p className="text-[11px] text-emerald-200">{sessionForm.currentSession} · {sessionForm.currentTerm}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => printDocument('printable-class-timetable', `${selectedTimetableClass} - Official Timetable`)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintTimetableModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div
              id="printable-class-timetable"
              className="p-6 sm:p-8 text-black bg-white select-text print:p-2"
              style={{ fontFamily: "'Arial', 'Segoe UI', sans-serif" }}
            >
              {/* Header with School Crest */}
              <div className="text-center relative pb-3 mb-4 border-b-2 border-gray-900">
                <div className="absolute left-0 top-0 w-16 h-16 flex items-center justify-center">
                  <img
                    src="/school-logo.png"
                    alt="New State High School Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="px-16">
                  <h1 className="text-xl font-black uppercase text-gray-900">NEW STATE HIGH SCHOOL</h1>
                  <p className="text-xs text-gray-700 font-bold">36 Palm Avenue, Mushin, Lagos State · info@newstateschools.org</p>
                  <h2 className="text-sm font-black uppercase text-emerald-900 mt-1">
                    OFFICIAL CLASS ACADEMIC TIMETABLE — {selectedTimetableClass}
                  </h2>
                  <p className="text-xs text-gray-600 font-semibold">{sessionForm.currentSession} Academic Session · {sessionForm.currentTerm}</p>
                </div>
              </div>

              {/* Weekly Timetable Table Grid */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-900 text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-900 font-black border-b-2 border-gray-900">
                      <th className="p-2.5 border border-gray-400 text-left w-24">Day</th>
                      <th className="p-2.5 border border-gray-400 text-center">1st Period<br/><span className="text-[10px] font-normal text-gray-600">08:00-08:45</span></th>
                      <th className="p-2.5 border border-gray-400 text-center">2nd Period<br/><span className="text-[10px] font-normal text-gray-600">08:45-09:30</span></th>
                      <th className="p-2.5 border border-gray-400 text-center">3rd Period<br/><span className="text-[10px] font-normal text-gray-600">09:30-10:15</span></th>
                      <th className="p-2 border border-gray-400 text-center bg-amber-50 text-[10px] font-bold">Break<br/>10:15-10:45</th>
                      <th className="p-2.5 border border-gray-400 text-center">4th Period<br/><span className="text-[10px] font-normal text-gray-600">10:45-11:30</span></th>
                      <th className="p-2.5 border border-gray-400 text-center">5th Period<br/><span className="text-[10px] font-normal text-gray-600">11:30-12:15</span></th>
                      <th className="p-2 border border-gray-400 text-center bg-amber-50 text-[10px] font-bold">Lunch<br/>12:15-01:00</th>
                      <th className="p-2.5 border border-gray-400 text-center">6th Period<br/><span className="text-[10px] font-normal text-gray-600">01:00-01:45</span></th>
                      <th className="p-2.5 border border-gray-400 text-center">7th Period<br/><span className="text-[10px] font-normal text-gray-600">01:45-02:30</span></th>
                      <th className="p-2.5 border border-gray-400 text-center">8th Period<br/><span className="text-[10px] font-normal text-gray-600">02:30-03:15</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {STANDARD_DAYS.map((day) => {
                      const daySlots = classTimetable.filter(s => s.day === day);
                      const getSlot = (pName) => daySlots.find(s => s.period?.includes(pName) || s.period === pName);

                      return (
                        <tr key={day} className="border-b border-gray-400">
                          <td className="p-2.5 border border-gray-400 font-black bg-gray-50">{day}</td>
                          {['1st Period', '2nd Period', '3rd Period'].map((pName) => {
                            const slot = getSlot(pName);
                            return (
                              <td key={pName} className="p-2 border border-gray-400 text-center align-top">
                                {slot ? (
                                  <div>
                                    <strong className="block text-gray-900 font-bold">{slot.subject}</strong>
                                    <span className="text-[10px] text-gray-600 block">{slot.teacherName}</span>
                                    <span className="text-[9px] text-gray-500 italic block">{slot.room}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-300 text-[10px]">-</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="p-1 border border-gray-400 text-center bg-amber-50/50 text-[9px] font-bold text-amber-900 rotate-180 writing-mode-vertical">
                            Snack
                          </td>
                          {['4th Period', '5th Period'].map((pName) => {
                            const slot = getSlot(pName);
                            return (
                              <td key={pName} className="p-2 border border-gray-400 text-center align-top">
                                {slot ? (
                                  <div>
                                    <strong className="block text-gray-900 font-bold">{slot.subject}</strong>
                                    <span className="text-[10px] text-gray-600 block">{slot.teacherName}</span>
                                    <span className="text-[9px] text-gray-500 italic block">{slot.room}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-300 text-[10px]">-</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="p-1 border border-gray-400 text-center bg-amber-50/50 text-[9px] font-bold text-amber-900 rotate-180 writing-mode-vertical">
                            Lunch
                          </td>
                          {['6th Period', '7th Period', '8th Period'].map((pName) => {
                            const slot = getSlot(pName);
                            return (
                              <td key={pName} className="p-2 border border-gray-400 text-center align-top">
                                {slot ? (
                                  <div>
                                    <strong className="block text-gray-900 font-bold">{slot.subject}</strong>
                                    <span className="text-[10px] text-gray-600 block">{slot.teacherName}</span>
                                    <span className="text-[9px] text-gray-500 italic block">{slot.room}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-300 text-[10px]">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer Stamp & Signatures */}
              <div className="mt-8 pt-4 border-t border-gray-400 flex justify-between items-end text-xs">
                <div>
                  <p className="font-bold text-gray-800">New State High School Administration</p>
                  <p className="text-[10px] text-gray-500">Motto: Domine Dirige Nos</p>
                </div>
                <div className="text-right">
                  <div className="border-b border-gray-800 w-40 pb-1 mb-1 font-bold text-center text-gray-900">
                    Principal's Office
                  </div>
                  <p className="text-[10px] text-gray-600 text-center">Approved & Authorized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Action Success / Feedback Popup Modal */}
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
