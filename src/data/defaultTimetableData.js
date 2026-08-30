// Default comprehensive master timetable data for New State High School

export const STANDARD_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const STANDARD_PERIODS = [
  { period: '1st Period', time: '08:00 AM - 08:45 AM' },
  { period: '2nd Period', time: '08:45 AM - 09:30 AM' },
  { period: '3rd Period', time: '09:30 AM - 10:15 AM' },
  { period: 'Short Break', time: '10:15 AM - 10:45 AM' },
  { period: '4th Period', time: '10:45 AM - 11:30 AM' },
  { period: '5th Period', time: '11:30 AM - 12:15 PM' },
  { period: 'Lunch Break', time: '12:15 PM - 01:00 PM' },
  { period: '6th Period', time: '01:00 PM - 01:45 PM' },
  { period: '7th Period', time: '01:45 PM - 02:30 PM' },
  { period: '8th Period', time: '02:30 PM - 03:15 PM' }
];

export const JSS_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Basic Science',
  'Basic Technology',
  'Civic Education',
  'Computer Studies (AI & Coding)',
  'Social Studies',
  'CRS / IRS',
  'Agricultural Science',
  'Yoruba Language',
  'Business Studies',
  'Physical & Health Education'
];

export const SSS_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Physics',
  'Chemistry',
  'Biology',
  'Further Mathematics',
  'Economics',
  'Civic Education',
  'Computer Studies (AI & Coding)',
  'Agricultural Science',
  'Literature in English',
  'Government',
  'Financial Accounting',
  'Commerce'
];

export const STANDARD_ROOMS = [
  'SSS 3A Classroom',
  'SSS 3B Classroom',
  'SSS 2A Classroom',
  'SSS 2B Classroom',
  'SSS 1A Classroom',
  'SSS 1B Classroom',
  'JSS 3A Classroom',
  'JSS 3B Classroom',
  'JSS 2A Classroom',
  'JSS 2B Classroom',
  'JSS 1A Classroom',
  'JSS 1B Classroom',
  'Physics Laboratory',
  'Chemistry Laboratory',
  'Biology Laboratory',
  'Basic Science & Tech Workshop',
  'Computer / ICT Laboratory',
  'Home Economics Laboratory',
  'Technical Drawing Studio',
  'School Library',
  'School Assembly Hall',
  'School Sports Ground'
];

// Helper to generate full school timetable default
export const generateDefaultSchoolTimetable = () => {
  const classArms = [
    'JSS 1 - Arm A', 'JSS 1 - Arm B',
    'JSS 2 - Arm A', 'JSS 2 - Arm B',
    'JSS 3 - Arm A', 'JSS 3 - Arm B',
    'SSS 1 - Arm A', 'SSS 1 - Arm B',
    'SSS 2 - Arm A', 'SSS 2 - Arm B',
    'SSS 3 - Arm A', 'SSS 3 - Arm B'
  ];

  const defaultTeacherMap = {
    'Mathematics': 'Mr. Emeka Okafor',
    'Further Mathematics': 'Mr. Babatunde Ogunlesi',
    'Physics': 'Mr. Babatunde Ogunlesi',
    'Chemistry': 'Mrs. Ngozi Eze',
    'Biology': 'Mrs. Ngozi Eze',
    'English Language': 'Mrs. Folashade Adeleke',
    'Literature in English': 'Mrs. Folashade Adeleke',
    'Economics': 'Mr. Emeka Okafor',
    'Civic Education': 'Mr. Adekunle Johnson',
    'Computer Studies (AI & Coding)': 'Dr. S. O. Balogun',
    'Basic Science': 'Mrs. Ngozi Eze',
    'Basic Technology': 'Mr. Babatunde Ogunlesi',
    'Social Studies': 'Mr. Adekunle Johnson',
    'Agricultural Science': 'Mr. Kalu Nnamdi',
    'Yoruba Language': 'Mrs. Folashade Adeleke',
    'Business Studies': 'Mr. Emeka Okafor',
    'Commerce': 'Mr. Emeka Okafor',
    'Government': 'Mr. Adekunle Johnson',
    'CRS / IRS': 'Mrs. Folashade Adeleke',
    'Physical & Health Education': 'Coach Taiwo Alabi'
  };

  const timetable = [];

  classArms.forEach((className) => {
    const isSSS = className.startsWith('SSS');
    const subjectList = isSSS ? SSS_SUBJECTS : JSS_SUBJECTS;

    STANDARD_DAYS.forEach((day, dayIdx) => {
      // 8 academic periods per day (excluding breaks)
      const periodsForDay = [
        { period: '1st Period', time: '08:00 AM - 08:45 AM' },
        { period: '2nd Period', time: '08:45 AM - 09:30 AM' },
        { period: '3rd Period', time: '09:30 AM - 10:15 AM' },
        { period: '4th Period', time: '10:45 AM - 11:30 AM' },
        { period: '5th Period', time: '11:30 AM - 12:15 PM' },
        { period: '6th Period', time: '01:00 PM - 01:45 PM' },
        { period: '7th Period', time: '01:45 PM - 02:30 PM' },
        { period: '8th Period', time: '02:30 PM - 03:15 PM' }
      ];

      periodsForDay.forEach((pInfo, pIdx) => {
        const subjIndex = (dayIdx * 3 + pIdx) % subjectList.length;
        const subject = subjectList[subjIndex];
        const teacher = defaultTeacherMap[subject] || 'Subject Master';
        
        const armLetter = className.includes('Arm B') ? 'B' : 'A';
        const classParts = className.split(' - ')[0]; // e.g. "SSS 3" or "JSS 1"
        let room = `${classParts}${armLetter} Classroom`;

        if (subject.includes('Computer')) room = 'Computer / ICT Laboratory';
        else if (subject === 'Physics') room = 'Physics Laboratory';
        else if (subject === 'Chemistry') room = 'Chemistry Laboratory';
        else if (subject === 'Biology') room = 'Biology Laboratory';
        else if (subject === 'Basic Science' || subject === 'Basic Technology') room = 'Basic Science & Tech Workshop';
        else if (subject.includes('Physical & Health')) room = 'School Sports Ground';

        timetable.push({
          id: `TT-${className.replace(/\s+/g, '')}-${day.substring(0, 3).toUpperCase()}-${pIdx + 1}`,
          className,
          day,
          period: pInfo.period,
          time: pInfo.time,
          subject,
          teacherName: teacher,
          room
        });
      });
    });
  });

  return timetable;
};
