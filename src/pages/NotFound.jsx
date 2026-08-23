import React from 'react';
import { Home, Search, BookOpen, GraduationCap, Phone, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound({ onNavigate }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAF9] px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-[#06452C] font-black text-xs uppercase tracking-widest border border-emerald-300 shadow-sm">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>Page Not Found · Error 404</span>
        </div>

        {/* Big 404 Visual */}
        <div className="relative">
          <h1 className="text-8xl sm:text-9xl font-black text-[#06452C] tracking-tighter font-serif select-none opacity-90">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm sm:text-base font-bold bg-[#06452C] text-emerald-200 px-4 py-1 rounded-full shadow-lg border border-emerald-600">
              Campus Link Not Found
            </span>
          </div>
        </div>

        {/* Explanatory Text */}
        <div className="space-y-3 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2521]">
            We Couldn't Find That Page
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            The page you are looking for might have been relocated, renamed, or is temporarily unavailable. Let us guide you back to the right place.
          </p>
        </div>

        {/* Quick Route Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
          <button
            onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <Home className="w-5 h-5 text-emerald-700 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-gray-900">Main Campus Home</div>
            <div className="text-[11px] text-gray-500">Return to landing page</div>
          </button>

          <button
            onClick={() => { onNavigate('admission'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <GraduationCap className="w-5 h-5 text-emerald-700 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-gray-900">Online Admissions</div>
            <div className="text-[11px] text-gray-500">2026/2027 Enrolment</div>
          </button>

          <button
            onClick={() => { onNavigate('portal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <BookOpen className="w-5 h-5 text-emerald-700 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-gray-900">School Portal</div>
            <div className="text-[11px] text-gray-500">Student & Staff Login</div>
          </button>
        </div>

        {/* Contact Hotline */}
        <div className="pt-4 border-t border-gray-200 max-w-sm mx-auto flex items-center justify-center gap-2 text-xs text-gray-500">
          <Phone className="w-4 h-4 text-emerald-700" />
          <span>Need help? Call the Registry: </span>
          <a href="tel:+2348134000644" className="font-bold text-[#06452C] hover:underline">
            +234 813 400 0644
          </a>
        </div>

      </div>
    </div>
  );
}
