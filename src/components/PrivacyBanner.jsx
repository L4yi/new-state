import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function PrivacyBanner({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('nshs_privacy_consent');
    if (!consent) {
      // Show after 1.5s delay so page loads smoothly
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nshs_privacy_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Privacy notice" className="fixed bottom-14 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 bg-[#06452C] text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 backdrop-blur-lg animate-in fade-in slide-in-from-bottom-5 duration-300 print:hidden">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        
        <div className="flex-grow space-y-2 text-xs text-emerald-100">
          <p className="leading-relaxed">
            We use secure local session storage to protect student records and provide official portal services in compliance with NDPR data guidelines.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleAccept}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs transition-all shadow-sm active:scale-95"
            >
              Accept & Continue
            </button>
            <button
              onClick={() => {
                onNavigate('privacy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-emerald-300 hover:underline font-semibold text-[11px]"
            >
              Learn More →
            </button>
          </div>
        </div>

        <button
          onClick={handleAccept}
          className="text-emerald-400 hover:text-white p-1 rounded-lg transition-colors flex-shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
