import React, { useState, useEffect, Suspense, lazy, Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileQuickBar from './components/MobileQuickBar';
import PrivacyBanner from './components/PrivacyBanner';

const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.warn('Chunk load error, auto-refreshing...', error);
      const isRetried = window.sessionStorage.getItem('chunk_retry_attempted');
      if (!isRetried) {
        window.sessionStorage.setItem('chunk_retry_attempted', 'true');
        window.location.reload();
      }
      throw error;
    }
  });

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Exception caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('nshs_is_logged_in');
    localStorage.removeItem('nshs_active_role');
    localStorage.removeItem('nshs_current_user');
    localStorage.removeItem('nshs_portal_data');
    localStorage.removeItem('nshs_auth_token');
    window.location.href = '/portal';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#06452C] flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="bg-white text-[#1B2521] p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-[#06452C] border border-amber-200 rounded-2xl flex items-center justify-center mx-auto font-black text-xl">
              ✦
            </div>
            <h2 className="text-xl font-black">Portal Session Refresh</h2>
            <p className="text-xs text-gray-500">
              A fresh portal update is available. Click below to load your active session and continue.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 rounded-xl bg-[#06452C] text-white font-extrabold text-xs shadow-md hover:bg-[#0B5D3B] transition-all cursor-pointer"
            >
              Load Portal Dashboard →
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Home = lazyWithRetry(() => import('./pages/Home'));
const About = lazyWithRetry(() => import('./pages/About'));
const Academics = lazyWithRetry(() => import('./pages/Academics'));
const Admission = lazyWithRetry(() => import('./pages/Admission'));
const Contact = lazyWithRetry(() => import('./pages/Contact'));
const ExamSuccess = lazyWithRetry(() => import('./pages/ExamSuccess'));
const CandidateLogin = lazyWithRetry(() => import('./pages/CandidateLogin'));
const BuyPlan = lazyWithRetry(() => import('./pages/BuyPlan'));
const AiCoding = lazyWithRetry(() => import('./pages/AiCoding'));
const TeachersApply = lazyWithRetry(() => import('./pages/TeachersApply'));
const AlumniTestimonials = lazyWithRetry(() => import('./pages/AlumniTestimonials'));
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy'));
const TermsOfAdmission = lazyWithRetry(() => import('./pages/TermsOfAdmission'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));
const Portal = lazyWithRetry(() => import('./pages/Portal'));
const JambPredictor = lazyWithRetry(() => import('./pages/JambPredictor'));
const GenericPage = lazyWithRetry(() => import('./pages/GenericPage'));

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
  },
  'jamb-score-predictor': {
    title: 'Free JAMB Score Predictor & 50-Question Hyper-Mock CBT | New State High School Lagos',
    description: 'Calculate your UTME trajectory with our free 50-question 35-minute timed hyper-mock simulator across Nigerian JAMB subjects.'
  },
  'jamb-predictor': {
    title: 'Free JAMB Score Predictor & 50-Question Hyper-Mock CBT | New State High School Lagos',
    description: 'Calculate your UTME trajectory with our free 50-question 35-minute timed hyper-mock simulator across Nigerian JAMB subjects.'
  }
};

const validPages = [
  'home', 'about', 'academics', 'admission', 'contact', 'portal',
  'exam-success', 'candidate-login', 'buy-plan', 'ai-coding',
  'teachers-apply', 'alumni', 'privacy', 'terms', 'facilities', 'news', 'gallery',
  'jamb-score-predictor', 'jamb-predictor', '404'
];

const getPageFromUrl = () => {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!path || path === '') return 'home';
  if (validPages.includes(path)) return path;
  return '404';
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(getPageFromUrl);

  // Sync with browser back/forward button history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation handler with browser URL bar update
  const navigateTo = (page) => {
    setCurrentPage(page);
    const targetUrl = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
  };

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
    if (currentPage === 'home') return <Home onNavigate={navigateTo} />;
    if (currentPage === 'about') return <About onNavigate={navigateTo} />;
    if (currentPage === 'academics') return <Academics onNavigate={navigateTo} />;
    if (currentPage === 'admission') return <Admission onNavigate={navigateTo} />;
    if (currentPage === 'contact') return <Contact onNavigate={navigateTo} />;
    if (currentPage === 'portal') return <Portal onNavigate={navigateTo} />;
    if (currentPage === 'exam-success') return <ExamSuccess onNavigate={navigateTo} />;
    if (currentPage === 'candidate-login') return <CandidateLogin onNavigate={navigateTo} />;
    if (currentPage === 'buy-plan') return <BuyPlan onNavigate={navigateTo} />;
    if (currentPage === 'jamb-score-predictor' || currentPage === 'jamb-predictor') return <JambPredictor onNavigate={navigateTo} />;
    if (currentPage === 'ai-coding') return <AiCoding onNavigate={navigateTo} />;
    if (currentPage === 'teachers-apply') return <TeachersApply onNavigate={navigateTo} />;
    if (currentPage === 'alumni') return <AlumniTestimonials onNavigate={navigateTo} />;
    if (currentPage === 'privacy') return <PrivacyPolicy onNavigate={navigateTo} />;
    if (currentPage === 'terms') return <TermsOfAdmission onNavigate={navigateTo} />;
    if (currentPage === '404') return <NotFound onNavigate={navigateTo} />;

    if (pageSEO[currentPage]) {
      const meta = pageSEO[currentPage];
      return <GenericPage title={meta.title} description={meta.description} />;
    }

    return <NotFound onNavigate={navigateTo} />;
  };

  const isPortal = currentPage === 'portal';

  return (
    <div className="min-h-screen flex flex-col font-sans relative pb-16 md:pb-0">
      {!isPortal && <Header currentPage={currentPage} onNavigate={navigateTo} />}
      
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0B5D3B]"></div>
            </div>
          }>
            {renderContent()}
          </Suspense>
        </ErrorBoundary>
      </main>

      {!isPortal && <Footer onNavigate={navigateTo} />}
      
      {/* Sticky Mobile Fast-Action Bar (Touch-optimized >= 44px) */}
      <MobileQuickBar onNavigate={navigateTo} currentPage={currentPage} />

      {/* Lightweight Session & NDPR Privacy Banner */}
      <PrivacyBanner onNavigate={navigateTo} />
    </div>
  );
}
