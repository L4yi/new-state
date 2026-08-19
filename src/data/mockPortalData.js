// Production initial data fallback schema for New State High School Portal
// Live persistent records are loaded directly from MongoDB Atlas

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
  students: [],
  results: {},
  timetable: [],
  assignments: [],
  learningMaterials: [],
  feePayments: [],
  announcements: [],
  staff: [],
};
