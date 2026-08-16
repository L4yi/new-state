import React from 'react';

export default function AiCoding({ onNavigate }) {
  const modules = [
    { title: 'Python Fundamentals & Problem Solving', desc: 'Variables, loops, functions, data structures, and algorithmic logic.', icon: '🐍' },
    { title: 'Web Development (HTML, CSS & JS)', desc: 'Building responsive web interfaces, modern layout systems, and interactive UI.', icon: '💻' },
    { title: 'AI & Prompt Engineering', desc: 'Understanding machine learning models, structured prompting, and AI productivity tools.', icon: '🤖' },
    { title: 'Robotics & Hardware Integration', desc: 'Introduction to microcontrollers, sensors, and basic automated electronics.', icon: '⚙️' },
  ];

  return (
    <div className="pt-[72px]">
      <section className="bg-[#06452C] text-white py-16 lg:py-20 px-6 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-emerald-300 mb-3">
            <span className="w-6 h-[2px] bg-emerald-300 inline-block" />
            FUTURE SKILLS INITIATIVE
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            AI & Coding Skills Program
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
            Equipping New State High School students with software engineering, artificial intelligence, and digital innovation skills for tomorrow's technology landscape.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-green-light text-green-primary text-xs font-bold uppercase tracking-wider">
              TECH CURRICULUM
            </span>
            <h2 className="text-3xl font-extrabold text-[#1B2521] mt-3">What Our Students Learn</h2>
            <p className="text-sm text-[#55635C] mt-2">
              Practical, hands-on computer science modules tailored for Junior and Senior Secondary students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((m, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#F8FAFA] border border-gray-100 flex flex-col justify-between hover:border-green-primary/30 transition-all">
                <div>
                  <div className="text-4xl p-3 rounded-2xl bg-green-light/60 w-fit mb-4">{m.icon}</div>
                  <h3 className="font-extrabold text-base text-[#1B2521] mb-2">{m.title}</h3>
                  <p className="text-xs text-[#55635C] leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
