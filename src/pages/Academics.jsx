import React, { useState } from 'react';

export default function Academics({ onNavigate }) {
  const [activeTrack, setActiveTrack] = useState('all');

  const jssSubjects = [
    { title: 'English Language & Literature', desc: 'Grammar, essay writing, comprehension, and introductory literature.' },
    { title: 'Mathematics', desc: 'Arithmetic, algebra, geometry, statistics, and practical problem solving.' },
    { title: 'Basic Science', desc: 'Foundational concepts in biology, chemistry, physics, and environmental science.' },
    { title: 'Basic Technology', desc: 'Introductory technical drawing, workshop tools, electronics, and woodworking.' },
    { title: 'Computer Studies (ICT)', desc: 'Computer fundamentals, typing, office software, and basic internet safety.' },
    { title: 'Civic & Social Studies', desc: 'Nigerian history, constitution, human rights, and community citizenship.' },
    { title: 'Business Studies', desc: 'Bookkeeping, office practice, commerce basics, and keyboarding skills.' },
    { title: 'Cultural & Creative Arts', desc: 'Visual arts, music theory, drama, and Nigerian cultural heritage.' },
  ];

  const tracks = [
    {
      id: 'science',
      title: 'Science & Technology Track',
      icon: '🔬',
      badge: 'STEM Focused',
      desc: 'Designed for future engineers, medical professionals, research scientists, and technology specialists.',
      subjects: [
        'Physics', 'Chemistry', 'Biology', 
        'Further Mathematics', 'Technical Drawing', 'Agricultural Science',
        'Computer Studies', 'General Mathematics', 'English Language'
      ]
    },
    {
      id: 'coding',
      title: 'AI & Coding Skills Program',
      icon: '💻',
      badge: 'Future Tech',
      desc: 'Hands-on practical training in Python programming, Web Development, Prompt Engineering, and Robotics.',
      subjects: [
        'Python Fundamentals', 'HTML5 & CSS3 Web Design', 'JavaScript Logic',
        'AI Prompt Engineering', 'Microcontrollers & Sensors', 'Software Problem Solving'
      ]
    },
    {
      id: 'commercial',
      title: 'Commercial Studies Track',
      icon: '💼',
      badge: 'Business & Finance',
      desc: 'Prepares students for careers in accounting, finance, economics, business management, and banking.',
      subjects: [
        'Financial Accounting', 'Commerce', 'Economics', 
        'Office Practice', 'Government', 'General Mathematics', 
        'English Language', 'Civic Education', 'Computer Studies'
      ]
    },
    {
      id: 'arts',
      title: 'Arts & Humanities Track',
      icon: '🎨',
      badge: 'Law & Communication',
      desc: 'Nurtures future lawyers, journalists, diplomats, authors, political scientists, and creative artists.',
      subjects: [
        'Literature-in-English', 'Government', 'History', 
        'Christian / Islamic Religious Studies', 'Yoruba Language', 
        'Fine Art', 'General Mathematics', 'English Language', 'Civic Education'
      ]
    }
  ];

  const examPrep = [
    {
      title: 'WAEC (SSCE) Preparation',
      subtitle: 'West African Senior School Certificate Examination',
      desc: 'Comprehensive syllabus coverage, past question drills, intensive practical lab sessions, and mock exams for SSS 3 candidates.'
    },
    {
      title: 'NECO (SSCE) Preparation',
      subtitle: 'National Examinations Council',
      desc: 'Structured revision programs, essay writing workshops, and continuous assessment tracking to ensure top distinctions.'
    },
    {
      title: 'BECE (Junior WAEC)',
      subtitle: 'Basic Education Certificate Examination',
      desc: 'Thorough preparation for JSS 3 students transitioning into specialized Senior Secondary tracks.'
    }
  ];

  const assessmentSystem = [
    { weight: '20%', label: 'Continuous Assessment (CA 1 & 2)', desc: 'Class tests, weekly assignments, group projects, and lab practicals.' },
    { weight: '10%', label: 'Attendance & Mid-Term Test', desc: 'Punctuality, class participation, conduct, and mid-term evaluations.' },
    { weight: '70%', label: 'Terminal Examination', desc: 'Comprehensive end-of-term examinations covering the complete term syllabus.' }
  ];

  const filteredTracks = activeTrack === 'all' 
    ? tracks 
    : tracks.filter(t => t.id === activeTrack);

  return (
    <div className="pt-[72px]">
      {/* Hero Banner */}
      <section className="bg-[#06452C] text-white py-16 lg:py-20 px-6 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-200 mb-3">
            <span className="w-6 h-[2px] bg-green-300 inline-block" />
            ACADEMICS & CURRICULUM
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Rigorous Academics, STEM & Character Development
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
            Discover New State High School’s academic structure for Junior and Senior Secondary education, specialized subject tracks, and WAEC/NECO distinction records.
          </p>
        </div>
      </section>

      {/* Junior Secondary School Section (JSS 1 - JSS 3) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              FOUNDATIONAL LEVEL
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521] mb-4">
              Junior Secondary Education (JSS 1 – JSS 3)
            </h2>
            <p className="text-sm sm:text-base text-[#55635C] leading-relaxed">
              Our Junior Secondary curriculum provides a strong, well-rounded foundation across core sciences, mathematics, technology, languages, and vocational arts, preparing students for BECE examinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jssSubjects.map((sub, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#F8FAFA] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-lg bg-green-light text-green-primary font-bold flex items-center justify-center text-xs mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-base text-[#1B2521] mb-2">{sub.title}</h3>
                <p className="text-xs text-[#55635C] leading-relaxed">{sub.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Senior Secondary School Tracks (SSS 1 - SSS 3) */}
      <section className="py-20 px-6 bg-[#F8FAFA] border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
                <span className="w-6 h-[2px] bg-green-primary inline-block" />
                SPECIALIZED PATHWAYS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521]">
                Senior Secondary Tracks (SSS 1 – SSS 3)
              </h2>
            </div>

            {/* Track Filter */}
            <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-xl border border-gray-200">
              {[
                { id: 'all', label: 'All Tracks' },
                { id: 'science', label: 'Science & Tech' },
                { id: 'coding', label: 'AI & Coding' },
                { id: 'commercial', label: 'Commercial' },
                { id: 'arts', label: 'Arts & Humanities' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTrack(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTrack === tab.id
                      ? 'bg-green-primary text-white shadow-sm'
                      : 'text-[#55635C] hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {filteredTracks.map((track) => (
              <div key={track.id} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl">{track.icon}</span>
                    <span className="px-3 py-1 rounded-full bg-green-light text-green-primary text-xs font-bold">
                      {track.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-[#1B2521] mb-2">{track.title}</h3>
                  <p className="text-xs sm:text-sm text-[#55635C] leading-relaxed mb-6">{track.desc}</p>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-xs font-bold text-[#1B2521] uppercase tracking-wider mb-3">Core Subjects:</div>
                    <ul className="grid grid-cols-1 gap-2">
                      {track.subjects.map((sub, i) => (
                        <li key={i} className="text-xs text-[#55635C] flex items-center gap-2">
                          <span className="text-green-primary font-bold">✓</span> {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                  <button
                    onClick={() => onNavigate('admission')}
                    className="text-xs font-bold text-green-primary hover:underline"
                  >
                    Apply for this track →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* External Examinations & Excellence */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              EXAMINATION SUCCESS
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521]">
              National Examination Preparation
            </h2>
            <p className="text-sm text-[#55635C] mt-2">
              We maintain a proven track record of distinction in national senior and junior secondary examinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examPrep.map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-[#EEF5F1]/50 border border-green-primary/10 relative">
                <div className="text-xs font-bold text-green-primary uppercase tracking-wider mb-1">{item.subtitle}</div>
                <h3 className="font-bold text-lg text-[#1B2521] mb-3">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#55635C] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grading & Assessment System */}
      <section className="py-20 px-6 bg-[#F8FAFA] border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              EVALUATION & REPORTS
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521]">
              Assessment & Grading System
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {assessmentSystem.map((sys, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
                <div className="text-4xl font-extrabold text-green-primary mb-2">{sys.weight}</div>
                <h3 className="font-bold text-base text-[#1B2521] mb-2">{sys.label}</h3>
                <p className="text-xs text-[#55635C] leading-relaxed">{sys.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-dark to-green-primary text-white">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Join Our Academic Community?</h2>
          <p className="text-emerald-100 max-w-2xl mx-auto text-base sm:text-lg mb-8">
            Admissions are open for JSS1, SSS1, and transfer students for the 2026/2027 academic session.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('admission')}
              className="px-8 py-4 rounded-xl font-bold text-green-primary bg-white hover:bg-emerald-50 transition-all shadow-lg"
            >
              Start Admission Application
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 rounded-xl font-bold text-white bg-white/15 border border-white/30 hover:bg-white/25 transition-all"
            >
              Speak to Academic Counselor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
