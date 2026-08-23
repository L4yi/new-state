import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy({ onNavigate }) {
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
            <ShieldCheck className="w-4 h-4" />
            <span>NDPR & Child Data Protection Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Privacy & Student Data Protection Policy
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
            New State High School is committed to safeguarding the personal bio-data, academic records, and privacy rights of our students, guardians, and teaching staff in accordance with the Nigeria Data Protection Act (NDPA).
          </p>
          <div className="text-xs text-emerald-300/80 mt-6 pt-4 border-t border-emerald-800 flex items-center gap-4">
            <span>Effective Date: Academic Session 2026/2027</span>
            <span>•</span>
            <span>Last Updated: August 2026</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 space-y-10 text-gray-700 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-[#06452C] flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When prospective candidates apply for admission or enrolled students use the New State High School digital portal, we collect essential educational records including:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Student Bio-Data:</strong> Full legal name, date of birth, gender, state of origin, passport photographs, and primary school records.</span>
              </li>
              <li className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Parent / Guardian Info:</strong> Verified phone numbers, home addresses in Lagos, email contacts, and emergency contact details.</span>
              </li>
              <li className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Academic & Examination Records:</strong> Continuous assessments (CA1/CA2), terminal exam scores, attendance statistics, and WAEC/BECE registration dossiers.</span>
              </li>
              <li className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Payment Records:</strong> Tuition receipts, bank transaction references, and bursary verification timestamps. (No raw credit card numbers are stored).</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-[#06452C] flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <Eye className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>2. How We Use & Protect Your Information</span>
            </h2>
            <p>
              All student data is strictly utilized for academic administration, Ministry of Basic Education reporting, examination registration (WAEC, NECO, BECE, JAMB), and secure terminal report generation.
            </p>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-600 space-y-2">
              <p><strong>Strict Anti-Disclosure Guarantee:</strong> We do NOT sell, lease, or monetize student or guardian information to any third-party marketing agencies or advertisers under any circumstances.</p>
              <p><strong>Encryption & Access Controls:</strong> All portal communications are transmitted over 256-bit SSL/TLS encryption. Portal accounts are secured with role-based JWT authentication and brute-force rate limiters.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-[#06452C] flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>3. Guardian Rights & Contacting the Data Protection Officer</span>
            </h2>
            <p>
              Parents and guardians retain the right to inspect, update, or request the correction of any student record by submitting a written request to the school administrative registry.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 text-xs sm:text-sm font-medium">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex-1">
                <span className="text-xs text-gray-500 font-bold uppercase block">Campus Registry</span>
                <span className="font-bold text-[#06452C]">36 Palm Avenue, Mushin, Lagos State</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex-1">
                <span className="text-xs text-gray-500 font-bold uppercase block">Data Privacy Inquiries</span>
                <span className="font-bold text-[#06452C]">privacy@newstateschools.org · +234 813 400 0644</span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
