import React from 'react';

export default function AlumniTestimonials({ onNavigate }) {
  const alumniList = [
    { name: 'Dr. Adebayo Ogunlesi', year: 'Class of 1994', role: 'Medical Consultant, LUTH', quote: 'New State High School instilled in me the discipline and academic foundation that drove my medical career.' },
    { name: 'Engr. Funke Adeyemi', year: 'Class of 2002', role: 'Software Systems Architect', quote: 'The analytical mindset I developed during my secondary school years at NSHS set the trajectory for my engineering accomplishments.' },
    { name: 'Chidubem Okonkwo', year: 'Class of 2015', role: 'Chartered Accountant & Financial Analyst', quote: 'Great teachers and an environment that demands excellence in character and academics.' },
  ];

  return (
    <div className="pt-[72px]">
      <section className="bg-[#06452C] text-white py-16 lg:py-20 px-6 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-emerald-300 mb-3">
            <span className="w-6 h-[2px] bg-emerald-300 inline-block" />
            NSHS NETWORK & ALUMNI
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Alumni & Student Success Stories
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
            Celebrating generations of New State High School graduates making impactful contributions across Nigeria and around the globe since 1969.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {alumniList.map((a, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-[#F8FAFA] border border-gray-100 flex flex-col justify-between">
                <p className="text-sm text-[#55635C] italic leading-relaxed mb-6">"{a.quote}"</p>
                <div className="border-t pt-4">
                  <div className="font-extrabold text-base text-[#1B2521]">{a.name}</div>
                  <div className="text-xs font-bold text-green-primary mt-0.5">{a.year}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{a.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
