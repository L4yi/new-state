import React from 'react';
import {
  Printer, X, Award, CheckCircle2, ShieldCheck, Download,
  Star, Calendar, User, BookOpen, GraduationCap, MapPin, Phone, Mail, FileText
} from 'lucide-react';
import { printDocument } from '../../utils/printUtils';

export default function OfficialReportCardModal({ student, results, sessionInfo, onClose }) {
  const totalScore = results.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  const maxScore = results.length * 100;
  const averageScore = results.length > 0 ? (totalScore / results.length).toFixed(1) : '0.0';

  // Overall performance tier
  const getOverallGrade = (avg) => {
    const num = parseFloat(avg);
    if (num >= 75) return { grade: 'Distinction (A1)', text: 'Excellent & Outstanding Academic Performance' };
    if (num >= 65) return { grade: 'Very Good (B2 - B3)', text: 'Commendable Academic Performance' };
    if (num >= 50) return { grade: 'Credit (C4 - C6)', text: 'Satisfactory Academic Performance' };
    return { grade: 'Pass (D7 - E8)', text: 'Pass - Needs Diligent Improvement' };
  };

  const performanceTier = getOverallGrade(averageScore);

  const affectiveTraits = [
    { trait: 'Punctuality & Attendance', score: 5, remark: 'Always punctual' },
    { trait: 'Neatness & Personal Decorum', score: 5, remark: 'Exemplary uniform' },
    { trait: 'Honesty & Reliability', score: 5, remark: 'High integrity' },
    { trait: 'Politeness & Courtesy', score: 5, remark: 'Respectful to all' },
    { trait: 'Relationship with Teachers', score: 5, remark: 'Very cooperative' },
    { trait: 'Relationship with Peers', score: 4, remark: 'Friendly & helpful' },
    { trait: 'Attentiveness in Class', score: 5, remark: 'Deep concentration' },
    { trait: 'Leadership & Responsibility', score: 5, remark: 'Reliable prefect' },
    { trait: 'Perseverance & Diligence', score: 5, remark: 'Hardworking' },
    { trait: 'Self-Control & Discipline', score: 5, remark: 'Well behaved' },
  ];

  const psychomotorSkills = [
    { skill: 'Handwriting & Penmanship', score: 5, remark: 'Neat and legible' },
    { skill: 'Verbal Fluency & Diction', score: 4, remark: 'Articulate speaker' },
    { skill: 'Sports, Games & Athletics', score: 4, remark: 'Active participant' },
    { skill: 'Laboratory Practical Skills', score: 5, remark: 'Sharp dexterity' },
    { skill: 'ICT & AI Coding Skills', score: 5, remark: 'Advanced aptitude' },
    { skill: 'Handling of Workshop Tools', score: 4, remark: 'Careful & safe' },
  ];

  const handlePrint = () => {
    printDocument('printable-report-sheet', `${student?.name || 'Student'} - Official Terminal Report Card`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Report Sheet Container */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-gray-300 print:border-0 print:shadow-none print:max-w-none print:w-full print:rounded-none">
        
        {/* Top Control Bar (Hidden when Printing) */}
        <div className="print:hidden bg-[#06452C] text-white px-6 py-4 flex justify-between items-center border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-emerald-300" />
            <div>
              <span className="font-black text-sm sm:text-base tracking-wide block leading-tight">
                Official Continuous Assessment Dossier & Terminal Report Card
              </span>
              <span className="text-[10px] text-emerald-200 font-medium">
                Verified Digital Academic Transcript · Lagos State Ministry of Basic Education
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Official PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= Printable Nigerian Terminal Sheet ================= */}
        <div id="printable-report-sheet" className="p-4 sm:p-6 print:p-2 text-[#1B2521] space-y-3 bg-[#FCFCFA] print:p-0 print:m-0 print:text-black relative overflow-hidden">
          
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="font-serif font-black text-8xl sm:text-9xl text-emerald-950 rotate-[-30deg] tracking-widest uppercase">
              NEW STATE
            </span>
          </div>

          {/* 1. Official Header & Heraldry */}
          <div className="border-b-2 border-[#06452C] pb-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 p-1.5 bg-emerald-50 rounded-2xl border-2 border-emerald-300/80 flex-shrink-0 flex items-center justify-center shadow-sm">
              <img src="/school-logo.png" alt="School Crest Logo" className="w-full h-full object-contain" />
            </div>

            <div className="flex-grow space-y-0.5">
              <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#06452C]">
                Lagos State Ministry of Basic & Secondary Education
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#06452C] tracking-tight uppercase leading-none font-serif">
                NEW STATE HIGH SCHOOL
              </h1>
              <div className="text-[10px] font-black text-[#1B2521] tracking-wide">
                MOTTO: <span className="text-[#06452C] italic">DOMINE DIRIGE NOS</span> (LORD DIRECT US)
              </div>
              <p className="text-[10px] text-gray-600 leading-tight">
                36 Palm Avenue, Mushin, Lagos State, Nigeria · Tel: +234 813 400 0644 · Email: info@newstateschools.org
              </p>
              <div className="inline-flex items-center gap-1.5 pt-0.5 text-[9px] font-extrabold text-[#06452C] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span>Govt. Approved Comprehensive Secondary School</span>
                <span>•</span>
                <span>WAEC & NECO Center No: 0481903</span>
              </div>
            </div>

            <div className="text-center sm:text-right flex-shrink-0 border-t sm:border-t-0 sm:border-l border-gray-200 pt-1.5 sm:pt-0 sm:pl-3 space-y-0.5">
              <span className="inline-block px-2.5 py-0.5 bg-[#06452C] text-white text-[10px] font-black rounded uppercase tracking-wider shadow-sm">
                TERMINAL REPORT SHEET
              </span>
              <div className="text-[11px] font-extrabold text-[#1B2521]">{sessionInfo?.currentTerm || 'FIRST TERM'}</div>
              <div className="text-[10px] text-gray-600 font-bold">{sessionInfo?.currentSession || '2026/2027'} SESSION</div>
            </div>
          </div>

          {/* 2. Comprehensive Student Bio-Data & Attendance Grid */}
          <div className="bg-white rounded-xl p-2.5 border border-gray-300 space-y-1.5 text-xs relative z-10 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Student Full Name</span>
                <span className="font-black text-[#1B2521] text-xs uppercase">{student.name}</span>
              </div>

              <div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Admission Number</span>
                <span className="font-extrabold text-green-primary font-mono text-xs">{student.id}</span>
              </div>

              <div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Class & Stream</span>
                <span className="font-extrabold text-[#1B2521] text-xs">{student.class}</span>
              </div>

              <div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">House</span>
                <span className="font-extrabold text-[#1B2521] text-xs">{student.house}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1.5 border-t border-gray-200 text-[10px]">
              <div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Gender / Age</span>
                <span className="font-semibold text-gray-800">{student.gender || 'Male'} · 16 Yrs</span>
              </div>

              <div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Blood / Genotype</span>
                <span className="font-semibold text-gray-800">{student.bloodGroup || 'O+'} · {student.genotype || 'AA'}</span>
              </div>

              <div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Class Size</span>
                <span className="font-semibold text-gray-800">38 Students</span>
              </div>

              <div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">School Opened</span>
                <span className="font-semibold text-gray-800">110 Days</span>
              </div>

              <div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Days Present</span>
                <span className="font-bold text-green-primary">108 (98.2%)</span>
              </div>

              <div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Position</span>
                <span className="font-black text-white bg-[#06452C] px-1.5 py-0.5 rounded text-[9px]">1st / 38</span>
              </div>
            </div>
          </div>

          {/* 3. Cognitive Domain Assessment Ledger */}
          <div className="space-y-1 relative z-10">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-[11px] uppercase tracking-wider text-[#06452C] flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-[#06452C]" />
                <span>Cognitive Academic Performance Ledger (Subject Scores)</span>
              </h3>
              <span className="text-[9px] font-bold text-gray-500">Subjects Recorded: {results.length}</span>
            </div>

            <div className="overflow-x-auto border-2 border-gray-300 rounded-lg bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#06452C] text-white font-black border-b border-gray-300 text-[9px] uppercase">
                    <th className="p-1.5">Subject Title</th>
                    <th className="p-1.5 text-center">CA1 (20)</th>
                    <th className="p-1.5 text-center">CA2 (20)</th>
                    <th className="p-1.5 text-center">Exam (60)</th>
                    <th className="p-1.5 text-center font-black">Total (100)</th>
                    <th className="p-1.5 text-center">Grade</th>
                    <th className="p-1.5 text-center">High</th>
                    <th className="p-1.5 text-center">Low</th>
                    <th className="p-1.5">Teacher Remark</th>
                    <th className="p-1.5 text-center">Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-[10px]">
                  {results.map((r, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFCFA]'}>
                      <td className="p-1.5 font-bold text-[#1B2521]">{r.subject}</td>
                      <td className="p-1.5 text-center text-gray-700 font-semibold">{r.ca1}</td>
                      <td className="p-1.5 text-center text-gray-700 font-semibold">{r.ca2}</td>
                      <td className="p-1.5 text-center text-gray-700 font-semibold">{r.exam}</td>
                      <td className="p-1.5 text-center font-black text-green-primary text-[11px]">{r.total}</td>
                      <td className="p-1.5 text-center font-bold">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                          r.grade === 'A1' ? 'bg-green-100 text-green-800 border border-green-300' :
                          r.grade.startsWith('B') ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {r.grade}
                        </span>
                      </td>
                      <td className="p-1.5 text-center text-gray-600 font-medium">{Math.min(98, (Number(r.total) || 80) + 3)}</td>
                      <td className="p-1.5 text-center text-gray-600 font-medium">45</td>
                      <td className="p-1.5 text-gray-700 font-medium italic text-[9px]">{r.remark}</td>
                      <td className="p-1.5 text-center text-[8px] text-gray-400 font-bold">✓ Signed</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 border-t-2 border-[#06452C] font-black text-[10px]">
                    <td className="p-1.5 text-[#06452C] font-black uppercase">CUMULATIVE TOTAL</td>
                    <td colSpan="3" className="p-1.5 text-right text-gray-500 font-semibold text-[9px]">
                      Max Obtainable: {maxScore}
                    </td>
                    <td className="p-1.5 text-center text-[#06452C] text-xs font-black">{totalScore}</td>
                    <td colSpan="5" className="p-1.5 text-right font-bold text-[#1B2521]">
                      Overall Terminal Average: <span className="text-[#06452C] text-xs font-black">{averageScore}%</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 4. Dual Matrix: Affective + Psychomotor Domains */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs relative z-10">
            {/* Affective Character Assessment */}
            <div className="p-2 rounded-lg border border-gray-300 bg-white space-y-1 shadow-sm">
              <h4 className="font-black text-[9px] text-[#06452C] uppercase tracking-wider flex items-center justify-between border-b border-gray-200 pb-0.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#06452C]" />
                  Affective Domain (Character & Behavior)
                </span>
                <span className="text-[8px] text-gray-400 font-normal">Rating Key (1 - 5)</span>
              </h4>

              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px]">
                {affectiveTraits.map((t, idx) => (
                  <div key={idx} className="flex justify-between items-center py-0.5 border-b border-gray-100">
                    <span className="text-gray-700 font-medium truncate">{t.trait}</span>
                    <span className="font-black text-[#06452C] bg-emerald-100 px-1 rounded text-[8px]">{t.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Psychomotor Skills Assessment */}
            <div className="p-2 rounded-lg border border-gray-300 bg-white space-y-1 shadow-sm">
              <h4 className="font-black text-[9px] text-[#06452C] uppercase tracking-wider flex items-center justify-between border-b border-gray-200 pb-0.5">
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#06452C]" />
                  Psychomotor Domain (Practical Skills)
                </span>
                <span className="text-[8px] text-gray-400 font-normal">Rating Key (1 - 5)</span>
              </h4>

              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px]">
                {psychomotorSkills.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center py-0.5 border-b border-gray-100">
                    <span className="text-gray-700 font-medium truncate">{s.skill}</span>
                    <span className="font-black text-blue-900 bg-blue-100 px-1 rounded text-[8px]">{s.score}</span>
                  </div>
                ))}
              </div>

              {/* Rating Scale Legend */}
              <div className="pt-1 border-t border-gray-200 text-[8px] text-gray-500 flex justify-between font-semibold">
                <span>5 - Excellent</span>
                <span>4 - Very Good</span>
                <span>3 - Good</span>
                <span>2 - Fair</span>
                <span>1 - Poor</span>
              </div>
            </div>
          </div>

          {/* 5. WAEC/NECO Grade Scale & Academic Summary */}
          <div className="p-1.5 rounded-lg border border-gray-300 bg-white text-[8px] grid grid-cols-3 sm:grid-cols-6 gap-1 text-center font-bold relative z-10 shadow-sm">
            <div className="p-0.5 rounded bg-green-100 text-green-900 border border-green-300">75-100% : A1 (Distinction)</div>
            <div className="p-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">70-74% : B2 (Very Good)</div>
            <div className="p-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">65-69% : B3 (Good)</div>
            <div className="p-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">60-64% : C4 (Credit)</div>
            <div className="p-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">55-59% : C5 (Credit)</div>
            <div className="p-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">50-54% : C6 (Credit)</div>
          </div>

          {/* 6. Form Teacher's & Principal's Endorsements with Official Stamp */}
          <div className="border-t-2 border-gray-300 pt-2 space-y-2 text-xs relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
              
              {/* Form Teacher Box */}
              <div className="p-2 rounded-lg border border-gray-300 bg-white space-y-1 shadow-sm">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">
                  Form Teacher's Sign-off
                </span>
                <p className="font-semibold italic text-[#1B2521] text-[10px] leading-tight">
                  "Outstanding academic mastery across all subjects. Highly disciplined and a worthy class leader."
                </p>
                <div className="pt-0.5 flex justify-between items-center text-[9px] text-gray-500 border-t border-gray-200">
                  <span className="font-bold text-gray-800">Mr. B. Ogunlesi</span>
                  <span className="font-serif italic font-black text-green-primary text-[10px] underline">B. Ogunlesi</span>
                </div>
              </div>

              {/* Official Institutional Stamp */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-800 flex flex-col items-center justify-center text-center p-1 transform -rotate-6 text-[#06452C] bg-emerald-50/60 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#06452C]" />
                  <span className="text-[6px] font-black tracking-tighter uppercase leading-none mt-0.5">NEW STATE HIGH SCHOOL</span>
                  <span className="text-[6px] font-bold text-red-700 tracking-widest font-mono">★ CERTIFIED ★</span>
                  <span className="text-[5px] font-extrabold uppercase leading-none">ACADEMIC BOARD</span>
                </div>
              </div>

              {/* Principal Box */}
              <div className="p-2 rounded-lg border border-gray-300 bg-white space-y-1 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                    Principal's Remark
                  </span>
                  <span className="text-[8px] font-bold text-green-primary">★ Promoted</span>
                </div>
                <p className="font-semibold italic text-[#1B2521] text-[10px] leading-tight">
                  "Brilliant performance. Promoted with Distinction to the next academic level."
                </p>
                <div className="pt-0.5 flex justify-between items-center text-[9px] text-gray-500 border-t border-gray-200">
                  <span className="font-bold text-gray-800">Dr. O. A. Adeleke</span>
                  <span className="font-serif italic font-black text-[#06452C] text-[10px] underline">O.A. Adeleke</span>
                </div>
              </div>
            </div>

            {/* Resumption & Fees Notice Bar */}
            <div className="p-2 rounded-lg bg-[#06452C] text-white flex flex-col sm:flex-row justify-between items-center gap-1.5 text-[10px] font-bold shadow-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                <span>Next Term Resumption Date:</span>
              </div>
              <span className="text-emerald-300 font-black tracking-wider">
                Monday, September 14, 2026 (8:00 AM Prompt)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
