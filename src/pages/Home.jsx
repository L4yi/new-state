import React from 'react';

export default function Home({ onNavigate }) {
  const stats = [
    { label: 'Years of Excellence', value: '57+', desc: 'Founded Jan 1969' },
    { label: 'Students Enrolled', value: '500+', desc: 'Across all levels' },
    { label: 'Qualified Staff', value: '30+', desc: 'Experienced teachers' },
    { label: 'Academic Tracks', value: '6', desc: 'JSS, SSS & Specialty' },
  ];

  const whyChooseUs = [
    {
      title: 'Academic Excellence',
      desc: 'A structured curriculum that challenges students to achieve their highest academic potential through dedicated teaching and regular assessment.',
      icon: (
        <svg className="w-5 h-5 text-green-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Character & Discipline',
      desc: 'We cultivate integrity, respect, and self-discipline — values that shape students into responsible members of the community.',
      icon: (
        <svg className="w-5 h-5 text-green-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Supportive Environment',
      desc: 'A safe, nurturing school community where every student is seen, supported, and encouraged to grow with confidence.',
      icon: (
        <svg className="w-5 h-5 text-green-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Student Development',
      desc: 'Beyond the classroom, we invest in sports, cultural activities, clubs, and leadership opportunities that build well-rounded individuals.',
      icon: (
        <svg className="w-5 h-5 text-green-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const programmes = [
    { title: 'Junior Secondary Education', subtitle: 'JSS 1 – JSS 3 Foundation', icon: '📚' },
    { title: 'Senior Secondary Education', subtitle: 'SSS 1 – SSS 3 Specialization', icon: '🎓' },
    { title: 'Science & Technology', subtitle: 'STEM & Laboratory Science', icon: '🔬' },
    { title: 'Arts & Humanities', subtitle: 'Law & Creative Studies', icon: '✏️' },
    { title: 'Commercial Studies', subtitle: 'Business & Financial Accounting', icon: '📊' },
    { title: 'AI & Coding Skills', subtitle: 'Python & Web Development', icon: '💻' }
  ];

  const studentLifeCards = [
    { title: 'Inter-House Sports', tag: 'Athletics & Football', desc: 'Annual track & field competition & football league', img: '/nigerian-sports.jpg', icon: '🏆' },
    { title: 'JET & Press Club', tag: 'Innovators & Writers', desc: 'Junior Engineers, Robotics, and School Press Team', img: '/nigerian-computer-lab.jpg', icon: '🎤' },
    { title: 'Cultural Day Festival', tag: 'Heritage & Arts', desc: 'Celebrating Nigerian traditions, music & drama', img: '/nigerian-cultural.jpg', icon: '🥁' },
    { title: 'Prefect Leadership', tag: 'Student Governance', desc: 'Developing responsibility, ethics & peer mentorship', img: '/nigerian-students.jpg', icon: '⭐' },
    { title: 'Exhibitions & Fairs', tag: 'Science & Art Fairs', desc: 'Annual science project showcase & debates', img: '/nigerian-science-lab.jpg', icon: '🔬' }
  ];

  const admissionCards = [
    { title: 'Entry Levels', desc: 'JSS 1, SSS 1 & Transfer Entry', icon: '🏫' },
    { title: 'Who Can Apply', desc: 'Eligible prospective candidates', icon: '👤' },
    { title: 'Admission Period', desc: 'Ongoing for 2026/2027 Session', icon: '📅' },
    { title: 'Contact Admissions', desc: '0813 400 0644 · info@newstateschools.org', icon: '📞' }
  ];

  const newsList = [
    {
      category: 'Announcement',
      date: 'September 2026',
      title: 'New Academic Session Begins',
      desc: 'The school officially commences the new academic session. Students and staff are welcomed back to a fresh term of learning and growth.'
    },
    {
      category: 'Student Life',
      date: 'August 2026',
      title: 'Students Participate in School Activities',
      desc: 'Our students continue to show outstanding commitment to both academic and extracurricular pursuits this term.'
    },
    {
      category: 'Community',
      date: 'July 2026',
      title: 'Celebrating Excellence in Our School Community',
      desc: 'We recognize and celebrate the achievements of our dedicated students, staff, and school community.'
    }
  ];

  const galleryImages = [
    { title: 'Classroom Study', span: 'col-span-12 sm:col-span-6 lg:col-span-5 h-[320px]', img: '/nigerian-students.jpg' },
    { title: 'Science Lab Focus', span: 'col-span-6 sm:col-span-3 lg:col-span-3 h-[155px]', img: '/nigerian-science-lab.jpg' },
    { title: 'Computer Lab Work', span: 'col-span-6 sm:col-span-3 lg:col-span-4 h-[155px]', img: '/nigerian-computer-lab.jpg' },
    { title: 'Student Writing', span: 'col-span-6 sm:col-span-3 lg:col-span-3 h-[150px]', img: '/nigerian-students.jpg' },
    { title: 'Chemistry Experiment', span: 'col-span-6 sm:col-span-3 lg:col-span-4 h-[150px]', img: '/nigerian-science-lab.jpg' },
    { title: 'ICT Class Study', span: 'col-span-6 sm:col-span-3 lg:col-span-3 h-[140px]', img: '/nigerian-computer-lab.jpg' },
    { title: 'Class Learning', span: 'col-span-6 sm:col-span-3 lg:col-span-3 h-[140px]', img: '/nigerian-students.jpg' },
  ];

  const testimonials = [
    {
      text: '"The school has exceeded our expectations in both academic quality and the care they show for each student’s development."',
      name: 'Mrs. Folashade Adebayo',
      role: 'Parent of JSS 2 Student'
    },
    {
      text: '"Being a student here has shaped my character, sharpened my thinking, and prepared me for the future I am working toward."',
      name: 'Emmanuel Chukwuma',
      role: 'SSS 3 Student'
    },
    {
      text: '"We are proud to have our child in a school that takes both academics and discipline as seriously as New State High School does."',
      name: 'Mr. Babatunde Ogunlesi',
      role: 'Parent of SSS 1 Student'
    }
  ];

  return (
    <div className="pt-[72px]">
      {/* 1. Hero Section */}
      <section className="relative min-h-[620px] bg-[#06452C] text-white flex flex-col justify-between overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: `url('/nigerian-students.jpg')`
          }}
        />
        
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-20 lg:py-24 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-green-200 mb-6">
              <span className="w-6 h-[2px] bg-green-300 inline-block" />
              NEW STATE HIGH SCHOOL
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
              Building <br />
              Knowledge, <br />
              <span className="text-[#64D8A3]">Character</span> & Future <br />
              Leaders
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-8 max-w-xl font-normal">
              A modern secondary school in Mushin, Lagos, committed to academic excellence, discipline, character development, and preparing students for a changing world.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 rounded-lg font-bold text-xs sm:text-sm text-white bg-[#0B5D3B] hover:bg-[#06452C] border border-emerald-500/30 transition-all shadow-md"
              >
                Explore Our School
              </button>
              
              <button
                onClick={() => onNavigate('admission')}
                className="px-6 py-3 rounded-lg font-bold text-xs sm:text-sm text-white bg-transparent hover:bg-white/10 border border-white/40 transition-all"
              >
                View Admissions
              </button>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-xs text-emerald-100 border border-white/15">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Mushin, Lagos State · Private Secondary School
            </div>
          </div>
        </div>

        {/* Hero Bottom Stats Bar */}
        <div className="relative z-10 bg-[#063B26] border-t border-emerald-800/60 py-8 px-6">
          <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="px-2">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#64D8A3] tracking-tight">{s.value}</div>
                <div className="text-xs font-bold text-white mt-1">{s.label}</div>
                <div className="text-[11px] text-emerald-300/70 mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. About Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img 
                src="/nigerian-students.jpg" 
                alt="Students in classroom" 
                className="w-full h-[360px] object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 w-12 h-12 bg-green-primary rounded-lg flex items-center justify-center text-white shadow-md">
                📖
              </div>
            </div>

            <div className="absolute -bottom-8 -right-4 w-52 h-44 rounded-xl overflow-hidden border-4 border-white shadow-xl hidden sm:block">
              <img 
                src="/nigerian-students.jpg" 
                alt="Students learning" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-3">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              ABOUT NEW STATE HIGH SCHOOL
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521] leading-tight mb-6">
              An Environment Designed for Growth
            </h2>

            <p className="text-sm sm:text-base text-[#55635C] leading-relaxed mb-4">
              New State High School is a private secondary school in Mushin, Lagos State, dedicated to nurturing well-rounded young individuals. We believe that true education extends beyond textbooks — it shapes character, builds confidence, and cultivates responsible citizenship.
            </p>

            <p className="text-sm sm:text-base text-[#55635C] leading-relaxed mb-8">
              Our structured academic environment combines rigorous learning with discipline, mentorship, and extracurricular development — equipping every student with the skills and values needed to thrive in higher education and beyond.
            </p>

            <button
              onClick={() => onNavigate('about')}
              className="px-6 py-3 rounded-lg font-bold text-xs sm:text-sm text-white bg-green-primary hover:bg-green-dark transition-all"
            >
              Learn More About Us
            </button>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="py-20 px-6 bg-[#F8FAFA] border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              WHY CHOOSE US
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521]">
              Why Choose New State High School
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((card, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-[#EAF2ED]/60 border border-green-primary/10 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-6 shadow-sm">
                  {card.icon}
                </div>
                <h3 className="font-bold text-base text-[#1B2521] mb-3">{card.title}</h3>
                <p className="text-xs sm:text-sm text-[#55635C] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Academic Programmes */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
                <span className="w-6 h-[2px] bg-green-primary inline-block" />
                ACADEMICS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521]">Academic Programmes</h2>
            </div>
            
            <button
              onClick={() => onNavigate('academics')}
              className="text-xs sm:text-sm font-bold text-green-primary hover:underline flex items-center gap-1"
            >
              Explore Academics →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-gray-200/80 bg-white hover:border-green-primary/30 hover:shadow-sm transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1B2521]">{p.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{p.subtitle}</p>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* 5. Learning Spaces & Resources */}
      <section className="py-20 px-6 bg-[#F8FAFA] border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
                <span className="w-6 h-[2px] bg-green-primary inline-block" />
                OUR FACILITIES
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521]">Learning Spaces & Resources</h2>
            </div>
            
            <button
              onClick={() => onNavigate('facilities')}
              className="text-xs sm:text-sm font-bold text-green-primary hover:underline flex items-center gap-1"
            >
              View All Facilities →
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-md h-[380px] group">
              <img 
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80" 
                alt="Classrooms" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">FACILITY</span>
                <h3 className="text-xl font-extrabold">Classrooms</h3>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Science Laboratory', desc: 'Modern Physics, Chemistry & Biology Labs', img: '/nigerian-science-lab.jpg' },
                { title: 'Library & Reading Room', desc: 'Quiet study spaces & physical textbooks', img: '/nigerian-students.jpg' },
                { title: 'ICT / Computer Room', desc: 'Fully equipped desktop computers & internet', img: '/nigerian-computer-lab.jpg' },
                { title: 'Sports & Recreation', desc: 'Football field, basketball & athletics', img: '/nigerian-students.jpg' },
              ].map((fac, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden shadow-sm h-[178px] group">
                  <img 
                    src={fac.img} 
                    alt={fac.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                    <h3 className="text-sm font-bold">{fac.title}</h3>
                    <span className="text-[10px] text-gray-300">{fac.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Student Life Section */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              STUDENT LIFE
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521] mb-3">
              Life Beyond the Classroom
            </h2>
            <p className="text-sm text-[#55635C] leading-relaxed">
              We believe in developing the whole student — through sports, culture, leadership, and community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {studentLifeCards.map((item, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden shadow-sm h-72 group border border-gray-100 bg-white">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <span className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-sm">
                      {item.icon}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white">
                      {item.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold leading-snug mb-1 text-white group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-gray-200 leading-snug opacity-95">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Admissions Section */}
      <section className="py-20 px-6 bg-[#EEF5F1] border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-3">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              ADMISSIONS
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521] leading-tight mb-6">
              Start Your Journey at New State High School
            </h2>

            <p className="text-sm sm:text-base text-[#55635C] leading-relaxed mb-8">
              We welcome families who share our commitment to academic excellence and character development. Admission is open to prospective students meeting our entry requirements. Contact our school office for full details.
            </p>

            <button
              onClick={() => onNavigate('admission')}
              className="px-6 py-3.5 rounded-lg font-bold text-xs sm:text-sm text-white bg-green-primary hover:bg-green-dark transition-all"
            >
              View Admission Information
            </button>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {admissionCards.map((card, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="text-2xl mb-3">{card.icon}</div>
                <h3 className="font-bold text-sm text-[#1B2521] mb-1">{card.title}</h3>
                <p className="text-xs text-gray-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Latest from Our School (News & Events) */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
                <span className="w-6 h-[2px] bg-green-primary inline-block" />
                NEWS & EVENTS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521]">Latest from Our School</h2>
            </div>
            
            <button
              onClick={() => onNavigate('news')}
              className="text-xs sm:text-sm font-bold text-green-primary hover:underline flex items-center gap-1"
            >
              View All News →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsList.map((n, idx) => (
              <div key={idx} className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm flex flex-col justify-between">
                <div className="h-44 bg-gray-100 overflow-hidden">
                  <img 
                    src={idx === 0 ? '/nigerian-students.jpg' : idx === 1 ? '/nigerian-computer-lab.jpg' : '/nigerian-science-lab.jpg'} 
                    alt={n.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-green-50 text-green-primary font-bold text-[11px]">
                        {n.category}
                      </span>
                      <span className="text-[11px] text-gray-400">{n.date}</span>
                    </div>
                    <h3 className="font-bold text-base text-[#1B2521] leading-snug mb-3">{n.title}</h3>
                    <p className="text-xs text-[#55635C] leading-relaxed mb-4">{n.desc}</p>
                  </div>
                  <button 
                    onClick={() => onNavigate('news')}
                    className="text-xs font-bold text-green-primary hover:underline self-start"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. School Life in Pictures (Gallery) */}
      <section className="py-20 px-6 bg-[#F8FAFA] border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
                <span className="w-6 h-[2px] bg-green-primary inline-block" />
                GALLERY
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521]">School Life in Pictures</h2>
            </div>
            
            <button
              onClick={() => onNavigate('gallery')}
              className="text-xs sm:text-sm font-bold text-green-primary hover:underline flex items-center gap-1"
            >
              View Full Gallery →
            </button>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {galleryImages.map((img, idx) => (
              <div key={idx} className={`${img.span} rounded-2xl overflow-hidden shadow-sm relative group`}>
                <img 
                  src={img.img} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Testimonials (What Our Community Says) */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              TESTIMONIALS
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521] mb-2">
              What Our Community Says
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-[#EAF2ED]/40 border border-green-primary/10 flex flex-col justify-between">
                <div className="text-2xl text-green-primary font-serif font-black mb-4">“</div>
                <p className="text-xs sm:text-sm text-[#55635C] leading-relaxed italic mb-6">{t.text}</p>
                <div>
                  <div className="font-bold text-sm text-[#1B2521]">{t.name}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Let's Connect (Contact Section) */}
      <section className="py-20 px-6 bg-[#06452C] text-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Let's Connect</h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed mb-8 max-w-md">
              Have questions about New State High School? Get in touch with our school office — we're happy to help.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-lg font-bold text-xs sm:text-sm text-[#06452C] bg-white hover:bg-emerald-50 transition-all shadow-md"
              >
                Contact the School
              </button>
              
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-lg font-bold text-xs sm:text-sm text-white bg-transparent hover:bg-white/10 border border-white/40 transition-all"
              >
                Get Directions
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-emerald-300 text-xs font-bold tracking-wider mb-2">📍 ADDRESS</div>
              <div className="font-bold text-xs sm:text-sm">36 Palm Avenue, Mushin, Lagos State, Nigeria</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-emerald-300 text-xs font-bold tracking-wider mb-2">📞 PHONE</div>
              <div className="font-bold text-xs sm:text-sm">+234 813 400 0644</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-emerald-300 text-xs font-bold tracking-wider mb-2">✉️ EMAIL</div>
              <div className="font-bold text-xs sm:text-sm">info@newstateschools.org</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-emerald-300 text-xs font-bold tracking-wider mb-2">🕒 OFFICE HOURS</div>
              <div className="font-bold text-xs sm:text-sm">Mon – Fri, 8:00 AM – 4:00 PM</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
