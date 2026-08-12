import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import GenericPage from './pages/GenericPage';

const pageMeta = {
  about: { title: 'About NSHS', description: 'Discover our history, mission, vision, and core educational philosophy in Mushin, Lagos.' },
  admission: { title: 'Admission & Enrollment', description: 'Step-by-step guide on how to enroll your child at New State High School.' },
  academics: { title: 'Academics & Curriculum', description: 'Comprehensive junior and senior secondary school academic programs.' },
  facilities: { title: 'School Facilities', description: 'Explore our state-of-the-art laboratories, ICT centers, and sports arenas.' },
  news: { title: 'News & Events', description: 'Stay updated with school announcements, upcoming events, and achievements.' },
  gallery: { title: 'Photo & Video Gallery', description: 'Visual highlights of school events, campus life, and student activities.' },
  contact: { title: 'Contact Us', description: 'Get in touch with the administration or visit our campus in Mushin, Lagos.' },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderContent = () => {
    if (currentPage === 'home') {
      return <Home onNavigate={setCurrentPage} />;
    }

    const meta = pageMeta[currentPage] || { title: currentPage, description: '' };
    return <GenericPage title={meta.title} description={meta.description} />;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-grow">{renderContent()}</main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}
