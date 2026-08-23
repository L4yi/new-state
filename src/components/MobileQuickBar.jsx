import React from 'react';
import { Phone, GraduationCap, MessageCircle } from 'lucide-react';

export default function MobileQuickBar({ onNavigate, currentPage }) {
  // Hide on portal view to give students/teachers full canvas
  if (currentPage === 'portal') return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] print:hidden">
      <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
        
        {/* Direct Call Button */}
        <a
          href="tel:+2348134000644"
          className="flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black transition-all active:scale-95 border border-gray-300"
        >
          <Phone className="w-4 h-4 text-[#06452C]" />
          <span>Call Campus</span>
        </a>

        {/* WhatsApp Direct Admissions Inquiries */}
        <a
          href="https://wa.me/2348134000644?text=Hello%20New%20State%20High%20School%2C%20I%20would%20like%20to%20inquire%20about%20admissions%20and%20enrolment."
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] min-w-[44px] px-3 flex items-center justify-center rounded-xl bg-[#25D366] text-white hover:bg-[#20ba59] transition-all active:scale-95 shadow-sm"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
        </a>

        {/* Instant Apply Online CTA */}
        <button
          onClick={() => {
            onNavigate('admission');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex-[1.4] min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-[#06452C] hover:bg-[#0B5D3B] text-white text-xs font-black transition-all active:scale-95 shadow-md shadow-emerald-950/20"
        >
          <GraduationCap className="w-4 h-4 text-emerald-300" />
          <span>Apply Online</span>
        </button>

      </div>
    </div>
  );
}
