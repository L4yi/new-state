import React, { useState, useEffect } from 'react';
import {
  FileText, BarChart3, Target, GraduationCap, Clock, CheckCircle2,
  AlertTriangle, RotateCcw, Sparkles, Lightbulb, ArrowRight, BookOpen,
  Check, Flame, Compass
} from 'lucide-react';

// Sample Questions Bank for CBT Simulator & Hyper-Mock
const mockQuestionBank = {
  'Use of English': [
    {
      q: 'Choose the option opposite in meaning to the underlined word: The manager made an <u>extempore</u> speech at the banquet.',
      options: ['A. Prepared', 'B. Immediate', 'C. Eloquent', 'D. Impromptu'],
      ans: 'A',
      topic: 'Antonyms & Vocabulary',
      explanation: '"Extempore" means spoken or done without preparation. The opposite is "Prepared".'
    },
    {
      q: 'Fill in the blank with the most appropriate option: Neither the students nor the teacher ______ present at the assembly yesterday.',
      options: ['A. are', 'B. were', 'C. was', 'D. have been'],
      ans: 'C',
      topic: 'Concord & Subject-Verb Agreement',
      explanation: 'With "neither...nor", the verb agrees with the closer subject ("the teacher" is singular, hence "was").'
    },
    {
      q: 'Identify the word with a different stress pattern from the rest:',
      options: ['A. Democratic', 'B. Photographic', 'C. Understand', 'D. Educate'],
      ans: 'D',
      topic: 'Oral English (Stress Pattern)',
      explanation: '"Educate" is stressed on the first syllable (ED-u-cate), while the others are stressed on the third syllable.'
    }
  ],
  'Mathematics': [
    {
      q: 'If 2^(2x + 1) = 32, find the value of x.',
      options: ['A. 2', 'B. 3', 'C. 4', 'D. 5'],
      ans: 'A',
      topic: 'Indices & Logarithms',
      explanation: '32 = 2^5. So 2x + 1 = 5 => 2x = 4 => x = 2.'
    },
    {
      q: 'A bag contains 5 red, 4 blue, and 3 green marbles. What is the probability of picking a blue marble at random?',
      options: ['A. 1/4', 'B. 1/3', 'C. 5/12', 'D. 1/2'],
      ans: 'B',
      topic: 'Probability',
      explanation: 'Total marbles = 5 + 4 + 3 = 12. P(Blue) = 4/12 = 1/3.'
    },
    {
      q: 'Find the quadratic equation whose roots are -3 and 5.',
      options: ['A. x² - 2x - 15 = 0', 'B. x² + 2x - 15 = 0', 'C. x² - 8x + 15 = 0', 'D. x² + 8x - 15 = 0'],
      ans: 'A',
      topic: 'Quadratic Equations',
      explanation: 'Formula: x² - (sum of roots)x + (product of roots) = 0. Sum = 2, Product = -15 => x² - 2x - 15 = 0.'
    }
  ],
  'Physics': [
    {
      q: 'An object of mass 2kg is dropped from a height of 20m. Calculate its kinetic energy just before hitting the ground (g = 10m/s²).',
      options: ['A. 200 J', 'B. 400 J', 'C. 100 J', 'D. 800 J'],
      ans: 'B',
      topic: 'Work, Energy & Power',
      explanation: 'Conservation of energy: KE = mgh = 2 * 10 * 20 = 400 J.'
    },
    {
      q: 'Which of the following electromagnetic waves has the highest frequency?',
      options: ['A. Radio waves', 'B. Infrared rays', 'C. Ultraviolet rays', 'D. Gamma rays'],
      ans: 'D',
      topic: 'Electromagnetic Spectrum',
      explanation: 'Gamma rays have the shortest wavelength and highest frequency and photon energy in the EM spectrum.'
    }
  ],
  'Chemistry': [
    {
      q: 'What is the oxidation number of sulfur in H₂SO₄?',
      options: ['A. +2', 'B. +4', 'C. +6', 'D. -2'],
      ans: 'C',
      topic: 'Redox Reactions & Oxidation States',
      explanation: '2(+1) + S + 4(-2) = 0 => 2 + S - 8 = 0 => S = +6.'
    },
    {
      q: 'The process of separating crude oil into its fractional components is based on differences in their:',
      options: ['A. Densities', 'B. Boiling points', 'C. Solubility', 'D. Melting points'],
      ans: 'B',
      topic: 'Petroleum Chemistry & Separation Techniques',
      explanation: 'Fractional distillation separates mixtures of liquids according to differences in their boiling points.'
    }
  ],
  'Biology': [
    {
      q: 'Which organelle is responsible for cellular respiration and energy ATP production in eukaryotic cells?',
      options: ['A. Ribosome', 'B. Golgi apparatus', 'C. Mitochondrion', 'D. Chloroplast'],
      ans: 'C',
      topic: 'Cell Structure & Respiration',
      explanation: 'The mitochondrion is known as the powerhouse of the cell where ATP is synthesized via aerobic respiration.'
    },
    {
      q: 'The mode of nutrition in green plants is termed:',
      options: ['A. Heterotrophic', 'B. Autotrophic', 'C. Saprophytic', 'D. Parasitic'],
      ans: 'B',
      topic: 'Plant Physiology & Nutrition',
      explanation: 'Autotrophic nutrition occurs when organisms synthesize their own food from inorganic substances using light energy.'
    }
  ]
};

// University Course Database for Career Advisor
const universityCourses = [
  {
    name: 'Medicine & Surgery (MBBS)',
    faculty: 'Medical Sciences',
    required: ['ENG', 'MTH', 'BIO', 'CHE', 'PHY'],
    jambCutoff: 280,
    careers: ['Medical Doctor', 'Surgeon', 'Clinical Researcher', 'Public Health Consultant'],
    topUnis: ['UNILAG', 'UI', 'OAU', 'UNN', 'LASU']
  },
  {
    name: 'Computer Science & Software Engineering',
    faculty: 'Engineering & Computing',
    required: ['ENG', 'MTH', 'PHY', 'CHE', 'ICT'],
    jambCutoff: 250,
    careers: ['Software Engineer', 'AI/ML Specialist', 'Cybersecurity Analyst', 'Cloud Architect'],
    topUnis: ['UNILAG', 'OAU', 'FUTA', 'UNILORIN', 'Covenant']
  },
  {
    name: 'Law & Jurisprudence (LL.B)',
    faculty: 'Law',
    required: ['ENG', 'LIT', 'GOV', 'CRS', 'MTH'],
    jambCutoff: 270,
    careers: ['Advocate / Solicitor', 'Corporate Legal Counsel', 'Judge / Magistrate', 'Arbitrator'],
    topUnis: ['UNILAG', 'UI', 'UNIBEN', 'LASU', 'ABU Zaria']
  },
  {
    name: 'Accounting & Finance',
    faculty: 'Commercial & Management',
    required: ['ENG', 'MTH', 'ECO', 'ACC', 'COMM'],
    jambCutoff: 230,
    careers: ['Chartered Accountant (ICAN)', 'Investment Banker', 'Forensic Auditor', 'Financial Analyst'],
    topUnis: ['UNILAG', 'UI', 'OAU', 'Covenant', 'UNN']
  },
  {
    name: 'Pharmacy (Pharm.D)',
    faculty: 'Pharmaceutical Sciences',
    required: ['ENG', 'MTH', 'CHE', 'BIO', 'PHY'],
    jambCutoff: 260,
    careers: ['Clinical Pharmacist', 'Drug Quality Analyst', 'Formulation Scientist'],
    topUnis: ['UI', 'UNILAG', 'UNIBEN', 'OAU', 'UNN']
  },
  {
    name: 'Economics & Public Policy',
    faculty: 'Social Sciences',
    required: ['ENG', 'MTH', 'ECO', 'GOV', 'GEO'],
    jambCutoff: 220,
    careers: ['Economic Policy Analyst', 'Data Strategist', 'Central Bank Executive', 'Management Consultant'],
    topUnis: ['UI', 'UNILAG', 'OAU', 'UNN', 'LASU']
  }
];

export default function ExamSuccess({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');

  // --- Tool 1: CBT Practice State ---
  const [cbtSubject, setCbtSubject] = useState('Use of English');
  const [cbtIndex, setCbtIndex] = useState(0);
  const [cbtAnswers, setCbtAnswers] = useState({});
  const [cbtSubmitted, setCbtSubmitted] = useState(false);

  // --- Tool 2: Mock Analyzer State ---
  const [analyzerForm, setAnalyzerForm] = useState({
    s2: 'Mathematics',
    s3: 'Physics',
    s4: 'Chemistry',
    sc1: 68,
    sc2: 72,
    sc3: 65,
    sc4: 60
  });
  const [analyzerResult, setAnalyzerResult] = useState(null);

  // --- Tool 3: Score Predictor Engine State ---
  const [predSubs, setPredSubs] = useState({ s2: 'Mathematics', s3: 'Physics', s4: 'Chemistry' });
  const [predExamActive, setPredExamActive] = useState(false);
  const [predQuestions, setPredQuestions] = useState([]);
  const [predIdx, setPredIdx] = useState(0);
  const [predAnswers, setPredAnswers] = useState({});
  const [predTimer, setPredTimer] = useState(1200); // 20 mins
  const [predResult, setPredResult] = useState(null);

  // --- Tool 4: Career Advisor State ---
  const [selectedSubjects, setSelectedSubjects] = useState(['ENG', 'MTH', 'BIO', 'CHE', 'PHY']);
  const [advisorResults, setAdvisorResults] = useState([]);

  // CBT Timer for Predictor
  useEffect(() => {
    let interval = null;
    if (predExamActive && predTimer > 0 && !predResult) {
      interval = setInterval(() => {
        setPredTimer((prev) => prev - 1);
      }, 1000);
    } else if (predTimer === 0 && predExamActive && !predResult) {
      finishPredictor();
    }
    return () => clearInterval(interval);
  }, [predExamActive, predTimer, predResult]);

  // Handler: Start CBT Predictor
  const startPredictorExam = () => {
    const subjects = ['Use of English', predSubs.s2, predSubs.s3, predSubs.s4];
    let pool = [];
    subjects.forEach((sub) => {
      if (mockQuestionBank[sub]) {
        mockQuestionBank[sub].forEach((q) => pool.push({ ...q, subject: sub }));
      }
    });

    if (pool.length === 0) {
      // Fallback
      Object.keys(mockQuestionBank).forEach((sub) => {
        mockQuestionBank[sub].forEach((q) => pool.push({ ...q, subject: sub }));
      });
    }

    setPredQuestions(pool);
    setPredIdx(0);
    setPredAnswers({});
    setPredTimer(900); // 15 mins test
    setPredResult(null);
    setPredExamActive(true);
  };

  // Handler: Finish Predictor Exam
  const finishPredictor = () => {
    let score = 0;
    let weakTopics = [];

    predQuestions.forEach((q, idx) => {
      if (predAnswers[idx] === q.ans) {
        score++;
      } else {
        weakTopics.push(q.topic);
      }
    });

    const projectedTotal = Math.round((score / Math.max(1, predQuestions.length)) * 400);
    setPredResult({
      score,
      totalQ: predQuestions.length,
      projectedTotal,
      lowerBound: Math.max(0, projectedTotal - 15),
      upperBound: Math.min(400, projectedTotal + 20),
      weakTopics: [...new Set(weakTopics)]
    });
    setPredExamActive(false);
  };

  // Handler: Analyze Scores
  const handleAnalyzeMock = (e) => {
    e.preventDefault();
    const sc1 = Number(analyzerForm.sc1) || 0;
    const sc2 = Number(analyzerForm.sc2) || 0;
    const sc3 = Number(analyzerForm.sc3) || 0;
    const sc4 = Number(analyzerForm.sc4) || 0;
    const total = sc1 + sc2 + sc3 + sc4;

    const subjects = ['Use of English', analyzerForm.s2, analyzerForm.s3, analyzerForm.s4];
    const scores = [sc1, sc2, sc3, sc4];

    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const weakSubj = subjects[scores.indexOf(minScore)];
    const strongSubj = subjects[scores.indexOf(maxScore)];

    let track = "General Sciences & Tech";
    if (subjects.includes('Biology')) track = "Medical & Life Sciences";
    else if (subjects.includes('Principles of Accounts') || subjects.includes('Commerce')) track = "Commercial & Management";
    else if (subjects.includes('Literature in English') || subjects.includes('Government')) track = "Law, Arts & Humanities";

    setAnalyzerResult({
      total,
      track,
      weakSubj,
      minScore,
      strongSubj,
      maxScore
    });
  };

  // Handler: Run Career Advisor Matching
  const runCareerSearch = () => {
    const matches = universityCourses.map((course) => {
      const matchCount = course.required.filter((sub) => selectedSubjects.includes(sub)).length;
      const matchPercent = Math.round((matchCount / course.required.length) * 100);
      return { ...course, matchPercent };
    }).filter((c) => c.matchPercent >= 60).sort((a, b) => b.matchPercent - a.matchPercent);

    setAdvisorResults(matches);
  };

  const featurePillars = [
    {
      id: 'cbt-practice',
      title: 'WAEC Past Questions & CBT Practice',
      desc: 'Simulated computer-based practice covering SSCE & UTME subjects with instant grading and step-by-step explanations.',
      badge: 'SSCE Prep',
      icon: <FileText className="w-8 h-8 text-green-primary" />,
      button: 'Launch CBT Simulator'
    },
    {
      id: 'mock-analyzer',
      title: 'Official JAMB Mock Analyzer',
      desc: 'Analyze your performance breakdown across subjects to identify weakness areas and safe university cut-offs.',
      badge: 'UTME Analytics',
      icon: <BarChart3 className="w-8 h-8 text-green-primary" />,
      button: 'Run Mock Analyzer'
    },
    {
      id: 'score-predictor',
      title: 'JAMB Score Predictor',
      desc: 'Diagnostic hyper-mock engine forecasting prospective university admission marks based on timed questions.',
      badge: 'Score AI',
      icon: <Target className="w-8 h-8 text-green-primary" />,
      button: 'Take Hyper-Mock'
    },
    {
      id: 'career-advisor',
      title: 'Course & Career Advisor',
      desc: 'Match your WAEC and JAMB subject combinations directly to Nigerian university course entry cut-offs.',
      badge: 'Career Portal',
      icon: <GraduationCap className="w-8 h-8 text-green-primary" />,
      button: 'Find Eligible Courses'
    }
  ];

  return (
    <div className="pt-[72px]">
      {/* Top Banner */}
      <section className="bg-[#06452C] text-white py-14 lg:py-18 px-6 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-emerald-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ACADEMIC EXCELLENCE & CBT SUITE
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            WAEC, JAMB & BECE Interactive Hub
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl leading-relaxed">
            All 4 official tools are fully active. Take timed CBT practice tests, simulate your JAMB trajectory, analyze mock scores, and match your course cut-offs.
          </p>

          {/* Interactive Navigation Pills */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {[
              { id: 'overview', label: 'Hub Overview', icon: Sparkles },
              { id: 'cbt-practice', label: 'WAEC CBT Practice', icon: FileText },
              { id: 'mock-analyzer', label: 'JAMB Mock Analyzer', icon: BarChart3 },
              { id: 'score-predictor', label: 'Score Predictor', icon: Target },
              { id: 'career-advisor', label: 'Course Advisor', icon: GraduationCap },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-green-primary shadow-md scale-105'
                      : 'bg-white/10 text-emerald-100 hover:bg-white/20'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="px-3.5 py-1 rounded-full bg-green-light text-green-primary text-xs font-extrabold uppercase tracking-wider">
                Exams Mastery Tools
              </span>
              <h2 className="text-3xl font-extrabold text-[#1B2521] mt-3">Why Our Candidates Excel</h2>
              <p className="text-sm text-[#55635C] mt-2">
                Click on any of the interactive tools below to practice past questions, run analytics, or check admission cut-offs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featurePillars.map((fp) => (
                <div
                  key={fp.id}
                  className="p-8 rounded-3xl bg-[#F8FAFA] border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all hover:border-green-primary/30 group"
                >
                  <div className="flex items-start gap-5">
                    <div className="text-3xl p-4 rounded-2xl bg-green-light text-green-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                      {fp.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold tracking-wider uppercase text-green-primary bg-green-50 px-2.5 py-1 rounded-md border border-green-primary/20">
                        {fp.badge}
                      </span>
                      <h3 className="font-extrabold text-lg text-[#1B2521] mt-2 mb-2">{fp.title}</h3>
                      <p className="text-xs sm:text-sm text-[#55635C] leading-relaxed">{fp.desc}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200/60 flex justify-end">
                    <button
                      onClick={() => setActiveTab(fp.id)}
                      className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-green-primary hover:bg-green-dark transition-all shadow-sm flex items-center gap-1.5"
                    >
                      {fp.button} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. CBT PRACTICE TEST TAB */}
      {activeTab === 'cbt-practice' && (
        <section className="py-12 px-6 bg-[#F8FAFA]">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-green-primary uppercase tracking-wider">CBT TEST SIMULATOR</span>
                <h2 className="text-2xl font-extrabold text-[#1B2521]">WAEC & SSCE CBT Practice</h2>
              </div>

              {/* Subject Selector */}
              <select
                value={cbtSubject}
                onChange={(e) => {
                  setCbtSubject(e.target.value);
                  setCbtIndex(0);
                  setCbtAnswers({});
                  setCbtSubmitted(false);
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#1B2521] bg-[#FAFCFA] focus:border-green-primary"
              >
                {Object.keys(mockQuestionBank).map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Question Area */}
            {(() => {
              const currentQuestions = mockQuestionBank[cbtSubject] || [];
              const q = currentQuestions[cbtIndex];

              if (!q) return <div>No questions available for this subject.</div>;

              return (
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-xs text-gray-500 font-bold">
                    <span>Question {cbtIndex + 1} of {currentQuestions.length}</span>
                    <span className="text-green-primary font-bold">Topic: {q.topic}</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-gray-100 text-sm font-medium text-[#1B2521] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: q.q }}
                  />

                  {/* Options */}
                  <div className="space-y-2.5">
                    {q.options.map((opt) => {
                      const letter = opt.charAt(0);
                      const isSelected = cbtAnswers[cbtIndex] === letter;
                      const isCorrect = q.ans === letter;

                      let optStyle = 'border-gray-200 hover:bg-gray-50';
                      if (cbtSubmitted) {
                        if (isCorrect) optStyle = 'border-green-500 bg-green-50 text-green-900 font-bold';
                        else if (isSelected && !isCorrect) optStyle = 'border-red-500 bg-red-50 text-red-900 font-bold';
                      } else if (isSelected) {
                        optStyle = 'border-green-primary bg-green-50 text-green-primary font-bold';
                      }

                      return (
                        <button
                          key={opt}
                          disabled={cbtSubmitted}
                          onClick={() => setCbtAnswers({ ...cbtAnswers, [cbtIndex]: letter })}
                          className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-3 ${optStyle}`}
                        >
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-green-primary text-white' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {letter}
                          </span>
                          {opt.substring(3)}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation if Submitted */}
                  {cbtSubmitted && (
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                      <strong>💡 Solution & Explanation:</strong> {q.explanation}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                      disabled={cbtIndex === 0}
                      onClick={() => setCbtIndex(cbtIndex - 1)}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                    >
                      ← Previous
                    </button>

                    {!cbtSubmitted ? (
                      cbtIndex === currentQuestions.length - 1 ? (
                        <button
                          onClick={() => setCbtSubmitted(true)}
                          className="px-6 py-2 rounded-xl text-xs font-bold bg-green-primary text-white hover:bg-green-dark"
                        >
                          Submit Test & Score →
                        </button>
                      ) : (
                        <button
                          onClick={() => setCbtIndex(cbtIndex + 1)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-green-primary text-white hover:bg-green-dark"
                        >
                          Next Question →
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => {
                          setCbtAnswers({});
                          setCbtSubmitted(false);
                          setCbtIndex(0);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-800 text-white"
                      >
                        🔄 Retake Test
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* 3. JAMB MOCK ANALYZER TAB */}
      {activeTab === 'mock-analyzer' && (
        <section className="py-12 px-6 bg-[#F8FAFA]">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-6">
            <div className="text-center pb-4 border-b border-gray-100">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">UTME STRATEGIC DIAGNOSTIC</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2521] mt-1">Official JAMB Mock Result Analyzer</h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your subject scores to calculate aggregate performance, identify point leaks, and receive faculty-specific advice.
              </p>
            </div>

            <form onSubmit={handleAnalyzeMock} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-[#FAFCFA] border border-gray-200">
                  <label className="block font-bold text-gray-700 mb-1">Subject 1 (Mandatory)</label>
                  <div className="font-bold text-green-primary mb-2">✓ Use of English</div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="Score (0-100)"
                    value={analyzerForm.sc1}
                    onChange={(e) => setAnalyzerForm({ ...analyzerForm, sc1: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-bold bg-white focus:border-green-primary"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFCFA] border border-gray-200">
                  <label className="block font-bold text-gray-700 mb-1">Subject 2</label>
                  <select
                    value={analyzerForm.s2}
                    onChange={(e) => setAnalyzerForm({ ...analyzerForm, s2: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 font-bold mb-2 text-xs"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Economics">Economics</option>
                    <option value="Literature in English">Literature in English</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="Score (0-100)"
                    value={analyzerForm.sc2}
                    onChange={(e) => setAnalyzerForm({ ...analyzerForm, sc2: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-bold bg-white focus:border-green-primary"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFCFA] border border-gray-200">
                  <label className="block font-bold text-gray-700 mb-1">Subject 3</label>
                  <select
                    value={analyzerForm.s3}
                    onChange={(e) => setAnalyzerForm({ ...analyzerForm, s3: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 font-bold mb-2 text-xs"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Government">Government</option>
                    <option value="Principles of Accounts">Principles of Accounts</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="Score (0-100)"
                    value={analyzerForm.sc3}
                    onChange={(e) => setAnalyzerForm({ ...analyzerForm, sc3: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-bold bg-white focus:border-green-primary"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFCFA] border border-gray-200">
                  <label className="block font-bold text-gray-700 mb-1">Subject 4</label>
                  <select
                    value={analyzerForm.s4}
                    onChange={(e) => setAnalyzerForm({ ...analyzerForm, s4: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 font-bold mb-2 text-xs"
                  >
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Commerce">Commerce</option>
                    <option value="CRS/IRS">CRS / IRS</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="Score (0-100)"
                    value={analyzerForm.sc4}
                    onChange={(e) => setAnalyzerForm({ ...analyzerForm, sc4: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-bold bg-white focus:border-green-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-extrabold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md mt-2 uppercase tracking-wider"
              >
                Generate Admission Diagnostic Report →
              </button>
            </form>

            {analyzerResult && (
              <div className="mt-8 p-6 rounded-3xl bg-[#FAFCFA] border border-gray-200 space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase text-gray-400">Total Aggregate UTME Score</span>
                  <div className="text-5xl font-black text-[#1B2521] mt-1">{analyzerResult.total} <span className="text-lg text-gray-400 font-normal">/ 400</span></div>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                    Faculty Track: {analyzerResult.track}
                  </span>
                </div>

                <div className="p-4 rounded-2xl border text-xs leading-relaxed space-y-2 bg-white">
                  <div className="font-extrabold text-sm text-[#1B2521]">
                    {analyzerResult.total >= 270 ? '🔥 Elite Admission Tier' : analyzerResult.total >= 220 ? '✅ Strong Benchmark' : '⚠️ Danger Zone — Targeted Revision Required'}
                  </div>
                  <p className="text-gray-600">
                    Your strongest subject is <strong className="text-green-primary">{analyzerResult.strongSubj} ({analyzerResult.maxScore}/100)</strong>. However, point leaks were detected in <strong className="text-red-600">{analyzerResult.weakSubj} ({analyzerResult.minScore}/100)</strong>.
                  </p>
                  <p className="text-gray-600">
                    <strong>Strategy Advice:</strong> For {analyzerResult.track}, plug the {analyzerResult.weakSubj} gap first before taking further timed mock exams.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. SCORE PREDICTOR HYPER-MOCK TAB */}
      {activeTab === 'score-predictor' && (
        <section className="py-12 px-6 bg-[#F8FAFA]">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-6">
            {!predExamActive && !predResult ? (
              <div className="text-center max-w-xl mx-auto space-y-6">
                <div>
                  <span className="text-xs font-bold text-green-primary uppercase tracking-wider">MOCK DIAGNOSTIC ENGINE</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2521] mt-1">Calculate Your JAMB Trajectory</h2>
                  <p className="text-xs text-gray-500 mt-2">
                    Timed diagnostic test with high-probability questions. Discover your projected UTME score under real exam conditions.
                  </p>
                </div>

                <div className="bg-[#FAFCFA] p-6 rounded-2xl border border-gray-200 text-left space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subject 1 (Compulsory)</label>
                    <div className="p-3 bg-emerald-50 text-green-primary font-bold rounded-xl border border-emerald-200">
                      ✓ Use of English
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subject 2</label>
                    <select
                      value={predSubs.s2}
                      onChange={(e) => setPredSubs({ ...predSubs, s2: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subject 3</label>
                    <select
                      value={predSubs.s3}
                      onChange={(e) => setPredSubs({ ...predSubs, s3: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subject 4</label>
                    <select
                      value={predSubs.s4}
                      onChange={(e) => setPredSubs({ ...predSubs, s4: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold"
                    >
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>

                  <button
                    onClick={startPredictorExam}
                    className="w-full py-4 rounded-xl font-extrabold text-sm text-white bg-green-primary hover:bg-green-dark transition-all shadow-md uppercase tracking-wider"
                  >
                    Launch Hyper-Mock Exam →
                  </button>
                </div>
              </div>
            ) : predExamActive ? (
              /* ACTIVE TEST MODE */
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#06452C] text-white p-4 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-emerald-300 font-bold uppercase">Subject</span>
                    <div className="font-extrabold text-sm">{predQuestions[predIdx]?.subject}</div>
                  </div>

                  <div className="font-mono text-base font-extrabold bg-black/40 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-300">
                    ⏱️ {Math.floor(predTimer / 60)}:{(predTimer % 60).toString().padStart(2, '0')}
                  </div>

                  <button
                    onClick={finishPredictor}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                  >
                    Submit Exam
                  </button>
                </div>

                {/* Question */}
                <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-gray-200 text-sm text-[#1B2521] font-medium"
                  dangerouslySetInnerHTML={{ __html: predQuestions[predIdx]?.q }}
                />

                {/* Options */}
                <div className="space-y-2">
                  {predQuestions[predIdx]?.options.map((opt) => {
                    const letter = opt.charAt(0);
                    const isSelected = predAnswers[predIdx] === letter;
                    return (
                      <button
                        key={opt}
                        onClick={() => setPredAnswers({ ...predAnswers, [predIdx]: letter })}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-3 ${
                          isSelected ? 'border-green-primary bg-green-50 text-green-primary font-bold' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-green-primary text-white' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {letter}
                        </span>
                        {opt.substring(3)}
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigator */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    disabled={predIdx === 0}
                    onClick={() => setPredIdx(predIdx - 1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 disabled:opacity-40"
                  >
                    ← Prev
                  </button>

                  <div className="flex gap-1 overflow-x-auto max-w-xs py-1">
                    {predQuestions.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPredIdx(i)}
                        className={`w-7 h-7 rounded-md text-xs font-bold flex-shrink-0 ${
                          predIdx === i
                            ? 'bg-green-primary text-white'
                            : predAnswers[i]
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={predIdx === predQuestions.length - 1}
                    onClick={() => setPredIdx(predIdx + 1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-green-primary text-white disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            ) : (
              /* RESULTS AFTER EXAM */
              <div className="text-center space-y-6">
                <div className="p-8 rounded-3xl bg-[#06452C] text-white space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Projected UTME Score</span>
                  <div className="text-6xl font-black text-white">{predResult.projectedTotal}</div>
                  <p className="text-xs text-emerald-200 font-bold">Estimated Range: {predResult.lowerBound} – {predResult.upperBound}</p>
                </div>

                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs space-y-2">
                  <h4 className="font-extrabold text-amber-900 text-sm">🚨 Targeted Revision Topics</h4>
                  <p className="text-amber-800">Focus your study efforts on these missed areas before final examination:</p>
                  <ul className="list-disc pl-5 text-amber-900 space-y-1">
                    {predResult.weakTopics.map((topic, idx) => (
                      <li key={idx}><strong>{topic}</strong></li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setPredResult(null)}
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-gray-800 text-white"
                >
                  🔄 Retake Mock Test
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. COURSE & CAREER ADVISOR TAB */}
      {activeTab === 'career-advisor' && (
        <section className="py-12 px-6 bg-[#F8FAFA]">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-6">
            <div className="text-center pb-4 border-b border-gray-100">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">UNIVERSITY ADMISSION MATCHER</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2521] mt-1">Course & Career Advisor</h2>
              <p className="text-xs text-gray-500 mt-1">
                Select your WAEC/JAMB subjects to discover qualifying university degree courses in Nigeria.
              </p>
            </div>

            {/* Subject Selector Checklist */}
            <div className="space-y-4">
              <label className="block text-xs font-extrabold text-gray-700">
                Choose Subjects (English & Math auto-included):
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {[
                  { code: 'ENG', name: 'English Language', locked: true },
                  { code: 'MTH', name: 'General Mathematics', locked: true },
                  { code: 'BIO', name: 'Biology' },
                  { code: 'CHE', name: 'Chemistry' },
                  { code: 'PHY', name: 'Physics' },
                  { code: 'ICT', name: 'Computer Studies' },
                  { code: 'ECO', name: 'Economics' },
                  { code: 'GOV', name: 'Government' },
                  { code: 'LIT', name: 'Literature in English' },
                  { code: 'ACC', name: 'Principles of Accounts' },
                  { code: 'COMM', name: 'Commerce' },
                  { code: 'CRS', name: 'CRK / IRK' },
                ].map((sub) => {
                  const isChecked = selectedSubjects.includes(sub.code);
                  return (
                    <button
                      key={sub.code}
                      type="button"
                      disabled={sub.locked}
                      onClick={() => {
                        if (sub.locked) return;
                        if (isChecked) setSelectedSubjects(selectedSubjects.filter((s) => s !== sub.code));
                        else setSelectedSubjects([...selectedSubjects, sub.code]);
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-green-primary bg-green-50 text-green-primary font-bold'
                          : 'border-gray-200 bg-[#FAFCFA] text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{sub.name}</span>
                      <span className="text-[10px] font-bold opacity-60">({sub.code})</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={runCareerSearch}
                className="w-full py-4 rounded-2xl font-extrabold text-sm text-white bg-green-primary hover:bg-green-dark transition-all shadow-md mt-4"
              >
                ✨ Search Qualifying Degree Courses →
              </button>
            </div>

            {/* Matched Courses Results */}
            {advisorResults.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="font-extrabold text-lg text-[#1B2521]">
                  Matching University Degree Programs ({advisorResults.length} Found)
                </h3>

                <div className="space-y-3">
                  {advisorResults.map((course, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#FAFCFA] border border-gray-200 text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                            {course.faculty}
                          </span>
                          <h4 className="font-extrabold text-sm text-[#1B2521] mt-1">{course.name}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-extrabold text-xs">
                          {course.matchPercent}% Subject Match
                        </span>
                      </div>

                      <div className="text-gray-600">
                        <strong>Required Combination:</strong> {course.required.join(' + ')} · <strong>JAMB Benchmark:</strong> {course.jambCutoff}+
                      </div>

                      <div className="text-gray-600">
                        <strong>Top Institutions:</strong> {course.topUnis.join(', ')}
                      </div>

                      <div className="text-emerald-800 font-medium">
                        <strong>Career Opportunities:</strong> {course.careers.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
