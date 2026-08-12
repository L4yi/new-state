import React from 'react';

export default function Footer({ onNavigate }) {
  const handleNavClick = (page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-green-dark text-white">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-accent">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <path
                    d="M14 3L5 7v7c0 5.25 3.85 10.15 9 11.35C19.15 24.15 23 19.25 23 14V7L14 3Z"
                    fill="white"
                    opacity="0.9"
                  />
                  <path
                    d="M10 14l2.5 2.5L18 11"
                    stroke="#0B5D3B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-[14px]">New State High School</div>
                <div className="text-[11px] tracking-widest uppercase opacity-60">Mushin · Lagos</div>
              </div>
            </div>
            <p className="text-[14px] leading-relaxed opacity-70 mb-5">
              A premier private secondary school in Mushin, Lagos State, dedicated to academic excellence, discipline, and building leaders of tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[16px] mb-4 text-green-light">Quick Links</h4>
            <ul className="space-y-2 text-[14px] opacity-80">
              <li><button onClick={() => handleNavClick('about')} className="hover:text-green-light transition-colors">About NSHS</button></li>
              <li><button onClick={() => handleNavClick('academics')} className="hover:text-green-light transition-colors">Academics Curriculum</button></li>
              <li><button onClick={() => handleNavClick('admission')} className="hover:text-green-light transition-colors">Admission Process</button></li>
              <li><button onClick={() => handleNavClick('facilities')} className="hover:text-green-light transition-colors">Facilities & Labs</button></li>
              <li><button onClick={() => handleNavClick('gallery')} className="hover:text-green-light transition-colors">School Gallery</button></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold text-[16px] mb-4 text-green-light">Information</h4>
            <ul className="space-y-2 text-[14px] opacity-80">
              <li><button onClick={() => handleNavClick('news')} className="hover:text-green-light transition-colors">News & Events</button></li>
              <li><button onClick={() => handleNavClick('contact')} className="hover:text-green-light transition-colors">Contact & Directions</button></li>
              <li><a href="#portal" className="hover:text-green-light transition-colors">Student & Parent Portal</a></li>
              <li><a href="#calendar" className="hover:text-green-light transition-colors">Academic Calendar</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-[16px] mb-4 text-green-light">Contact Info</h4>
            <div className="space-y-3 text-[14px] opacity-80 leading-relaxed">
              <p>📍 12/14 Palm Avenue, Mushin, Lagos State, Nigeria</p>
              <p>📞 +234 803 000 0000</p>
              <p>✉️ info@newstatehighschool.edu.ng</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-[13px] opacity-60 gap-4">
          <p>© {new Date().getFullYear()} New State High School. All rights reserved.</p>
          <p>Excellence, Character & Knowledge</p>
        </div>
      </div>
    </footer>
  );
}
