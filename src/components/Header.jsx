import React, { useState, useEffect } from 'react';

const navItems = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Admission', page: 'admission' },
  { label: 'Academics', page: 'academics' },
  { label: 'Facilities', page: 'facilities' },
  { label: 'News & Events', page: 'news' },
  { label: 'Gallery', page: 'gallery' },
  { label: 'Contact', page: 'contact' },
];

export default function Header({ currentPage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page) => {
    onNavigate(page);
    setMenuOpen(false);
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
            className="flex items-center gap-3 focus:outline-none text-left"
            aria-label="New State High School — Home"
          >
            <div className="w-[48px] h-[48px] rounded-lg flex items-center justify-center flex-shrink-0 bg-green-primary">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
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
            <div className="leading-tight">
              <div className="font-bold text-[15px] tracking-tight text-green-primary">
                New State High School
              </div>
              <div className="text-[11px] tracking-widest uppercase text-[#66736D]">
                Mushin · Lagos State
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map(({ label, page }) => {
              const active = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => handleNavClick(page)}
                  className={`px-3 py-2 rounded-md text-[14px] font-medium transition-colors duration-150 focus:outline-none ${
                    active
                      ? 'text-green-primary bg-green-light'
                      : 'text-[#1B2521] hover:bg-[#F4F9F6]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Action / Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('contact')}
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-green-primary hover:bg-green-dark transition-colors duration-150"
            >
              Contact School
            </button>

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
          <nav className="px-6 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map(({ label, page }) => {
              const active = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => handleNavClick(page)}
                  className={`w-full text-left px-4 py-3.5 rounded-lg text-[15px] font-medium transition-colors ${
                    active ? 'text-green-primary bg-green-light' : 'text-[#1B2521]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <button
              onClick={() => handleNavClick('contact')}
              className="mt-4 w-full py-3.5 rounded-lg text-[15px] font-semibold text-white bg-green-primary hover:bg-green-dark"
            >
              Contact School
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
