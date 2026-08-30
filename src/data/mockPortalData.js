// Production initial data fallback schema for New State High School Portal
// Clean fresh slate for new student testing & live presentation
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
      house: 'Red House',
      guardian: 'Chief & Mrs. Adeleke',
      guardianPhone: '0813 400 0644',
      feeStatus: 'Unpaid',
      feeAmount: '₦125,000',
      paidAmount: '₦0',
      password: '1234',
      age: 16,
      classSize: 42,
      position: 'Pending'
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
      role: 'Senior Science Master & Form Master',
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
