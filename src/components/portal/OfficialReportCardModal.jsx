import React from 'react';
import {
  Printer, X, Award, CheckCircle2, ShieldCheck, Download,
  Star, Calendar, User, BookOpen, GraduationCap, MapPin, Phone, Mail
} from 'lucide-react';

export default function OfficialReportCardModal({ student, results, sessionInfo, onClose }) {
  const totalScore = results.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  const maxScore = results.length * 100;
  const averageScore = results.length > 0 ? (totalScore / results.length).toFixed(1) : '0.0';

  // Calculate overall performance tier
  const getOverallGrade = (avg) => {
    const num = parseFloat(avg);
    if (num >= 75) return { grade: 'Distinction (A1)', text: 'Outstanding Academic Performance' };
    if (num >= 65) return { grade: 'Very Good (B2)', text: 'Commendable Academic Performance' };
    if (num >= 50) return { grade: 'Credit (C4-C6)', text: 'Satisfactory Academic Performance' };
    return { grade: 'Pass (D7-E8)', text: 'Needs Significant Improvement' };
  };

  const performanceTier = getOverallGrade(averageScore);

  const psychomotorSkills = [
    { trait: 'Punctuality & Regularity', rating: 5, remark: 'Always on time' },
    { trait: 'Neatness & Decorum', rating: 5, remark: 'Impeccable uniform' },
    { trait: 'Honesty & Integrity', rating: 5, remark: 'Trustworthy' },
    { trait: 'Attentiveness & Focus', rating: 4, remark: 'Very attentive' },
    { trait: 'Leadership & Teamwork', rating: 5, remark: 'Exemplary prefect' },
    { trait: 'Sports & Physical Health', rating: 4, remark: 'Active athlete' },
    { trait: 'Artistic / Digital Skills', rating: 5, remark: 'Coding champion' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-2 sm:p-4">
      {/* Container with print-specific isolation */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-gray-200">
        {/* Top Floating Action Bar (Hidden during Print) */}
        <div className="print:hidden bg-[#06452C] text-white px-6 py-4 flex justify-between items-center border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-300" />
            <span className="font-extrabold text-sm sm:text-base tracking-wide">
              Official Terminal Student Report Card (Verified)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Sheet Document */}
        <div id="printable-report-sheet" className="p-6 sm:p-10 text-[#1B2521] space-y-6 bg-white print:p-0 print:m-0">
          {/* 1. Official Header & Crest */}
          <div className="border-b-2 border-[#06452C] pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 p-2 bg-emerald-50 rounded-2xl border border-emerald-200 flex-shrink-0 flex items-center justify-center">
              <img src="/school-logo.png" alt="New State High School Crest" className="w-full h-full object-contain" />
            </div>

            <div className="flex-grow space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#06452C] tracking-tight uppercase">
                New State High School, Mushin
              </h1>
              <div className="text-[11px] sm:text-xs font-bold text-gray-600 tracking-wider">
                MOTTO: <span className="text-[#06452C] italic">DOMINE DIRIGE NOS</span> (LORD DIRECT US)
              </div>
              <p className="text-[11px] text-gray-500 max-w-lg leading-relaxed">
                36 Palm Avenue, Mushin, Lagos State · Tel: +234 813 400 0644 · Email: info@newstateschools.org
              </p>
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest pt-0.5">
                Govt. Approved · WAEC & NECO Examination Center No: 0481903
              </div>
            </div>

            <div className="text-center sm:text-right flex-shrink-0 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-4">
              <span className="inline-block px-3 py-1 bg-[#06452C] text-white text-xs font-black rounded-lg uppercase tracking-wider mb-1">
                Official Report
              </span>
              <div className="text-xs font-extrabold text-[#1B2521]">{sessionInfo?.currentTerm || 'First Term'}</div>
              <div className="text-[11px] text-gray-500 font-semibold">{sessionInfo?.currentSession || '2026/2027'}</div>
            </div>
          </div>

          {/* 2. Student Demographic Profile Box */}
          <div className="bg-[#F8FAFA] rounded-2xl p-4 sm:p-5 border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Student Full Name</span>
              <span className="font-black text-[#1B2521] text-sm">{student.name}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Admission Number</span>
              <span className="font-extrabold text-green-primary">{student.id}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Class & Arm</span>
              <span className="font-extrabold text-[#1B2521]">{student.class}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">House</span>
              <span className="font-extrabold text-[#1B2521]">{student.house}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Gender / Age</span>
              <span className="font-bold text-gray-700">{student.gender || 'Male'} · 16 Yrs</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Class Population</span>
              <span className="font-bold text-gray-700">38 Students</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Attendance Summary</span>
              <span className="font-bold text-green-primary">108 / 110 Days (98.2%)</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Class Position</span>
              <span className="font-black text-white bg-green-primary px-2 py-0.5 rounded text-[11px]">1st in Class</span>
            </div>
          </div>

          {/* 3. Cognitive Assessment / Subject Grades Table */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-wider text-[#06452C] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Cognitive Academic Assessment Ledger</span>
              </h3>
              <span className="text-[10px] font-bold text-gray-400">Total Subjects Offered: {results.length}</span>
            </div>

            <div className="overflow-x-auto border border-gray-300 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#06452C] text-white font-bold border-b border-gray-300 text-[11px]">
                    <th className="p-2.5">Subject</th>
                    <th className="p-2.5 text-center">CA 1 (20)</th>
                    <th className="p-2.5 text-center">CA 2 (20)</th>
                    <th className="p-2.5 text-center">Exam (60)</th>
                    <th className="p-2.5 text-center font-black">Total (100)</th>
                    <th className="p-2.5 text-center">Grade</th>
                    <th className="p-2.5">Teacher Remark</th>
                    <th className="p-2.5 text-center">Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((r, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFCFA]'}>
                      <td className="p-2.5 font-bold text-[#1B2521]">{r.subject}</td>
                      <td className="p-2.5 text-center text-gray-600 font-semibold">{r.ca1}</td>
                      <td className="p-2.5 text-center text-gray-600 font-semibold">{r.ca2}</td>
                      <td className="p-2.5 text-center text-gray-600 font-semibold">{r.exam}</td>
                      <td className="p-2.5 text-center font-black text-green-primary text-sm">{r.total}</td>
                      <td className="p-2.5 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                          r.grade === 'A1' ? 'bg-green-100 text-green-800' :
                          r.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {r.grade}
                        </span>
                      </td>
                      <td className="p-2.5 text-gray-700 font-medium italic text-[11px]">{r.remark}</td>
                      <td className="p-2.5 text-center text-[10px] text-gray-400 font-bold">✓ Ok</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 border-t-2 border-green-primary font-black text-xs">
                    <td className="p-3 text-green-primary font-black uppercase">Cumulative Aggregate</td>
                    <td colSpan="3" className="p-3 text-right text-gray-500 font-semibold">Total Obtainable: {maxScore}</td>
                    <td className="p-3 text-center text-green-primary text-base font-black">{totalScore}</td>
                    <td colSpan="3" className="p-3 text-right font-bold text-[#1B2521]">
                      Overall Average: <span className="text-green-primary text-base font-black">{averageScore}%</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 4. Dual Matrix: Affective/Psychomotor Skills + WAEC/NECO Grade Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Affective & Psychomotor Domain */}
            <div className="p-4 rounded-xl border border-gray-200 bg-[#FAFCFA] space-y-2">
              <h4 className="font-extrabold text-xs text-[#06452C] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Affective & Behavioral Assessment</span>
              </h4>
              <div className="space-y-1 text-[11px]">
                {psychomotorSkills.map((sk, idx) => (
                  <div key={idx} className="flex justify-between items-center py-0.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700 font-medium">{sk.trait}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500 text-xs">{'★'.repeat(sk.rating)}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">({sk.rating}/5)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grading Scale & Performance Summary */}
            <div className="p-4 rounded-xl border border-gray-200 bg-[#FAFCFA] space-y-3">
              <h4 className="font-extrabold text-xs text-[#06452C] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Grading Key & Academic Standing</span>
              </h4>

              <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
                <div className="p-1 rounded bg-green-50 text-green-800 font-bold">75-100%: A1 (Dist.)</div>
                <div className="p-1 rounded bg-blue-50 text-blue-800 font-bold">70-74%: B2 (V.Good)</div>
                <div className="p-1 rounded bg-blue-50 text-blue-800 font-bold">65-69%: B3 (Good)</div>
                <div className="p-1 rounded bg-amber-50 text-amber-800 font-bold">60-64%: C4 (Credit)</div>
                <div className="p-1 rounded bg-amber-50 text-amber-800 font-bold">55-59%: C5 (Credit)</div>
                <div className="p-1 rounded bg-amber-50 text-amber-800 font-bold">50-54%: C6 (Credit)</div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-100/60 border border-emerald-300/60 text-xs">
                <span className="font-bold text-[#06452C]">Standing: </span>
                <span className="font-black text-[#06452C]">{performanceTier.grade}</span>
                <p className="text-[11px] text-gray-600 mt-0.5">{performanceTier.text}</p>
              </div>
            </div>
          </div>

          {/* 5. Teacher Remarks & Official Endorsement Signatures */}
          <div className="border-t-2 border-gray-200 pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Form Teacher's Remark</span>
                <p className="font-semibold italic text-[#1B2521]">
                  "An exemplary, hardworking, and disciplined student who shows great leadership in the science track."
                </p>
                <div className="pt-2 flex justify-between items-center text-[10px] text-gray-500">
                  <span className="font-bold text-gray-700">Mr. Babatunde Ogunlesi</span>
                  <span className="italic font-serif text-green-primary text-xs underline">B. Ogunlesi</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Principal's Decision & Stamp</span>
                <p className="font-semibold italic text-[#1B2521]">
                  "Promoted with Distinction to the next academic level. Keep up the high standard."
                </p>
                <div className="pt-2 flex justify-between items-center text-[10px] text-gray-500">
                  <span className="font-bold text-gray-700">Dr. O. A. Adeleke (Ph.D)</span>
                  <div className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 text-[9px] uppercase tracking-widest">
                    <CheckCircle2 className="w-2.5 h-2.5 text-green-primary" />
                    <span>Official Stamp</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumption Banner */}
            <div className="p-3 rounded-xl bg-[#06452C] text-white flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-bold">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-300" />
                <span>Next Term Resumption Date:</span>
              </div>
              <span className="text-emerald-300 font-extrabold tracking-wider">
                Monday, September 14, 2026 (8:00 AM Prompt)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
