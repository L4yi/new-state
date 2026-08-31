import React, { useState } from 'react';
import { MapPin, Phone, Mail, Sparkles, Code } from 'lucide-react';
import DeveloperEasterEgg from './DeveloperEasterEgg';

export default function Footer({ onNavigate }) {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const handleNavClick = (page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    const nextCount = logoClickCount + 1;
    setLogoClickCount(nextCount);
    if (nextCount >= 3) {
      setShowEasterEgg(true);
      setLogoClickCount(0);
    }
  };

  return (
    <footer className="bg-green-dark text-white">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                onClick={handleLogoClick}
                title="Triple click for easter egg!"
                className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-white/10 p-1.5 rounded-xl border border-white/15 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <img 
                  src="/school-logo.png" 
                  alt="New State High School Crest" 
                  className="w-full h-full object-contain select-none" 
                />
              </div>
              <div>
                <div className="font-bold text-[14px]">New State High School</div>
                <div className="text-[11px] tracking-widest uppercase opacity-60">Mushin · Lagos</div>
              </div>
            </div>
            <p className="text-[14px] leading-relaxed opacity-70 mb-5">
              A premier private school in Mushin, Lagos State, dedicated to academic excellence, character development, and building leaders of tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[16px] mb-4 text-green-light">Quick Links</h4>
            <ul className="space-y-2 text-[14px] opacity-80">
              <li><button onClick={() => handleNavClick('about')} className="hover:text-green-light transition-colors">About NSHS</button></li>
              <li><button onClick={() => handleNavClick('academics')} className="hover:text-green-light transition-colors">Academics Curriculum</button></li>
              <li><button onClick={() => handleNavClick('admission')} className="hover:text-green-light transition-colors">Admission Process</button></li>
              <li><button onClick={() => handleNavClick('jamb-score-predictor')} className="hover:text-green-light transition-colors font-bold text-amber-300">JAMB Score Predictor</button></li>
              <li><button onClick={() => handleNavClick('facilities')} className="hover:text-green-light transition-colors">Facilities & Labs</button></li>
              <li><button onClick={() => handleNavClick('gallery')} className="hover:text-green-light transition-colors">School Gallery</button></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold text-[16px] mb-4 text-green-light">Information & Legal</h4>
            <ul className="space-y-2 text-[14px] opacity-80">
              <li><button onClick={() => handleNavClick('news')} className="hover:text-green-light transition-colors">News & Events</button></li>
              <li><button onClick={() => handleNavClick('contact')} className="hover:text-green-light transition-colors">Contact & Directions</button></li>
              <li><button onClick={() => handleNavClick('portal')} className="hover:text-green-light transition-colors">Student & Parent Portal</button></li>
              <li><button onClick={() => handleNavClick('exam-success')} className="hover:text-green-light transition-colors">WAEC & JAMB Success</button></li>
              <li><button onClick={() => handleNavClick('faq')} className="hover:text-green-light transition-colors font-bold text-amber-300">FAQ & Help Center</button></li>
              <li><button onClick={() => handleNavClick('privacy')} className="hover:text-green-light transition-colors">Privacy & Data Policy</button></li>
              <li><button onClick={() => handleNavClick('terms')} className="hover:text-green-light transition-colors">Terms of Admission</button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-[16px] mb-4 text-green-light">Contact Info</h4>
            <div className="space-y-3 text-[14px] opacity-80 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-green-light flex-shrink-0 mt-1" />
                <span>36 Palm Avenue, Mushin, Lagos State, Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-green-light flex-shrink-0" />
                <span>+234 813 400 0644</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-green-light flex-shrink-0" />
                <span>info@newstateschools.org</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-[13px] opacity-80 gap-4">
          <p>© {new Date().getFullYear()} New State High School. All rights reserved.</p>
          
          <div className="flex items-center gap-4 text-xs opacity-60">
            <button onClick={() => handleNavClick('privacy')} className="hover:underline cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => handleNavClick('terms')} className="hover:underline cursor-pointer">Terms of Admission</button>
            <span>•</span>
            <span onClick={() => setShowEasterEgg(true)} className="cursor-default select-none">Domine Dirige Nos</span>
          </div>
        </div>
      </div>

      {/* Developer Easter Egg Modal */}
      <DeveloperEasterEgg
        isOpen={showEasterEgg}
        onClose={() => setShowEasterEgg(false)}
      />
    </footer>
  );
}
