import React from 'react';
import { BookOpen, Scale, AlertCircle, CheckCircle, ArrowLeft, Clock, Award } from 'lucide-react';

export default function TermsOfAdmission({ onNavigate }) {
  return (
    <div className="bg-[#F8FAF9] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B5D3B] hover:text-[#06452C] mb-8 group transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Homepage</span>
        </button>

        {/* Header Hero */}
        <div className="bg-[#06452C] text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
            <Scale className="w-4 h-4" />
            <span>Academic Code & Enrolment Regulations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Terms of Admission & Code of Conduct
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
            Guidelines, fee payment schedules, attendance requirements, and disciplinary standards governing student enrolment at New State High School, Mushin, Lagos.
          </p>
          <div className="text-xs text-emerald-300/80 mt-6 pt-4 border-t border-emerald-800 flex items-center gap-4">
            <span>Motto: Domine Dirige Nos</span>
            <span>•</span>
            <span>2026/2027 Academic Session</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 space-y-10 text-gray-700 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1: Admission & Enrolment */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-[#06452C] flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <BookOpen className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>1. Admission & Screening Eligibility</span>
            </h2>
            <p>
              Provisional admission into Junior Secondary (JSS 1 – JSS 3) and Senior Secondary (SSS 1 – SSS 2) is subject to the candidate successfully passing the New State High School Internal Entrance Screening Examination and interview assessment.
            </p>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-gray-800 space-y-1.5">
              <p><strong>Day School Institution:</strong> New State High School operates strictly as a Day Secondary School. All students commute daily.</p>
              <p><strong>Verification of Credentials:</strong> The school reserves the right to withdraw provisional admission if primary school leaving certificates or transfer credentials are found to be fraudulent.</p>
            </div>
          </section>

          {/* Section 2: School Fees & Financial Policy */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-[#06452C] flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <Scale className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>2. Tuition Fees & Bursary Regulations</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Payment Deadline:</strong> All term fees must be settled in full on or before the second week of academic resumption.</span>
              </li>
              <li className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Official Receipts:</strong> Payments must be made via designated bank accounts or official bank drafts and verified by the Bursar on the school portal.</span>
              </li>
              <li className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Refund Policy:</strong> Caution deposits and tuition fees paid are non-refundable once the term has commenced.</span>
              </li>
            </ul>
          </section>

          {/* Section 3: Punctuality, Attendance & Uniform */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-[#06452C] flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>3. Attendance, Punctuality & Decorum</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
                <strong className="text-[#06452C] block">Daily Resumption Time:</strong>
                <p>Morning Assembly commences at exactly <strong>7:30 AM</strong> prompt. Gates close at 7:50 AM. Chronic tardiness will attract disciplinary sanctions.</p>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
                <strong className="text-[#06452C] block">Standard School Uniform:</strong>
                <p>Students must be impeccably dressed in the official school uniform, white socks, and clean black shoes at all times on campus.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Academic Integrity & Zero Tolerance for Malpractice */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-[#06452C] flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>4. Academic Honesty & Code of Conduct</span>
            </h2>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-black text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Zero Tolerance for Examination Malpractice & Bullying</span>
              </div>
              <p>
                New State High School maintains strict zero-tolerance for examination cheating, destruction of school property, fighting, insubordination, or bullying. Violations will result in immediate suspension or expulsion as determined by the Disciplinary Committee.
              </p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
