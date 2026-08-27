import React from 'react';
import { Printer, X, GraduationCap, Download, Check } from 'lucide-react';
import { printDocument } from '../../utils/printUtils';

export default function OfficialReportCardModal({ student, results = [], sessionInfo, onClose }) {
  const studentName = student?.name || 'OLADEJO Abdulmatin Olatubosun';
  const admissionNo = student?.id || 'JSS2A20232024-01';
  const studentClass = student?.class || 'SSS 1B';
  const sessionYear = sessionInfo?.currentSession || '2025/2026';
  const termName = (sessionInfo?.currentTerm || 'THIRD TERM').toUpperCase();
  const studentGender = student?.gender || 'Male';
  const studentAge = student?.age || '15';
  const classSize = student?.classSize || '43';
  const classPosition = student?.position || '22nd';

  // Authentic subject results matching the official report sheet
  const defaultSubjects = [
    { subject: 'Civic Education', firstCa: 0, secondCa: 0, homework: 10, project: 8, participation: 10, exam: 21.6, total: 49.6, term2: 49.8, term1: 62.9, pos: '20th' },
    { subject: 'Computer Studies', firstCa: 0, secondCa: 0, homework: 0, project: 0, participation: 0, exam: 0, total: 0, term2: 41.5, term1: 63.0, pos: '1st' },
    { subject: 'Crs', firstCa: 0, secondCa: 3, homework: 2, project: 4, participation: 5, exam: 19, total: 33, term2: 59.0, term1: 47.0, pos: '25th' },
    { subject: 'Economics', firstCa: 0, secondCa: 8.5, homework: 8, project: 8, participation: 5, exam: 11, total: 40.5, term2: 40.0, term1: 48.5, pos: '22nd' },
    { subject: 'English', firstCa: 9.8, secondCa: 10, homework: 8, project: 10, participation: 9, exam: 11.5, total: 58.3, term2: 40.6, term1: 43.3, pos: '27th' },
    { subject: 'Government', firstCa: 0, secondCa: 0, homework: 10, project: 8, participation: 8, exam: 11, total: 37, term2: 66.0, term1: 37.2, pos: '20th' },
    { subject: 'History', firstCa: 0, secondCa: 6.5, homework: 1, project: 3, participation: 7, exam: 14.4, total: 31.9, term2: 43.5, term1: 54.0, pos: '21st' },
    { subject: 'Igbo/yoruba', firstCa: 10, secondCa: 0, homework: 10, project: 6, participation: 7, exam: 29, total: 62, term2: 61.5, term1: 42.8, pos: '8th' },
    { subject: 'Literature', firstCa: 6, secondCa: 6, homework: 6, project: 7, participation: 5, exam: 22, total: 52, term2: 40.0, term1: 49.0, pos: '37th' },
    { subject: 'Mathematics', firstCa: 6, secondCa: 8.5, homework: 7, project: 6, participation: 8, exam: 34, total: 69.5, term2: 27.3, term1: 61.0, pos: '19th' },
  ];

  const processedResults = (results.length > 0 ? results : defaultSubjects).map((r, idx) => {
    const firstCa = Number(r.firstCa ?? r.ca1 ?? 8);
    const secondCa = Number(r.secondCa ?? r.ca2 ?? 8);
    const homework = Number(r.homework ?? 8);
    const project = Number(r.project ?? 7);
    const participation = Number(r.participation ?? 8);
    const exam = Number(r.exam ?? 35);
    
    // Calculate 3rd term total
    const total3rd = Number(r.total ?? (firstCa + secondCa + homework + project + participation + exam));
    const term2 = Number(r.term2 ?? Math.max(30, total3rd - 5));
    const term1 = Number(r.term1 ?? Math.max(35, total3rd + 4));
    const cumulative = Number((total3rd + term2 + term1).toFixed(1));
    const avgWeighted = Number((cumulative / 3).toFixed(2));

    let grade = 'F9';
    let remark = 'FAIL';
    if (avgWeighted >= 75) { grade = 'A1'; remark = 'DISTINCTION'; }
    else if (avgWeighted >= 70) { grade = 'B2'; remark = 'VERY GOOD'; }
    else if (avgWeighted >= 65) { grade = 'B3'; remark = 'GOOD'; }
    else if (avgWeighted >= 60) { grade = 'C4'; remark = 'CREDIT'; }
    else if (avgWeighted >= 55) { grade = 'C5'; remark = 'CREDIT'; }
    else if (avgWeighted >= 50) { grade = 'C6'; remark = 'CREDIT'; }
    else if (avgWeighted >= 45) { grade = 'D7'; remark = 'PASS'; }
    else if (avgWeighted >= 40) { grade = 'E8'; remark = 'PASS'; }
    else { grade = 'F9'; remark = 'FAIL'; }

    return {
      subject: r.subject,
      firstCa: Number(firstCa.toFixed(1)),
      secondCa: Number(secondCa.toFixed(1)),
      homework: Number(homework.toFixed(1)),
      project: Number(project.toFixed(1)),
      participation: Number(participation.toFixed(1)),
      exam: Number(exam.toFixed(1)),
      total: Number(total3rd.toFixed(1)),
      term2: Number(term2.toFixed(1)),
      term1: Number(term1.toFixed(1)),
      cumulative,
      avgWeighted,
      grade,
      position: r.pos || r.position || `${(idx * 3 + 7) % 40 + 1}th`,
      remark,
    };
  });

  const subjectOfferedCount = processedResults.length;
  const markObtainedSum = Number(processedResults.reduce((acc, curr) => acc + curr.total, 0).toFixed(2));
  const markObtainableSum = subjectOfferedCount * 100;
  const percentageOfMark = Number(((markObtainedSum / markObtainableSum) * 100).toFixed(2));

  const averageAnnualScore = Number((processedResults.reduce((acc, curr) => acc + curr.avgWeighted, 0) / subjectOfferedCount).toFixed(2));
  const promotionStatus = averageAnnualScore >= 50 ? 'Promoted' : averageAnnualScore >= 45 ? 'Promoted on Trial' : 'To Repeat';
  const headOfSchoolRemark = averageAnnualScore >= 70
    ? 'EXCELLENT PERFORMANCE, KEEP UP THE STELLAR STANDARD!'
    : averageAnnualScore >= 50
    ? 'GOOD PERFORMANCE, WITH MORE FOCUS AND CONSISTENCY YOU WILL EXCEL FURTHER.'
    : 'BELOW AVERAGE PERFORMANCE, PUT MORE EFFORT NEXT TERM';

  const handlePrint = () => {
    printDocument('printable-report-sheet', `${studentName} - Official Report Sheet`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-gray-300 print:border-0 print:shadow-none print:max-w-none print:w-full print:rounded-none">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="print:hidden bg-[#06452C] text-white px-4 sm:px-6 py-3.5 flex justify-between items-center border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <div>
              <span className="font-extrabold text-xs sm:text-sm tracking-wide block leading-tight">
                Official Student Report Sheet (Original Format)
              </span>
              <span className="text-[10px] text-emerald-200">
                New State High School — 36 Palm Avenue, Mushin, Lagos
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= 100% AUTHENTIC PRINTABLE REPORT SHEET ================= */}
        <div
          id="printable-report-sheet"
          className="p-5 sm:p-8 text-black bg-white print:p-2 print:m-0 font-sans leading-tight text-[11px] select-text"
          style={{ fontFamily: "'Arial', 'Segoe UI', sans-serif" }}
        >
          {/* 1. Header Section with School Logo & Details */}
          <div className="text-center relative pb-3 mb-2 border-b border-gray-300">
            <div className="absolute left-0 top-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <img
                src="/school-logo.png"
                alt="New State High School Crest"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            <div className="px-16">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-gray-900 uppercase">
                NEW STATE HIGH SCHOOL
              </h1>
              <p className="text-[11px] text-gray-700 font-medium leading-tight">
                36 Palm avenue, mushin Lagos
              </p>
              <p className="text-[10px] text-gray-600 font-medium leading-tight">
                (info@newstatehighschool.org)
              </p>
              <p className="text-[10px] text-gray-600 font-medium leading-tight">
                +234 (0) 7018001948
              </p>
              <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-gray-900 mt-1 uppercase">
                STUDENT REPORT SHEET
              </h2>
            </div>
          </div>

          {/* 2. Student & Session Information Grid */}
          <div className="border border-gray-400 mb-3 text-[10px] sm:text-[11px]">
            {/* Row 1 */}
            <div className="grid grid-cols-12 border-b border-gray-400 divide-x divide-gray-400">
              <div className="col-span-5 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">NAME:</strong>{' '}
                <span className="font-bold text-gray-900 uppercase">{studentName}</span>
              </div>
              <div className="col-span-4 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">ADMISSION NUMBER:</strong>{' '}
                <span className="font-mono font-bold text-gray-900">{admissionNo}</span>
              </div>
              <div className="col-span-3 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">GENDER:</strong>{' '}
                <span className="font-semibold text-gray-900">{studentGender}</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-12 border-b border-gray-400 divide-x divide-gray-400">
              <div className="col-span-4 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">CLASS:</strong>{' '}
                <span className="font-bold text-gray-900 uppercase">{studentClass}</span>
              </div>
              <div className="col-span-4 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">TERM:</strong>{' '}
                <span className="font-bold text-gray-900 uppercase">{termName}</span>
              </div>
              <div className="col-span-4 p-1.5 px-2 flex justify-between items-center">
                <div>
                  <strong className="text-gray-900 uppercase">YEAR:</strong>{' '}
                  <span className="font-bold text-gray-900">{sessionYear}</span>
                </div>
                <div className="px-2 py-0.5 border border-gray-400 rounded-xs text-[9px] font-bold text-gray-700 bg-gray-50 uppercase">
                  {studentName.split(' ')[0]}
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-12 border-b border-gray-400 divide-x divide-gray-400">
              <div className="col-span-4 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">AGE:</strong>{' '}
                <span className="font-semibold text-gray-900">{studentAge}</span>
              </div>
              <div className="col-span-4 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">CLASS AGE AVERAGE:</strong>{' '}
                <span className="text-gray-600">—</span>
              </div>
              <div className="col-span-4 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">NO. IN CLASS:</strong>{' '}
                <span className="font-bold text-gray-900">{classSize}</span>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-12 divide-x divide-gray-400">
              <div className="col-span-4 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">TIMES SCHOOL OPENED:</strong>{' '}
                <span className="font-semibold text-gray-900">0</span>
              </div>
              <div className="col-span-4 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">% TIMES PRESENT:</strong>{' '}
                <span className="font-semibold text-gray-900">0%</span>
              </div>
              <div className="col-span-4 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">POSITION:</strong>{' '}
                <span className="font-black text-gray-900">{classPosition}</span>
              </div>
            </div>
          </div>

          {/* 3. Main Subject Scores Table */}
          <div className="border border-gray-400 mb-2 overflow-x-auto">
            <table className="w-full text-left text-[9px] sm:text-[9.5px] border-collapse">
              <thead>
                {/* Top Grouped Header Row */}
                <tr className="bg-gray-100 text-gray-900 font-bold border-b border-gray-400 divide-x divide-gray-400 text-center">
                  <th rowSpan="2" className="p-1 px-1.5 text-left font-black uppercase w-24">SUBJECT</th>
                  <th colSpan="7" className="p-1 font-black uppercase bg-gray-200/80">3rd TERM</th>
                  <th rowSpan="2" className="p-1 font-black uppercase w-11">2nd TERM<br />100</th>
                  <th rowSpan="2" className="p-1 font-black uppercase w-11">1st TERM<br />100</th>
                  <th rowSpan="2" className="p-1 font-black uppercase w-14">CUMMULATIVE<br />300</th>
                  <th rowSpan="2" className="p-1 font-black uppercase w-16">AGGREGATE<br />WEIGHTED<br />AVERAGE</th>
                  <th rowSpan="2" className="p-1 font-black uppercase w-9">GRADE</th>
                  <th rowSpan="2" className="p-1 font-black uppercase w-11">POSITION</th>
                  <th rowSpan="2" className="p-1 font-black uppercase w-14">REMARK</th>
                </tr>
                {/* 3rd Term Sub-headers */}
                <tr className="bg-gray-50 text-gray-900 font-bold border-b border-gray-400 divide-x divide-gray-400 text-center text-[8.5px]">
                  <th className="p-1">FIRSTCA<br />10</th>
                  <th className="p-1">SECONDCA<br />10</th>
                  <th className="p-1">HOMEWORK<br />10</th>
                  <th className="p-1">PROJECT<br />10</th>
                  <th className="p-1">SUBJECTPARTICIPATION<br />10</th>
                  <th className="p-1">EXAM<br />50</th>
                  <th className="p-1 font-black bg-gray-100">TOTAL<br />100</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {processedResults.map((r, idx) => (
                  <tr key={idx} className="divide-x divide-gray-300 hover:bg-gray-50/50">
                    <td className="p-1 px-1.5 font-bold text-gray-900">{r.subject}</td>
                    <td className="p-1 text-center">{r.firstCa}</td>
                    <td className="p-1 text-center">{r.secondCa}</td>
                    <td className="p-1 text-center">{r.homework}</td>
                    <td className="p-1 text-center">{r.project}</td>
                    <td className="p-1 text-center">{r.participation}</td>
                    <td className="p-1 text-center">{r.exam}</td>
                    <td className="p-1 text-center font-bold bg-gray-50">{r.total}</td>
                    <td className="p-1 text-center">{r.term2}</td>
                    <td className="p-1 text-center">{r.term1}</td>
                    <td className="p-1 text-center font-semibold">{r.cumulative}</td>
                    <td className="p-1 text-center font-bold">{r.avgWeighted}</td>
                    <td className="p-1 text-center font-black">{r.grade}</td>
                    <td className="p-1 text-center">{r.position}</td>
                    <td className="p-1 text-center font-bold uppercase text-[8.5px]">{r.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Subject Summary Row */}
          <div className="border border-gray-400 grid grid-cols-4 divide-x divide-gray-400 p-1 px-2 mb-3 text-[10px] font-bold uppercase bg-gray-50">
            <div>
              SUBJECT OFFERED: <span className="font-black text-black">{subjectOfferedCount}</span>
            </div>
            <div>
              MARK OBTAINED: <span className="font-black text-black">{markObtainedSum}</span>
            </div>
            <div>
              MARK OBTAINABLE: <span className="font-black text-black">{markObtainableSum}</span>
            </div>
            <div>
              % OF MARK: <span className="font-black text-black">{percentageOfMark}%</span>
            </div>
          </div>

          {/* 5. Remarks & Principal Signature Grid */}
          <div className="border border-gray-400 mb-3 text-[10px]">
            {/* Class Teacher Remark */}
            <div className="p-1.5 px-2 border-b border-gray-400">
              <strong className="text-gray-900 uppercase">CLASS TEACHER'S REMARK:</strong>{' '}
              <span className="text-gray-700 italic ml-1">
                {studentName.split(' ')[0]} displays commendable diligence in classroom activities; keep working harder.
              </span>
            </div>

            {/* Head of School Remark with Principal signature */}
            <div className="p-1.5 px-2 border-b border-gray-400 flex justify-between items-center">
              <div>
                <strong className="text-gray-900 uppercase">HEAD OF SCHOOL REMARK:</strong>{' '}
                <span className="font-bold text-gray-900 uppercase ml-1">{headOfSchoolRemark}</span>
              </div>
              <div className="flex items-center gap-1.5 font-cursive text-[12px] text-gray-800 pr-2">
                <span className="text-[9px] text-gray-500 font-sans font-bold uppercase">Principal:</span>
                <span className="italic font-bold font-serif">O. Ogunlesi</span>
              </div>
            </div>

            {/* Next Term & Promotion Status */}
            <div className="grid grid-cols-12 divide-x divide-gray-400">
              <div className="col-span-6 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">NEXT TERM BEGINS:</strong>{' '}
                <span className="font-bold text-gray-900">14TH SEPTEMBER, 2026</span>
              </div>
              <div className="col-span-6 p-1.5 px-2">
                <strong className="text-gray-900 uppercase">PROMOTION STATUS:</strong>{' '}
                <span className="font-black text-gray-900 uppercase">{promotionStatus}</span>
              </div>
            </div>
          </div>

          {/* 6. SKILLS & BEHAVIOUR DUAL TABLES & OFFICIAL STAMP */}
          <div className="grid grid-cols-12 gap-3 relative">
            
            {/* Left Box: Skills 1-5 & Key to Ratings */}
            <div className="col-span-6 border border-gray-400 text-[9px]">
              {/* Header */}
              <div className="grid grid-cols-6 border-b border-gray-400 font-bold bg-gray-100 divide-x divide-gray-400 text-center">
                <div className="col-span-1 p-1 text-left uppercase">SKILLS 1-5</div>
                <div className="p-1">5</div>
                <div className="p-1">4</div>
                <div className="p-1">3</div>
                <div className="p-1">2</div>
                <div className="p-1">1</div>
              </div>
              {/* Fluency */}
              <div className="grid grid-cols-6 border-b border-gray-300 divide-x divide-gray-300 text-center">
                <div className="col-span-1 p-1 text-left font-semibold">Fluency</div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block bg-black"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
              </div>
              {/* Games */}
              <div className="grid grid-cols-6 border-b border-gray-300 divide-x divide-gray-300 text-center">
                <div className="col-span-1 p-1 text-left font-semibold">Games</div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block bg-black"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
              </div>
              {/* Musical Skills */}
              <div className="grid grid-cols-6 border-b border-gray-400 divide-x divide-gray-300 text-center">
                <div className="col-span-1 p-1 text-left font-semibold">Musical Skills</div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block bg-black"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
              </div>

              {/* Key to Ratings */}
              <div className="p-1.5 space-y-0.5 text-[8.5px] leading-tight">
                <strong className="block text-center uppercase font-bold text-gray-900 border-b border-gray-200 pb-0.5 mb-1">
                  KEY TO RATINGS
                </strong>
                <div><strong>5</strong> Maintains an excellent degree of observable traits</div>
                <div><strong>4</strong> Maintains high level of observable traits</div>
                <div><strong>3</strong> Maintains an acceptable level of observable traits</div>
                <div><strong>2</strong> Shows minimal level for observable traits</div>
                <div><strong>1</strong> Has no regards for observable traits</div>
              </div>
            </div>

            {/* Right Box: Behaviour 1-5 & Official School Seal Stamp */}
            <div className="col-span-6 border border-gray-400 text-[9px] flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="grid grid-cols-6 border-b border-gray-400 font-bold bg-gray-100 divide-x divide-gray-400 text-center">
                  <div className="col-span-1 p-1 text-left uppercase">BEHAVIOUR 1-5</div>
                  <div className="p-1">1</div>
                  <div className="p-1">2</div>
                  <div className="p-1">3</div>
                  <div className="p-1">4</div>
                  <div className="p-1">5</div>
                </div>
                {/* Punctuality */}
                <div className="grid grid-cols-6 border-b border-gray-300 divide-x divide-gray-300 text-center">
                  <div className="col-span-1 p-1 text-left font-semibold">Punctuality</div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block bg-black"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                </div>
                {/* Neatness */}
                <div className="grid grid-cols-6 border-b border-gray-300 divide-x divide-gray-300 text-center">
                  <div className="col-span-1 p-1 text-left font-semibold">Neatness</div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block bg-black"></span></div>
                </div>
                {/* Politeness */}
                <div className="grid grid-cols-6 border-b border-gray-300 divide-x divide-gray-300 text-center">
                  <div className="col-span-1 p-1 text-left font-semibold">Politeness</div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block bg-black"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                </div>
                {/* Self Control */}
                <div className="grid grid-cols-6 border-b border-gray-300 divide-x divide-gray-300 text-center">
                  <div className="col-span-1 p-1 text-left font-semibold">Self Control</div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block bg-black"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                  <div className="p-1 flex items-center justify-center"><span className="w-2.5 h-2.5 border border-gray-400 inline-block"></span></div>
                </div>
              </div>

              {/* Official Seal / Stamp at Bottom Right */}
              <div className="p-2 flex justify-end items-center pt-2">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-[#5B21B6] p-1.5 flex flex-col items-center justify-center text-center transform rotate-[-6deg] opacity-90 select-none pointer-events-none">
                  <div className="w-full h-full rounded-full border border-[#5B21B6] flex flex-col items-center justify-center p-1 bg-purple-50/20">
                    <span className="text-[7.5px] font-black text-[#5B21B6] tracking-tighter uppercase leading-none">
                      ★ NEW STATE HIGH SCHOOL ★
                    </span>
                    <div className="my-0.5 py-0.5 px-2 border-y border-[#5B21B6] w-full text-center">
                      <span className="font-serif italic font-bold text-[9.5px] text-[#4C1D95] block leading-none">
                        PRINCIPAL
                      </span>
                      <span className="text-[8px] font-black text-[#5B21B6] block leading-none mt-0.5 font-mono">
                        31/7/26
                      </span>
                    </div>
                    <span className="text-[6.5px] font-bold text-[#5B21B6] uppercase tracking-tighter leading-none">
                      36 Palm Avenue Mushin Lagos
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
