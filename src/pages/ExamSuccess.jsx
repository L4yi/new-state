import React, { useState } from 'react';

export default function ExamSuccess({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [jambScore, setJambScore] = useState({ eng: 65, math: 70, phy: 68, chem: 62 });
  const [predictedScore, setPredictedScore] = useState(null);

  const calculatePredictor = (e) => {
    e.preventDefault();
    const total = Number(jambScore.eng) + Number(jambScore.math) + Number(jambScore.phy) + Number(jambScore.chem);
    setPredictedScore(total);
  };

  const featurePillars = [
    {
      title: 'WAEC Past Questions & CBT Practice',
      desc: 'Simulated computer-based practice covering over 15+ SSCE subjects with instant step-by-step solutions.',
      badge: 'SSCE Prep',
      icon: '📝'
    },
    {
      title: 'Official JAMB Mock Analyzer',
      desc: 'Analyze your performance breakdown across subjects to identify weakness areas before the real UTME exam.',
      badge: 'UTME Analytics',
      icon: '📊'
    },
    {
      title: 'JAMB Score Predictor',
      desc: 'Smart algorithm forecasting prospective university admission score candidates based on continuous assessment.',
      badge: 'Score AI',
      icon: '🎯'
    },
    {
      title: 'Course & Career Advisor',
      desc: 'Match your WAEC and JAMB subject combinations directly to Nigerian university course entry cut-offs.',
      badge: 'Career Portal',
      icon: '🎓'
    }
  ];

  return (
    <div className="pt-[72px]">
      {/* Hero Section */}
      <section className="bg-[#06452C] text-white py-16 lg:py-20 px-6 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-200 mb-3">
            <span className="w-6 h-[2px] bg-green-300 inline-block" />
            ACADEMIC EXCELLENCE PORTAL
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            WAEC, JAMB & BECE Exam Success Hub
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
            Empowering New State High School candidates with CBT practice tests, mock score analytics, and university course selection tools.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'overview' ? 'bg-white text-green-dark shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Overview & Features
            </button>
            <button
              onClick={() => setActiveTab('predictor')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'predictor' ? 'bg-white text-green-dark shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Take Free JAMB Mock Predictor
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      {activeTab === 'overview' ? (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="px-3 py-1 rounded-full bg-green-light text-green-primary text-xs font-bold uppercase tracking-wider">
                Exams Mastery
              </span>
              <h2 className="text-3xl font-extrabold text-[#1B2521] mt-3">Why Our Candidates Excel</h2>
              <p className="text-sm text-[#55635C] mt-2">
                New State High School maintains top pass rates in WAEC and BECE examinations through structured CBT training and mock assessments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featurePillars.map((fp, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-[#F8FAFA] border border-gray-100 flex items-start gap-6 hover:shadow-md transition-all">
                  <div className="text-4xl p-4 rounded-2xl bg-green-light/80 text-green-primary flex-shrink-0">{fp.icon}</div>
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-green-primary bg-green-50 px-2.5 py-1 rounded-md">
                      {fp.badge}
                    </span>
                    <h3 className="font-extrabold text-lg text-[#1B2521] mt-2 mb-2">{fp.title}</h3>
                    <p className="text-xs sm:text-sm text-[#55635C] leading-relaxed mb-4">{fp.desc}</p>
                    <button
                      onClick={() => setActiveTab('predictor')}
                      className="text-xs font-bold text-green-primary hover:underline"
                    >
                      Try Interactive Tool →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 px-6 bg-[#F8FAFA]">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-lg">
            <div className="text-center mb-8">
              <span className="text-xs font-bold tracking-widest uppercase text-green-primary">FREE MOCK SIMULATOR</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2521] mt-1">JAMB Score Predictor Calculator</h2>
              <p className="text-xs sm:text-sm text-[#55635C] mt-2">
                Enter your subject scores out of 100 to predict your total UTME matriculation score.
              </p>
            </div>

            <form onSubmit={calculatePredictor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1B2521] mb-1">Use of English (Max 100)</label>
                  <input
                    type="number"
                    max="100"
                    min="0"
                    required
                    value={jambScore.eng}
                    onChange={(e) => setJambScore({ ...jambScore, eng: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B2521] mb-1">Mathematics (Max 100)</label>
                  <input
                    type="number"
                    max="100"
                    min="0"
                    required
                    value={jambScore.math}
                    onChange={(e) => setJambScore({ ...jambScore, math: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1B2521] mb-1">Physics / Economics (Max 100)</label>
                  <input
                    type="number"
                    max="100"
                    min="0"
                    required
                    value={jambScore.phy}
                    onChange={(e) => setJambScore({ ...jambScore, phy: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B2521] mb-1">Chemistry / Govt (Max 100)</label>
                  <input
                    type="number"
                    max="100"
                    min="0"
                    required
                    value={jambScore.chem}
                    onChange={(e) => setJambScore({ ...jambScore, chem: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-sm text-white bg-green-primary hover:bg-green-dark transition-all shadow-md mt-4"
              >
                Calculate Predicted UTME Score →
              </button>
            </form>

            {predictedScore !== null && (
              <div className="mt-8 p-6 rounded-2xl bg-green-light border border-green-primary/20 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-green-primary mb-1">Predicted UTME Score</div>
                <div className="text-4xl font-extrabold text-[#1B2521] mb-2">{predictedScore} / 400</div>
                <p className="text-xs text-[#55635C]">
                  {predictedScore >= 250
                    ? '🎉 Excellent score! Competitive for Engineering, Law, Medicine & Science tracks.'
                    : predictedScore >= 200
                    ? '👍 Good performance! Eligible for most university programs.'
                    : '💡 Additional practice recommended before final JAMB sitting.'}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
