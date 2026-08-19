// Mock Data for New State High School Management Portal

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
      id: 'NSHS/2024/001',
      name: 'Adewale Johnson',
      gender: 'Male',
      class: 'SSS 3 (Science)',
      house: 'Red House',
      guardian: 'Mr. & Mrs. Johnson',
      guardianPhone: '0802 123 4567',
      feeStatus: 'Approved',
      feeAmount: '₦125,000',
      paidAmount: '₦125,000',
    },
    {
      id: 'NSHS/2024/002',
      name: 'Chidimma Okonkwo',
      gender: 'Female',
      class: 'SSS 3 (Science)',
      house: 'Blue House',
      guardian: 'Chief Okonkwo',
      guardianPhone: '0803 987 6543',
      feeStatus: 'Pending',
      feeAmount: '₦125,000',
      paidAmount: '₦125,000',
    },
    {
      id: 'NSHS/2024/003',
      name: 'Babatunde Ogunlesi',
      gender: 'Male',
      class: 'JSS 2',
      house: 'Yellow House',
      guardian: 'Mrs. Ogunlesi',
      guardianPhone: '0813 400 0644',
      feeStatus: 'Unpaid',
      feeAmount: '₦95,000',
      paidAmount: '₦0',
    },
  ],

  results: {
    'NSHS/2024/001': [
      { subject: 'Mathematics', ca1: 18, ca2: 19, exam: 58, total: 95, grade: 'A1', remark: 'Excellent' },
      { subject: 'English Language', ca1: 16, ca2: 17, exam: 52, total: 85, grade: 'A1', remark: 'Very Good' },
      { subject: 'Physics', ca1: 17, ca2: 18, exam: 54, total: 89, grade: 'A1', remark: 'Outstanding' },
      { subject: 'Chemistry', ca1: 15, ca2: 16, exam: 49, total: 80, grade: 'A1', remark: 'Great Effort' },
      { subject: 'Biology', ca1: 18, ca2: 16, exam: 50, total: 84, grade: 'A1', remark: 'Commendable' },
      { subject: 'Computer Studies (AI & Coding)', ca1: 20, ca2: 19, exam: 59, total: 98, grade: 'A1', remark: 'Distinction' },
    ],
    'NSHS/2024/002': [
      { subject: 'Mathematics', ca1: 15, ca2: 14, exam: 48, total: 77, grade: 'B2', remark: 'Good' },
      { subject: 'English Language', ca1: 18, ca2: 18, exam: 55, total: 91, grade: 'A1', remark: 'Excellent' },
      { subject: 'Physics', ca1: 14, ca2: 15, exam: 42, total: 71, grade: 'B3', remark: 'Good' },
      { subject: 'Chemistry', ca1: 16, ca2: 16, exam: 48, total: 80, grade: 'A1', remark: 'Very Good' },
      { subject: 'Biology', ca1: 17, ca2: 17, exam: 51, total: 85, grade: 'A1', remark: 'Great Work' },
    ],
  },

  timetable: [
    { day: 'Monday', time: '8:00 AM - 9:00 AM', subject: 'Mathematics', room: 'Room 3A' },
    { day: 'Monday', time: '9:00 AM - 10:00 AM', subject: 'English Language', room: 'Room 3A' },
    { day: 'Monday', time: '10:30 AM - 11:30 AM', subject: 'Physics (Practical)', room: 'Lab 1' },
    { day: 'Tuesday', time: '8:00 AM - 9:00 AM', subject: 'Chemistry', room: 'Lab 2' },
    { day: 'Tuesday', time: '9:00 AM - 10:00 AM', subject: 'AI & Coding Skills', room: 'ICT Lab' },
    { day: 'Wednesday', time: '8:00 AM - 10:00 AM', subject: 'Biology (Practical)', room: 'Lab 3' },
    { day: 'Thursday', time: '8:00 AM - 9:30 AM', subject: 'Further Mathematics', room: 'Room 3A' },
    { day: 'Friday', time: '8:00 AM - 10:00 AM', subject: 'Civic Education & Sports', room: 'Field' },
  ],

  assignments: [
    {
      id: 'ASN01',
      subject: 'Computer Studies (AI Coding)',
      title: 'Python Quadratic Equation Solver Script',
      dueDate: '2026-08-25',
      desc: 'Write a Python program that accepts coefficients a, b, c and prints real roots.',
      status: 'Pending Submission',
    },
    {
      id: 'ASN02',
      subject: 'Physics',
      title: 'Newtonian Mechanics Problem Set 4',
      dueDate: '2026-08-22',
      desc: 'Complete problems 1 to 10 on projectile motion from textbook page 142.',
      status: 'Submitted',
    },
  ],

  learningMaterials: [
    {
      title: 'First Term Physics Complete Lecture Notes',
      subject: 'Physics',
      format: 'PDF',
      size: '2.4 MB',
      dateAdded: '2026-08-10',
    },
    {
      title: 'Python Fundamentals & Web Dev Handbook',
      subject: 'AI & Coding',
      format: 'PDF',
      size: '5.1 MB',
      dateAdded: '2026-08-12',
    },
    {
      title: 'WAEC Past Questions & Solutions (2015-2025)',
      subject: 'Mathematics',
      format: 'ZIP',
      size: '12.8 MB',
      dateAdded: '2026-08-01',
    },
  ],

  feePayments: [
    {
      id: 'PAY-1092',
      studentId: 'NSHS/2024/002',
      studentName: 'Chidimma Okonkwo',
      amount: '₦125,000',
      bankName: 'First Bank Nigeria',
      reference: 'TRX-98230192',
      receiptImg: '/school-logo.png',
      dateSubmitted: '2026-08-18',
      status: 'Pending',
    },
    {
      id: 'PAY-1088',
      studentId: 'NSHS/2024/001',
      studentName: 'Adewale Johnson',
      amount: '₦125,000',
      bankName: 'Guaranty Trust Bank',
      reference: 'GTB-44120934',
      receiptImg: '/school-logo.png',
      dateSubmitted: '2026-08-15',
      status: 'Approved',
    },
  ],

  announcements: [
    {
      id: 'ANN-01',
      title: 'Inter-House Sports Competition Date Announced',
      author: 'Vice Principal (Student Life)',
      date: '2026-08-17',
      content: 'The annual New State High School Inter-House sports competition will hold on October 15th at the main sports pavilion.',
    },
    {
      id: 'ANN-02',
      title: 'First Term Mid-Term Assessment Schedule',
      author: 'Academic Directorate',
      date: '2026-08-14',
      content: 'Mid-term examinations for all JSS and SSS students commence on September 28th. Ensure all fee receipts are cleared.',
    },
  ],

  staff: [
    { name: 'Dr. O. A. Adeleke', role: 'Principal', department: 'Administration', email: 'principal@newstateschools.org' },
    { name: 'Mr. Babatunde Ogunlesi', role: 'Head of Science', department: 'Physics & Math', email: 'science@newstateschools.org' },
    { name: 'Mrs. Folashade Adebayo', role: 'Bursar', department: 'Finance & Accounts', email: 'bursar@newstateschools.org' },
  ],
};
