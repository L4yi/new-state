import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admission from './pages/Admission';
import Contact from './pages/Contact';
import ExamSuccess from './pages/ExamSuccess';
import CandidateLogin from './pages/CandidateLogin';
import BuyPlan from './pages/BuyPlan';
import AiCoding from './pages/AiCoding';
import TeachersApply from './pages/TeachersApply';
import AlumniTestimonials from './pages/AlumniTestimonials';
import Portal from './pages/Portal';
import GenericPage from './pages/GenericPage';

const pageMeta = {
  facilities: { title: 'School Facilities', description: 'Explore our state-of-the-art laboratories, ICT centers, and sports arenas.' },
  news: { title: 'News & Events', description: 'Stay updated with school announcements, upcoming events, and achievements.' },
  gallery: { title: 'Photo & Video Gallery', description: 'Visual highlights of school events, campus life, and student activities.' },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

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

    const meta = pageMeta[currentPage] || { title: currentPage, description: '' };
    return <GenericPage title={meta.title} description={meta.description} />;
  };

  const isPortal = currentPage === 'portal';

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isPortal && <Header currentPage={currentPage} onNavigate={setCurrentPage} />}
      <main className="flex-grow">{renderContent()}</main>
      {!isPortal && <Footer onNavigate={setCurrentPage} />}
    </div>
  );
}
