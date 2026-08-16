import React from 'react';

export default function About({ onNavigate }) {
  const coreValues = [
    {
      title: 'Academic Excellence',
      desc: 'Pursuing mastery in core sciences, arts, and commercial subjects through rigorous instruction, regular evaluation, and continuous academic mentorship.',
      icon: '🎓'
    },
    {
      title: 'Character & Integrity',
      desc: 'Instilling moral discipline, honesty, civic responsibility, and self-respect in every student to prepare them as dependable ethical leaders.',
      icon: '🛡️'
    },
    {
      title: 'Innovation & Technology',
      desc: 'Equipping students with modern computer skills, digital literacy, critical thinking, and problem-solving tools required for a global world.',
      icon: '💻'
    },
    {
      title: 'Community & Leadership',
      desc: 'Fostering teamwork, cultural tolerance, empathy, sportsmanship, and student-led initiatives across all secondary levels.',
      icon: '🤝'
    }
  ];

  const leadershipTeam = [
    {
      name: 'Principal / Head of School',
      role: 'School Administration',
      desc: 'Dedicated to providing visionary academic leadership, ensuring top WAEC/NECO performance, and cultivating a safe learning environment.',
      img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Vice Principal (Academics)',
      role: 'Curriculum & Assessment',
      desc: 'Oversees subject department standards, teacher evaluations, examination protocols, and academic growth tracking.',
      img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Vice Principal (Administration & Student Life)',
      role: 'Discipline & Co-Curriculars',
      desc: 'Manages student welfare, inter-house sports, clubs, societies, and maintaining high standards of school discipline.',
      img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80'
    }
  ];

  const milestones = [
    { year: 'Establishment', title: 'Founded in Mushin, Lagos', desc: 'Established to provide accessible, high-standard secondary education to families across Lagos State.' },
    { year: 'Accreditation', title: 'WAEC & NECO Certification', desc: 'Received full accreditation as an examination center with high academic distinction records.' },
    { year: 'Modernization', title: 'ICT & Science Lab Expansion', desc: 'Upgraded modern Physics, Chemistry, Biology, and Computer Science laboratories.' },
    { year: 'Present Day', title: 'Continuous Educational Growth', desc: 'Consistently graduating well-rounded future leaders ready for tertiary education and global careers.' }
  ];

  return (
    <div className="pt-[72px]">
      {/* Hero Header Banner */}
      <section className="bg-[#06452C] text-white py-16 lg:py-20 px-6 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-200 mb-3">
            <span className="w-6 h-[2px] bg-green-300 inline-block" />
            ABOUT OUR SCHOOL
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Shaping Minds, Character & Future Leaders
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
            Learn about New State High School’s mission, rich educational heritage in Mushin, Lagos State, core values, and dedicated leadership team.
          </p>
        </div>
      </section>

      {/* Overview & School History */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-3">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              OUR STORY
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521] leading-tight mb-6">
              A Tradition of Academic Excellence in Mushin, Lagos
            </h2>

            <p className="text-sm sm:text-base text-[#55635C] leading-relaxed mb-4">
              New State High School was founded with a singular purpose: to provide secondary education that combines intellectual rigor with unwavering moral discipline. Located in the heart of Mushin, Lagos State, our campus serves as a beacon of academic achievement and character formation.
            </p>

            <p className="text-sm sm:text-base text-[#55635C] leading-relaxed mb-6">
              We prepare junior (JSS1–3) and senior (SSS1–3) secondary students for national and international examinations including WAEC and NECO, instilling critical thinking, scientific curiosity, and leadership capability.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-[#F8FAFA] border border-gray-100">
                <div className="font-bold text-green-primary text-base mb-1">Our Mission</div>
                <div className="text-[#55635C] leading-snug">To deliver holistic, student-centered secondary education that fosters academic brilliance, discipline, and ethical leadership.</div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFA] border border-gray-100">
                <div className="font-bold text-green-primary text-base mb-1">Our Vision</div>
                <div className="text-[#55635C] leading-snug">To be recognized as a premier secondary institution producing well-grounded graduates equipped to excel in higher education and society.</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative">
              <img 
                src="/nigerian-students.jpg" 
                alt="New State High School Campus and Students" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="font-bold text-lg">New State High School Campus</div>
                <div className="text-xs text-gray-300">Palm Avenue, Mushin, Lagos State</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Educational Values */}
      <section className="py-20 px-6 bg-[#F8FAFA] border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              OUR GUIDING PRINCIPLES
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521]">
              Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="text-3xl mb-4">{val.icon}</div>
                <h3 className="font-bold text-lg text-[#1B2521] mb-2">{val.title}</h3>
                <p className="text-xs sm:text-sm text-[#55635C] leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Milestones */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              OUR JOURNEY
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521]">
              Milestones & Growth
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#EEF5F1]/60 border border-green-primary/10 relative">
                <span className="inline-block px-3 py-1 rounded-full bg-green-primary text-white text-[11px] font-bold mb-3">
                  {m.year}
                </span>
                <h3 className="font-bold text-base text-[#1B2521] mb-2">{m.title}</h3>
                <p className="text-xs text-[#55635C] leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School Leadership */}
      <section className="py-20 px-6 bg-[#F8FAFA] border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              LEADERSHIP
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2521]">
              School Leadership & Administration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipTeam.map((member, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-48 rounded-xl overflow-hidden mb-5 bg-gray-100">
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs font-bold text-green-primary uppercase tracking-wider mb-1">{member.role}</div>
                  <h3 className="font-bold text-lg text-[#1B2521] mb-3">{member.name}</h3>
                  <p className="text-xs text-[#55635C] leading-relaxed mb-4">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-dark to-green-primary text-white">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Interested in Enrolling at New State High School?</h2>
          <p className="text-emerald-100 max-w-2xl mx-auto text-base sm:text-lg mb-8">
            Find out how to join our vibrant academic community or contact our administration for campus visits.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('admission')}
              className="px-8 py-4 rounded-xl font-bold text-green-primary bg-white hover:bg-emerald-50 transition-all shadow-lg"
            >
              View Admission Requirements
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 rounded-xl font-bold text-white bg-white/15 border border-white/30 hover:bg-white/25 transition-all"
            >
              Contact School Office
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
