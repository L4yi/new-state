import React from 'react';
import { Home, BookOpen, GraduationCap, Phone, ArrowLeft, ArrowRight } from 'lucide-react';

export default function NotFound({ onNavigate }) {
  const handleNav = (page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#F8FAF9] px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-xl w-full text-center space-y-8">
        
        {/* School Crest Emblem */}
        <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-2xl border-2 border-emerald-200/80 p-2.5 flex items-center justify-center shadow-sm">
          <img 
            src="/school-logo.png" 
            alt="New State High School Crest" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Clean Typography */}
        <div className="space-y-2">
          <div className="text-6xl sm:text-7xl font-black text-[#06452C] font-serif tracking-tight leading-none">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2521] tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed pt-1">
            The campus page or resource you are looking for might have been moved or is no longer available.
          </p>
        </div>

        {/* Primary Return Home Button */}
        <div>
          <button
            onClick={() => handleNav('home')}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#06452C] hover:bg-[#0B5D3B] text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
        </div>

        {/* Fast Route Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 text-left">
          <button
            onClick={() => handleNav('admission')}
            className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#06452C] flex items-center justify-center flex-shrink-0 group-hover:bg-[#06452C] group-hover:text-white transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-gray-900">Online Admissions</div>
                <div className="text-[11px] text-gray-500">2026/2027 Enrolment</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#06452C] group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => handleNav('portal')}
            className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#06452C] flex items-center justify-center flex-shrink-0 group-hover:bg-[#06452C] group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-gray-900">School Portal</div>
                <div className="text-[11px] text-gray-500">Student & Staff Login</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#06452C] group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Registry Contact Bar */}
        <div className="pt-6 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-center gap-2">
          <Phone className="w-4 h-4 text-[#06452C]" />
          <span>Need help? Call Registry:</span>
          <a href="tel:+2348134000644" className="font-bold text-[#06452C] hover:underline">
            +234 813 400 0644
          </a>
        </div>

      </div>
    </div>
  );
}
