import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileQuickBar from './components/MobileQuickBar';
import PrivacyBanner from './components/PrivacyBanner';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Academics = lazy(() => import('./pages/Academics'));
const Admission = lazy(() => import('./pages/Admission'));
const Contact = lazy(() => import('./pages/Contact'));
const ExamSuccess = lazy(() => import('./pages/ExamSuccess'));
const CandidateLogin = lazy(() => import('./pages/CandidateLogin'));
const BuyPlan = lazy(() => import('./pages/BuyPlan'));
const AiCoding = lazy(() => import('./pages/AiCoding'));
const TeachersApply = lazy(() => import('./pages/TeachersApply'));
const AlumniTestimonials = lazy(() => import('./pages/AlumniTestimonials'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfAdmission = lazy(() => import('./pages/TermsOfAdmission'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Portal = lazy(() => import('./pages/Portal'));
const GenericPage = lazy(() => import('./pages/GenericPage'));

const pageSEO = {
  home: {
    title: 'New State High School Mushin, Lagos — Premier Secondary School | WAEC & BECE Excellence',
    description: 'Welcome to New State High School, Mushin, Lagos. Superior academics, science & tech laboratories, AI coding academy, and 100% examination pass rate.'
  },
  about: {
    title: 'About Us — History, Mission & Values | New State High School Lagos',
    description: 'Learn about New State High School, established in 1980 in Palm Avenue, Mushin, Lagos. Dedicated to developing future leaders through quality education.'
  },
  academics: {
    title: 'Academic Curriculum (JSS & SSS) — Science, Commercial & Arts | New State High School',
    description: 'Comprehensive Nigerian & International academic curriculum for Junior and Senior Secondary students at New State High School, Mushin, Lagos.'
  },
  admission: {
    title: 'Online Admissions 2026/2027 Session — Apply Now | New State High School Lagos',
    description: 'Enroll your child at New State High School. Admissions open for JSS 1 to SSS 2. Convenient online application form and entrance examination.'
  },
  'exam-success': {
    title: 'Exam Success & 100% WAEC/BECE Results Record | New State High School',
    description: 'Explore our outstanding academic records with 100% distinction pass rate in WAEC, NECO, and BECE examinations in Lagos State.'
  },
  'ai-coding': {
    title: 'AI & Coding Academy — Digital Skills For Future Tech Leaders | New State High School',
    description: 'Empowering students with hands-on AI, Python programming, robotics, and web development skills at New State High School ICT Academy.'
  },
  alumni: {
    title: 'Alumni Testimonials & Hall of Fame | New State High School Lagos',
    description: 'Hear from our accomplished alumni making global impact in medicine, engineering, technology, law, and entrepreneurship.'
  },
  'teachers-apply': {
    title: 'Academic Careers & Teacher Recruitment | New State High School Mushin',
    description: 'Join our team of dedicated educators at New State High School. Apply for teaching and administrative vacancies in Lagos.'
  },
  contact: {
    title: 'Contact Us — 36 Palm Avenue, Mushin, Lagos State | New State High School',
    description: 'Get in touch with New State High School administration. Visit our campus in Mushin, Lagos, call +234 813 400 0644, or send an email.'
  },
  portal: {
    title: 'School Management Portal — Student, Teacher & Admin Access | New State High School',
    description: 'Official New State High School portal for student grade reports, fee payment receipts, teacher broadsheets, and administrator records.'
  },
  privacy: {
    title: 'Privacy Policy & Student Data Protection (NDPR) | New State High School Lagos',
    description: 'Official student data privacy policy of New State High School in compliance with NDPR data protection laws in Nigeria.'
  },
  terms: {
    title: 'Terms of Admission & Student Code of Conduct | New State High School',
    description: 'Academic rules, tuition fee policies, and code of conduct for students and guardians at New State High School, Mushin.'
  },
  '404': {
    title: 'Page Not Found · Error 404 | New State High School Lagos',
    description: 'The requested campus page could not be found. Return to New State High School home or explore online admissions.'
  },
  'candidate-login': {
    title: 'Candidate Admission Portal — Check Application Status | New State High School',
    description: 'Check prospective student entrance examination screening status and print official admission letters.'
  },
  'buy-plan': {
    title: 'School Prospectus & Application Portal | New State High School',
    description: 'Purchase school application prospectus and register for entrance screening.'
  },
  facilities: {
    title: 'Modern Science & ICT Campus Facilities | New State High School Lagos',
    description: 'Explore our modern chemistry, physics, biology, and computer laboratories at New State High School, Mushin.'
  },
  news: {
    title: 'School News & Campus Events | New State High School',
    description: 'Latest news, inter-house sports updates, valedictory service announcements, and academic calendars.'
  },
  gallery: {
    title: 'Campus Life Photo & Video Gallery | New State High School',
    description: 'Photographic highlights of cultural days, science exhibitions, sports competitions, and student milestones.'
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Dynamic SEO Page Title and Description Updates
  useEffect(() => {
    const seo = pageSEO[currentPage] || pageSEO['404'] || pageSEO.home;
    document.title = seo.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seo.description);
    }

    // Scroll to top smoothly on page transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderContent = () => {
    if (currentPage === 'home') return <Home onNavigate={setCurrentPage} />;
    if (currentPage === 'about') return <About onNavigate={setCurrentPage} />;
    if (currentPage === 'academics') return <Academics onNavigate={setCurrentPage} />;
    if (currentPage === 'admission') return <Admission onNavigate={setCurrentPage} />;
    if (currentPage === 'contact') return <Contact onNavigate={setCurrentPage} />;
    if (currentPage === 'portal') return <Portal onNavigate={setCurrentPage} />;
    if (currentPage === 'exam-success') return <ExamSuccess onNavigate={setCurrentPage} />;
    if (currentPage === 'candidate-login') return <CandidateLogin onNavigate={setCurrentPage} />;
    if (currentPage === 'buy-plan') return <BuyPlan onNavigate={setCurrentPage} />;
    if (currentPage === 'ai-coding') return <AiCoding onNavigate={setCurrentPage} />;
    if (currentPage === 'teachers-apply') return <TeachersApply onNavigate={setCurrentPage} />;
    if (currentPage === 'alumni') return <AlumniTestimonials onNavigate={setCurrentPage} />;
    if (currentPage === 'privacy') return <PrivacyPolicy onNavigate={setCurrentPage} />;
    if (currentPage === 'terms') return <TermsOfAdmission onNavigate={setCurrentPage} />;
    if (currentPage === '404') return <NotFound onNavigate={setCurrentPage} />;

    if (pageSEO[currentPage]) {
      const meta = pageSEO[currentPage];
      return <GenericPage title={meta.title} description={meta.description} />;
    }

    return <NotFound onNavigate={setCurrentPage} />;
  };

  const isPortal = currentPage === 'portal';

  return (
    <div className="min-h-screen flex flex-col font-sans relative pb-16 md:pb-0">
      {!isPortal && <Header currentPage={currentPage} onNavigate={setCurrentPage} />}
      
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0B5D3B]"></div>
          </div>
        }>
          {renderContent()}
        </Suspense>
      </main>

      {!isPortal && <Footer onNavigate={setCurrentPage} />}
      
      {/* Sticky Mobile Fast-Action Bar (Touch-optimized >= 44px) */}
      <MobileQuickBar onNavigate={setCurrentPage} currentPage={currentPage} />

      {/* Lightweight Session & NDPR Privacy Banner */}
      <PrivacyBanner onNavigate={setCurrentPage} />
    </div>
  );
}
