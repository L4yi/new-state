import React, { useState, useEffect } from 'react';

const navItems = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  {
    label: 'Admissions',
    subItems: [
      { label: 'Student Admissions', page: 'admission' },
      { label: 'Teachers Apply Here!', page: 'teachers-apply' },
    ],
  },
  { label: 'Academics', page: 'academics' },
  {
    label: 'WAEC JAMB SUCCESS',
    subItems: [
      { label: 'Overview', page: 'exam-success' },
      { label: 'Candidate Login', page: 'candidate-login' },
      { label: 'Get Access Plan', page: 'buy-plan' },
    ],
  },
];

export default function Header({ currentPage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page) => {
    onNavigate(page);
    setMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200"
        style={{ boxShadow: scrolled ? '0 1px 12px rgba(11,93,59,0.10)' : '0 1px 0 #DCE7E1' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo / Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 focus:outline-none text-left group"
            aria-label="New State High School — Home"
          >
            <div className="w-[46px] h-[46px] flex items-center justify-center flex-shrink-0">
              <img
                src="/school-logo.png"
                alt="New State High School Logo"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-[15px] tracking-tight text-green-primary">
                New State High School
              </div>
              <div className="text-[11px] tracking-widest uppercase text-[#66736D]">
                Mushin · Lagos State
              </div>
            </div>
          </button>

          {/* Desktop Links (With Admissions & WAEC Dropdowns) */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item, idx) => {
              if (item.subItems) {
                const isSubActive = item.subItems.some((sub) => sub.page === currentPage);
                return (
                  <div
                    key={idx}
                    className="relative group py-2"
                    onMouseEnter={() => setActiveDropdown(idx)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`px-3 py-2 rounded-md text-[14px] font-medium transition-colors duration-150 flex items-center gap-1 focus:outline-none ${
                        isSubActive
                          ? 'text-green-primary bg-green-light font-bold'
                          : 'text-[#1B2521] hover:bg-[#F4F9F6]'
                      }`}
                    >
                      {item.label}
                      <span className="text-[10px] opacity-60 group-hover:translate-y-0.5 transition-transform">
                        ▼
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute top-full left-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 transition-all duration-200 z-50 ${
                        activeDropdown === idx
                          ? 'opacity-100 visible translate-y-1'
                          : 'opacity-0 invisible translate-y-2'
                      }`}
                    >
                      {item.subItems.map((sub, sIdx) => {
                        const active = currentPage === sub.page;
                        return (
                          <button
                            key={sIdx}
                            onClick={() => handleNavClick(sub.page)}
                            className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-green-50 ${
                              active ? 'text-green-primary font-bold bg-green-light/50' : 'text-[#1B2521]'
                            }`}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const active = currentPage === item.page;
              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(item.page)}
                  className={`px-3 py-2 rounded-md text-[14px] font-medium transition-colors duration-150 focus:outline-none ${
                    active
                      ? 'text-green-primary bg-green-light font-semibold'
                      : 'text-[#1B2521] hover:bg-[#F4F9F6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Green "Contact School" Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('contact')}
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-[#06452C] hover:bg-[#0B5D3B] transition-colors duration-150"
            >
              Contact School
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-md focus:outline-none"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span
                className={`w-5 h-0.5 bg-[#1B2521] block transition-all duration-200 ${
                  menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-[#1B2521] block transition-all duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-[#1B2521] block transition-all duration-200 ${
                  menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-[72px] overflow-y-auto">
          <nav className="px-6 py-4 flex flex-col gap-2" aria-label="Mobile navigation">
            {navItems.map((item, idx) => {
              if (item.subItems) {
                return (
                  <div key={idx} className="space-y-1 py-1 border-y border-gray-100">
                    <div className="text-[12px] font-bold tracking-widest uppercase text-green-primary px-3 pt-2">
                      {item.label}
                    </div>
                    {item.subItems.map((sub, sIdx) => {
                      const active = currentPage === sub.page;
                      return (
                        <button
                          key={sIdx}
                          onClick={() => handleNavClick(sub.page)}
                          className={`w-full text-left px-5 py-2.5 rounded-lg text-[14px] font-medium ${
                            active ? 'text-green-primary bg-green-light font-bold' : 'text-[#1B2521]'
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                );
              }

              const active = currentPage === item.page;
              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(item.page)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-[15px] font-medium ${
                    active ? 'text-green-primary bg-green-light font-bold' : 'text-[#1B2521]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => handleNavClick('contact')}
              className="mt-4 w-full py-3.5 rounded-lg text-[15px] font-semibold text-white bg-[#06452C] hover:bg-[#0B5D3B]"
            >
              Contact School
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
