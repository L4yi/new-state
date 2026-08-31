// Production initial data fallback schema for New State High School Portal
// Clean blank slate for fresh student onboarding & live testing
import { generateDefaultSchoolTimetable } from './defaultTimetableData';

export const initialPortalData = {
  sessionInfo: {
    currentSession: '2026/2027 Academic Session',
    currentTerm: 'First Term',
    schoolName: 'New State High School',
    schoolMotto: 'Domine Dirige Nos',
    address: '36 Palm Avenue, Mushin, Lagos, Nigeria',
    phone: '+234 813 400 0644',
    email: 'info@newstateschools.org',
    bankDetails: {
      bankName: 'First Bank Nigeria',
      accountName: 'New State High School',
      accountNumber: '1029384756',
    },
  },
  students: [
    {
      id: 'NSHS/2026/001',
      name: 'Oluwaseun Adeleke',
      gender: 'Male',
      class: 'SSS 3A',
      entryClass: 'SSS 3',
      classArm: 'Arm A',
      house: 'Red House',
      guardian: 'Chief & Mrs. Adeleke',
      guardianPhone: '0813 400 0644',
      feeStatus: 'Approved',
      feeAmount: '₦125,000',
      paidAmount: '₦125,000',
      password: '1234',
      portalPin: '1234',
      age: 16,
      classSize: 42,
      position: '3rd out of 42',
    },
    {
      id: 'NSHS/2026/002',
      name: 'Muslimah Adeyeri',
      gender: 'Female',
      class: 'SSS 3A',
      entryClass: 'SSS 3',
      classArm: 'Arm A',
      house: 'Emerald Green House',
      guardian: 'Alhaji & Mrs. Adeyeri',
      guardianPhone: '0802 345 6789',
      feeStatus: 'Approved',
      feeAmount: '₦125,000',
      paidAmount: '₦125,000',
      password: '1234',
      portalPin: '1234',
      age: 16,
      classSize: 42,
      position: '1st out of 42',
    },
    {
      id: 'NSHS/2026/003',
      name: 'Chukwuemeka Okonkwo',
      gender: 'Male',
      class: 'SSS 3A',
      entryClass: 'SSS 3',
      classArm: 'Arm A',
      house: 'Blue House',
      guardian: 'Mr. Emmanuel Okonkwo',
      guardianPhone: '0803 111 2233',
      feeStatus: 'Pending',
      feeAmount: '₦125,000',
      paidAmount: '₦0',
      password: '1234',
      portalPin: '1234',
      age: 16,
      classSize: 42,
      position: '5th out of 42',
    }
  ],
  results: {},
  timetable: generateDefaultSchoolTimetable(),
  assignments: [],
  learningMaterials: [],
  feePayments: [],
  announcements: [
    {
      id: 'ANN-2026-01',
      announcementId: 'ANN-2026-01',
      title: 'Welcome to the 2026/2027 Academic Session',
      author: 'Principal Office',
      date: '2026-08-30',
      content: 'Welcome to the 2026/2027 academic session. All students, parents, and academic staff are advised to track termly schedules, assignments, and fee clearances directly on the portal.'
    }
  ],
  staff: [
    {
      name: 'Mr. Babatunde Ogunlesi',
      staffId: 'TCH/PHYS/042',
      role: 'Senior Science Master & Class Teacher',
      department: 'Physical & Applied Sciences',
      email: 'babatunde.ogunlesi@newstateschools.org',
      password: '1234',
      isClassTeacher: true,
      classAssigned: 'SSS 3A',
      subjectsTaught: [
        { subjectName: 'Physics', className: 'SSS 3A' },
        { subjectName: 'Further Mathematics', className: 'SSS 3A' }
      ]
    },
    {
      name: 'Mrs. Folashade Adeleke',
      staffId: 'TCH/ENG/019',
      role: 'Language & Humanities Lead',
      department: 'Languages & Arts',
      email: 'folashade.adeleke@newstateschools.org',
      password: '1234',
      isClassTeacher: false,
      classAssigned: null,
      subjectsTaught: [
        { subjectName: 'English Language', className: 'SSS 3A' },
        { subjectName: 'Literature in English', className: 'SSS 3A' }
      ]
    },
    {
      name: 'Mrs. Ngozi Eze',
      staffId: 'TCH/BIO/028',
      role: 'Life Sciences Specialist',
      department: 'Natural Sciences',
      email: 'ngozi.eze@newstateschools.org',
      password: '1234',
      isClassTeacher: false,
      classAssigned: null,
      subjectsTaught: [
        { subjectName: 'Chemistry', className: 'SSS 3A' },
        { subjectName: 'Biology', className: 'SSS 3A' }
      ]
    },
    {
      name: 'Dr. O. A. Adeleke',
      staffId: 'ADMIN-01',
      role: 'Principal & Head of School',
      department: 'School Administration',
      email: 'admin@newstateschools.org',
      password: '1234',
      isClassTeacher: false,
      classAssigned: null,
      subjectsTaught: []
    },
    {
      name: 'Mrs. Folashade Adebayo',
      staffId: 'BURSAR-01',
      role: 'Bursar & Head of Finance',
      department: 'Bursary & Accounts',
      email: 'bursar@newstateschools.org',
      password: '1234',
      isClassTeacher: false,
      classAssigned: null,
      subjectsTaught: []
    }
  ],
  applications: []
};

// Dedicated Demo Test Dataset (Accessible strictly when logging in with ID "Test" / password "1234")
export const demoPortalData = {
  sessionInfo: {
    currentSession: '2026/2027 Academic Session',
    currentTerm: 'First Term',
    schoolName: 'New State High School',
    schoolMotto: 'Domine Dirige Nos',
    address: '36 Palm Avenue, Mushin, Lagos, Nigeria',
    phone: '+234 813 400 0644',
    email: 'info@newstateschools.org',
    bankDetails: {
      bankName: 'First Bank Nigeria',
      accountName: 'New State High School',
      accountNumber: '1029384756',
    },
  },
  students: [
    {
      id: 'Test',
      name: 'Oluwaseun Adeleke (Demo Student)',
      gender: 'Male',
      class: 'SSS 3A',
      entryClass: 'SSS 3',
      classArm: 'Arm A',
      house: 'Red House',
      guardian: 'Chief & Mrs. Adeleke',
      guardianPhone: '0813 400 0644',
      feeStatus: 'Approved',
      feeAmount: '₦125,000',
      paidAmount: '₦125,000',
      password: '1234',
      portalPin: '1234',
      age: 16,
      classSize: 42,
      position: '3rd out of 42',
      isDemo: true
    },
    {
      id: 'NSHS/2026/DEMO2',
      name: 'Muslimah Adeyeri (Demo Student)',
      gender: 'Female',
      class: 'SSS 3A',
      entryClass: 'SSS 3',
      classArm: 'Arm A',
      house: 'Emerald Green House',
      guardian: 'Alhaji & Mrs. Adeyeri',
      guardianPhone: '0802 345 6789',
      feeStatus: 'Approved',
      feeAmount: '₦125,000',
      paidAmount: '₦125,000',
      password: '1234',
      portalPin: '1234',
      age: 16,
      classSize: 42,
      position: '1st out of 42',
      isDemo: true
    }
  ],
  results: {
    'Test': [
      { subject: 'Mathematics', ca1: 18, ca2: 19, exam: 50, total: 87, grade: 'A1', remark: 'Distinction' },
      { subject: 'English Language', ca1: 17, ca2: 17, exam: 45, total: 79, grade: 'A1', remark: 'Distinction' },
      { subject: 'Physics', ca1: 19, ca2: 18, exam: 48, total: 85, grade: 'A1', remark: 'Distinction' },
      { subject: 'Chemistry', ca1: 16, ca2: 17, exam: 44, total: 77, grade: 'B2', remark: 'Very Good' },
      { subject: 'Biology', ca1: 18, ca2: 18, exam: 46, total: 82, grade: 'A1', remark: 'Distinction' }
    ]
  },
  timetable: generateDefaultSchoolTimetable(),
  assignments: [
    {
      id: 'ASN-DEMO-01',
      subject: 'Mathematics',
      title: 'Calculus & Quadratic Equations Exercise 4',
      dueDate: '2026-09-20',
      desc: 'Solve questions 1 through 15 in Chapter 4 of New General Mathematics for Senior Secondary Schools.'
    },
    {
      id: 'ASN-DEMO-02',
      subject: 'Physics',
      title: 'Thermodynamics & Heat Capacity Lab Report',
      dueDate: '2026-09-22',
      desc: 'Complete the laboratory analysis on specific heat capacity of metals.'
    }
  ],
  learningMaterials: [
    {
      id: 'MAT-DEMO-01',
      title: 'SSS 3 Physics Comprehensive Term Notes',
      subject: 'Physics',
      format: 'PDF',
      size: '2.4 MB',
      dateAdded: '2026-08-25'
    },
    {
      id: 'MAT-DEMO-02',
      title: 'Calculus and Trigonometry Advanced Companion',
      subject: 'Mathematics',
      format: 'PDF',
      size: '3.8 MB',
      dateAdded: '2026-08-27'
    }
  ],
  feePayments: [
    {
      id: 'PAY-DEMO-01',
      paymentId: 'PAY-DEMO-01',
      studentId: 'Test',
      studentName: 'Oluwaseun Adeleke',
      amount: '₦125,000',
      bankName: 'First Bank Nigeria',
      reference: 'TRF-DEMO-99182',
      dateSubmitted: '2026-08-28',
      status: 'Pending'
    }
  ],
  announcements: [
    {
      id: 'ANN-2026-01',
      announcementId: 'ANN-2026-01',
      title: 'Welcome to the 2026/2027 Academic Session',
      author: 'Principal Office',
      date: '2026-08-30',
      content: 'Welcome to the 2026/2027 academic session. All students, parents, and academic staff are advised to track termly schedules, assignments, and fee clearances directly on the portal.'
    }
  ],
  staff: [
    {
      name: 'Mr. Babatunde Ogunlesi (Demo Class Teacher)',
      staffId: 'Test-Class',
      role: 'Senior Science Master & Class Teacher',
      department: 'Physical & Applied Sciences',
      email: 'babatunde.ogunlesi@newstateschools.org',
      password: '1234',
      isClassTeacher: true,
      classAssigned: 'SSS 3A',
      subjectsTaught: [
        { subjectName: 'Mathematics', className: 'SSS 3A' },
        { subjectName: 'Physics', className: 'SSS 3A' },
        { subjectName: 'Further Mathematics', className: 'SSS 3A' }
      ]
    },
    {
      name: 'Mrs. Folashade Adeleke (Demo Subject Teacher)',
      staffId: 'Test-Subj',
      role: 'Language & Humanities Lead · Subject Teacher',
      department: 'Languages & Arts',
      email: 'folashade.adeleke@newstateschools.org',
      password: '1234',
      isClassTeacher: false,
      classAssigned: null,
      subjectsTaught: [
        { subjectName: 'English Language', className: 'SSS 3A' },
        { subjectName: 'Literature in English', className: 'SSS 3A' }
      ]
    },
    {
      name: 'Mrs. Folashade Adebayo (Demo Bursar)',
      staffId: 'Test-Bursar',
      role: 'Bursar & Head of Finance',
      department: 'Bursary & Accounts',
      email: 'bursar@newstateschools.org',
      password: '1234',
      isClassTeacher: false,
      classAssigned: null,
      subjectsTaught: []
    },
    {
      name: 'Dr. O. A. Adeleke (Demo Principal)',
      staffId: 'Test-Admin',
      role: 'Principal & Head of School',
      department: 'School Administration',
      email: 'admin@newstateschools.org',
      password: '1234',
      isClassTeacher: false,
      classAssigned: null,
      subjectsTaught: []
    }
  ],
  applications: [
    {
      id: 'APP-DEMO-01',
      applicationId: 'APP-DEMO-01',
      studentName: 'Chukwuemeka Okonkwo',
      gender: 'Male',
      dob: '2011-04-12',
      classApplyingFor: 'SSS 1 - Science',
      currentClass: 'JSS 3',
      previousSchool: 'St. Jude International College',
      guardianName: 'Mr. Emmanuel Okonkwo',
      primaryPhone: '0802 345 6789',
      dateSubmitted: '2026-08-28',
      status: 'Pending Review'
    },
    {
      id: 'APP-DEMO-02',
      applicationId: 'APP-DEMO-02',
      studentName: 'Fatima Garba',
      gender: 'Female',
      dob: '2012-09-18',
      classApplyingFor: 'JSS 1',
      currentClass: 'Primary 6',
      previousSchool: 'Crown Primary Academy',
      guardianName: 'Dr. Kabir Garba',
      primaryPhone: '0813 987 6543',
      dateSubmitted: '2026-08-29',
      status: 'Pending Review'
    }
  ]
};
