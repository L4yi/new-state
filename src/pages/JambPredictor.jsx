import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles, Clock, CheckCircle2, AlertTriangle, ArrowRight,
  RotateCcw, BookOpen, Target, Check, Search, Share2, Award,
  Flame, HelpCircle, ChevronRight, Compass, Layers, Zap, X
} from 'lucide-react';
import {
  NIGERIAN_JAMB_SUBJECTS,
  POPULAR_COMBOS,
  jambQuestionBank
} from '../data/jambQuestionBank';

export default function JambPredictor({ onNavigate }) {
  // Step state: 'setup' | 'exam' | 'results'
  const [currentStep, setCurrentStep] = useState('setup');

  // Step 1: Subject Selection & Configuration
  const [selectedSubjects, setSelectedSubjects] = useState({
    s1: 'Use of English',
    s2: 'Mathematics',
    s3: 'Physics',
    s4: 'Chemistry',
  });
  const [targetScore, setTargetScore] = useState(280);
  const [setupError, setSetupError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);

  // Step 2: CBT Exam Engine State
  const [questionPool, setQuestionPool] = useState([]);
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [responses, setResponses] = useState({}); // { 0: 'A', 1: 'C', ... }
  const [secondsRemaining, setSecondsRemaining] = useState(2100); // 35 minutes (2100s)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Step 3: Diagnostic Review State
  const [showSolutionReview, setShowSolutionReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'incorrect' | 'correct'

  const timerRef = useRef(null);

  // Group subjects by category for clean organized dropdowns
  const groupedSubjects = useMemo(() => {
    const map = {};
    NIGERIAN_JAMB_SUBJECTS.forEach((sub) => {
      if (!map[sub.category]) map[sub.category] = [];
      map[sub.category].push(sub.name);
    });
    return map;
  }, []);

  // Handle 1-Click Popular Combo Preset
  const handleApplyPreset = (combo) => {
    setSelectedSubjects({
      s1: combo.subjects[0] || 'Use of English',
      s2: combo.subjects[1] || 'Mathematics',
      s3: combo.subjects[2] || 'Physics',
      s4: combo.subjects[3] || 'Chemistry',
    });
    setSetupError('');
  };

  // Launch CBT Exam & Build 50-Question Pool
  const handleLaunchCBT = () => {
    const { s1, s2, s3, s4 } = selectedSubjects;
    if (!s2 || !s3 || !s4) {
      setSetupError('Please select all three elective subjects before launching the predictor.');
      return;
    }

    const subList = [s1, s2, s3, s4];
    if (new Set(subList).size !== subList.length) {
      setSetupError('You have selected duplicate subjects. Please choose 3 distinct elective subjects.');
      return;
    }

    setSetupError('');
    setIsInitializing(true);

    setTimeout(() => {
      // Assemble 50 questions across the 4 chosen subjects
      // English gets ~14 questions, the 3 electives get ~12 questions each
      const assembledPool = [];
      const distribution = [
        { name: s1, count: 14 },
        { name: s2, count: 12 },
        { name: s3, count: 12 },
        { name: s4, count: 12 },
      ];

      distribution.forEach(({ name, count }) => {
        const bank = jambQuestionBank[name] || jambQuestionBank['Use of English'];
        // Repeat or sample to fill target count
        for (let i = 0; i < count; i++) {
          const baseQ = bank[i % bank.length];
          assembledPool.push({
            id: `Q-${assembledPool.length + 1}`,
            subject: name,
            question: baseQ.q,
            options: baseQ.options,
            ans: baseQ.ans,
            topic: baseQ.topic || `${name} Core Theory`,
            explanation: baseQ.explanation || 'Refer to the standard UTME syllabus for this concept.',
          });
        }
      });

      setQuestionPool(assembledPool);
      setResponses({});
      setActiveQIndex(0);
      setSecondsRemaining(2100);
      setIsInitializing(false);
      setCurrentStep('exam');
      setIsTimerRunning(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // Countdown Clock Effect
  useEffect(() => {
    if (isTimerRunning && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, secondsRemaining]);

  // Answer selection
  const handleSelectOption = (qIndex, selectedOptionLetter) => {
    setResponses((prev) => ({
      ...prev,
      [qIndex]: selectedOptionLetter,
    }));
  };

  // Confirm and calculate diagnostic results
  const handleFinalSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setShowSubmitModal(false);
    setCurrentStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format MM:SS
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Results Calculation
  const resultsData = useMemo(() => {
    if (questionPool.length === 0) return null;

    let correctCount = 0;
    const weakTopicsMap = {};
    const subjectBreakdown = {};

    [selectedSubjects.s1, selectedSubjects.s2, selectedSubjects.s3, selectedSubjects.s4].forEach((sub) => {
      subjectBreakdown[sub] = { correct: 0, total: 0 };
    });

    questionPool.forEach((q, idx) => {
      const userAns = responses[idx];
      const isCorrect = userAns === q.ans;

      if (subjectBreakdown[q.subject]) {
        subjectBreakdown[q.subject].total += 1;
        if (isCorrect) subjectBreakdown[q.subject].correct += 1;
      }

      if (isCorrect) {
        correctCount += 1;
      } else {
        const topicName = q.topic || `${q.subject} General`;
        if (!weakTopicsMap[topicName]) {
          weakTopicsMap[topicName] = { topic: topicName, subject: q.subject, count: 0 };
        }
        weakTopicsMap[topicName].count += 1;
      }
    });

    // Score scaled out of 400
    const rawScore = (correctCount / questionPool.length) * 400;
    const projectedScore = Math.round(rawScore);
    const lowerMargin = Math.max(0, projectedScore - 12);
    const upperMargin = Math.min(400, projectedScore + 18);

    // Rank weak topics
    const sortedWeakTopics = Object.values(weakTopicsMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      correctCount,
      totalCount: questionPool.length,
      projectedScore,
      lowerMargin,
      upperMargin,
      subjectBreakdown,
      sortedWeakTopics,
    };
  }, [questionPool, responses, selectedSubjects]);

  const answeredCount = Object.keys(responses).length;
  const unansweredCount = Math.max(0, questionPool.length - answeredCount);

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#1B2521] font-sans pb-16">
      {/* ================= HERO HEADER ================= */}
      <section className="bg-[#06452C] text-white pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url('/nigerian-students.jpg')` }}
        />
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-black tracking-wide">
            <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>50-Question Hyper-Mock • Real Exam Pressure</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Calculate Your <span className="text-[#FDE68A]">JAMB Trajectory</span>
          </h1>

          <p className="text-xs sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            50 high-probability past questions across your chosen Nigerian subjects. 35 minutes. Find out exactly what score you would achieve if you took the UTME examination today.
          </p>
        </div>
      </section>

      {/* ================= STEP 1: SETUP & SUBJECT SELECTION ================= */}
      {currentStep === 'setup' && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-6">
          {/* Main Setup Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-gray-100 space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-[#06452C] font-black text-sm flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-[#1B2521]">
                    Select Your 4 UTME Subject Combination
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden sm:inline-block">
                  2026/2027 Syllabus
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Use of English is mandatory for all UTME candidates. Select your 3 elective subjects based on your desired course of study.
              </p>
            </div>

            {/* 1-Click Popular Combo Presets */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Popular Course Combinations:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {POPULAR_COMBOS.map((combo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(combo)}
                    className="p-3 rounded-2xl border border-gray-200/80 hover:border-emerald-500 bg-[#FAFCFA] hover:bg-emerald-50/60 text-left transition-all group flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <span className="text-xl">{combo.icon}</span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-100 text-[#06452C]">
                        Cutoff {combo.targetCutoff}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-black text-[#1B2521] group-hover:text-green-primary">
                        {combo.title}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate mt-0.5">
                        {combo.subjects.slice(1).join(' + ')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Subject Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Subject 1 (Mandatory) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-800 flex items-center justify-between">
                  <span>Subject 1 (Mandatory)</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Compulsory
                  </span>
                </label>
                <div className="w-full p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-300 text-[#06452C] font-black text-sm flex items-center justify-between">
                  <span>✓ Use of English</span>
                  <Check className="w-4 h-4 text-green-primary" />
                </div>
              </div>

              {/* Subject 2 */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-800">
                  Subject 2 (Elective)
                </label>
                <select
                  value={selectedSubjects.s2}
                  onChange={(e) => setSelectedSubjects({ ...selectedSubjects, s2: e.target.value })}
                  className="w-full p-3.5 rounded-2xl border border-gray-200 bg-[#FAFCFA] text-sm font-bold text-[#1B2521] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-green-primary transition-all"
                >
                  <option value="">-- Choose Subject 2 --</option>
                  {Object.entries(groupedSubjects).map(([category, subs]) => (
                    <optgroup key={category} label={category}>
                      {subs.filter((s) => s !== 'Use of English').map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Subject 3 */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-800">
                  Subject 3 (Elective)
                </label>
                <select
                  value={selectedSubjects.s3}
                  onChange={(e) => setSelectedSubjects({ ...selectedSubjects, s3: e.target.value })}
                  className="w-full p-3.5 rounded-2xl border border-gray-200 bg-[#FAFCFA] text-sm font-bold text-[#1B2521] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-green-primary transition-all"
                >
                  <option value="">-- Choose Subject 3 --</option>
                  {Object.entries(groupedSubjects).map(([category, subs]) => (
                    <optgroup key={category} label={category}>
                      {subs.filter((s) => s !== 'Use of English').map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Subject 4 */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-800">
                  Subject 4 (Elective)
                </label>
                <select
                  value={selectedSubjects.s4}
                  onChange={(e) => setSelectedSubjects({ ...selectedSubjects, s4: e.target.value })}
                  className="w-full p-3.5 rounded-2xl border border-gray-200 bg-[#FAFCFA] text-sm font-bold text-[#1B2521] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-green-primary transition-all"
                >
                  <option value="">-- Choose Subject 4 --</option>
                  {Object.entries(groupedSubjects).map(([category, subs]) => (
                    <optgroup key={category} label={category}>
                      {subs.filter((s) => s !== 'Use of English').map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Score Selector */}
            <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-300 tracking-widest block">
                  Target Ambition Score
                </span>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Set your desired target score for university admissions matching
                </p>
              </div>
              <div className="flex items-center gap-2">
                {[240, 260, 280, 300].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setTargetScore(score)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      targetScore === score
                        ? 'bg-emerald-400 text-emerald-950 shadow-md'
                        : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                    }`}
                  >
                    {score}+
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {setupError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{setupError}</span>
              </div>
            )}

            {/* Launch Button */}
            <button
              type="button"
              onClick={handleLaunchCBT}
              disabled={isInitializing}
              className="w-full py-4 px-6 rounded-2xl bg-green-primary hover:bg-green-dark text-white font-black text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {isInitializing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Calibrating 50-Question Hyper-Mock...</span>
                </>
              ) : (
                <>
                  <span>Launch CBT Score Predictor (35 Mins)</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* ================= STEP 2: CBT EXAM SIMULATION ENGINE ================= */}
      {currentStep === 'exam' && questionPool.length > 0 && (
        <section className="max-w-5xl mx-auto px-3 sm:px-6 -mt-4 relative z-20 space-y-4">
          {/* Top Control Bar */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-md border border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-[#06452C] font-black text-xs border border-emerald-200">
                {questionPool[activeQIndex]?.subject}
              </span>
              <span className="text-xs font-bold text-gray-500">
                Question {activeQIndex + 1} of {questionPool.length}
              </span>
            </div>

            {/* Floating Timer Box */}
            <div className={`px-4 py-2 rounded-xl font-mono text-sm sm:text-base font-black flex items-center gap-2 shadow-inner ${
              secondsRemaining <= 300
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-950 text-emerald-300'
            }`}>
              <Clock className="w-4 h-4 text-emerald-300" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md cursor-pointer ml-auto sm:ml-0"
            >
              Submit Exam
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Main Question Area */}
            <div className="lg:col-span-8 bg-white p-5 sm:p-8 rounded-3xl border border-gray-100 shadow-md flex flex-col justify-between min-h-[420px]">
              <div>
                <div className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Topic: {questionPool[activeQIndex]?.topic}</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#1B2521] leading-relaxed mb-5"
                  dangerouslySetInnerHTML={{ __html: questionPool[activeQIndex]?.question }}
                />

                {/* Radio Options */}
                <div className="space-y-2.5">
                  {questionPool[activeQIndex]?.options.map((optStr, optIdx) => {
                    const letter = optStr.charAt(0); // 'A', 'B', 'C', 'D'
                    const isSelected = responses[activeQIndex] === letter;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(activeQIndex, letter)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-green-primary text-[#06452C] ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-[#FAFCFA] border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300'
                        }`}
                      >
                        <span>{optStr}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black ${
                          isSelected
                            ? 'bg-green-primary border-green-primary text-white'
                            : 'border-gray-300 text-transparent'
                        }`}>
                          ✓
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prev / Next Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  disabled={activeQIndex === 0}
                  onClick={() => setActiveQIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>

                <div className="text-[11px] text-gray-400 font-bold">
                  {answeredCount} answered · {unansweredCount} remaining
                </div>

                <button
                  type="button"
                  disabled={activeQIndex === questionPool.length - 1}
                  onClick={() => setActiveQIndex((prev) => Math.min(questionPool.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-[#06452C] text-white text-xs font-black hover:bg-[#0B5D3B] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Right Question Palette Grid */}
            <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-md space-y-3">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                <h4 className="font-black text-xs text-[#1B2521] uppercase tracking-wider">
                  50-Question Palette
                </h4>
                <span className="text-[10px] text-emerald-800 font-black bg-emerald-50 px-2 py-0.5 rounded">
                  {answeredCount}/50 Done
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-1.5 max-h-[340px] overflow-y-auto pr-1">
                {questionPool.map((_, i) => {
                  const isAnswered = responses[i] !== undefined;
                  const isActive = activeQIndex === i;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveQIndex(i)}
                      className={`h-9 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
                        isActive
                          ? 'bg-[#06452C] text-white ring-2 ring-emerald-400 scale-105 shadow-sm'
                          : isAnswered
                          ? 'bg-emerald-100 text-[#06452C] border border-emerald-300 font-black'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-500 flex justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span> Unanswered
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= SUBMIT SAFETY MODAL ================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-[#1B2521]">
              Submit Your CBT Predictor Exam?
            </h3>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 text-xs text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span>Total Answered:</span>
                <strong className="text-green-primary">{answeredCount} of 50</strong>
              </div>
              <div className="flex justify-between">
                <span>Unanswered Questions:</span>
                <strong className={unansweredCount > 0 ? 'text-rose-600' : 'text-gray-600'}>
                  {unansweredCount}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Time Remaining:</span>
                <strong>{formatTimer(secondsRemaining)}</strong>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-[11px] text-amber-800 font-medium">
                You have {unansweredCount} unanswered questions. They will be marked incorrect if you submit now.
              </p>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Return to Exam
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="py-3 rounded-xl bg-green-primary hover:bg-green-dark text-white text-xs font-black shadow-md cursor-pointer"
              >
                Yes, Final Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 3: SCORE PROJECTION & AI DIAGNOSTIC REPORT ================= */}
      {currentStep === 'results' && resultsData && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-6 animate-fadeIn">
          {/* Main Score Prediction Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 text-center space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#06452C] font-black text-xs border border-emerald-200">
              <Award className="w-4 h-4 text-green-primary" />
              <span>Diagnostic Assessment Complete</span>
            </div>

            <div>
              <div className="text-xs font-black text-gray-500 uppercase tracking-widest">
                Projected JAMB Score (Out of 400)
              </div>
              <div className="text-5xl sm:text-6xl font-black text-[#06452C] tracking-tight my-2">
                {resultsData.projectedScore}
              </div>
              <div className="inline-block px-4 py-1.5 rounded-xl bg-emerald-100 text-[#06452C] font-black text-xs sm:text-sm border border-emerald-300">
                Confidence Range: {resultsData.lowerMargin} – {resultsData.upperMargin}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFCFA] border border-gray-200/80 max-w-lg mx-auto grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block font-bold">Accuracy</span>
                <strong className="text-sm font-black text-[#1B2521]">
                  {Math.round((resultsData.correctCount / resultsData.totalCount) * 100)}%
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-bold">Correct / 50</span>
                <strong className="text-sm font-black text-green-primary">
                  {resultsData.correctCount} / {resultsData.totalCount}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-bold">Target Status</span>
                <strong className={`text-xs font-black ${
                  resultsData.projectedScore >= targetScore ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {resultsData.projectedScore >= targetScore ? '🎯 On Track!' : 'Needs Polish'}
                </strong>
              </div>
            </div>

            {/* Subject-by-Subject Score Breakdown */}
            <div className="pt-2">
              <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-3 text-left">
                Subject Performance Breakdown:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                {Object.entries(resultsData.subjectBreakdown).map(([subName, stat], idx) => {
                  const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  const estimated100 = Math.round(pct);

                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#FAFCFA] border border-gray-200/80 space-y-1">
                      <div className="text-xs font-black text-[#1B2521] truncate">{subName}</div>
                      <div className="text-lg font-black text-[#06452C]">{estimated100}/100</div>
                      <div className="text-[10px] text-gray-500 font-bold">
                        {stat.correct} of {stat.total} Correct
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 🚨 Emergency Revision Roadmap */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-rose-100 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                🚨
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-rose-950">
                  Emergency Revision Roadmap (Top High-Yield Weak Topics)
                </h3>
                <p className="text-xs text-gray-500">
                  Prioritize these 5 topics during your study sessions to boost your real UTME score by up to 40+ points.
                </p>
              </div>
            </div>

            {resultsData.sortedWeakTopics.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 text-xs font-bold">
                🎉 Flawless performance! You answered every question correctly across all 4 subjects.
              </div>
            ) : (
              <div className="space-y-2.5">
                {resultsData.sortedWeakTopics.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200/70 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-black text-rose-950 block">{item.topic}</span>
                      <span className="text-[10px] text-gray-500 font-medium">{item.subject}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-200/70 text-rose-900 font-black text-[10px] flex-shrink-0">
                      Missed {item.count} question{item.count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Solution Review Toggle Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#1B2521]">
                  Detailed Solution & Step-by-Step Explanations
                </h3>
                <p className="text-xs text-gray-500">
                  Inspect the correct answer and verified examiner rationale for all 50 questions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSolutionReview(!showSolutionReview)}
                className="px-4 py-2 rounded-xl bg-[#06452C] text-white font-bold text-xs hover:bg-[#0B5D3B] transition-all cursor-pointer flex-shrink-0"
              >
                {showSolutionReview ? 'Hide Solutions' : 'View Full 50 Solutions'}
              </button>
            </div>

            {showSolutionReview && (
              <div className="space-y-3 pt-2">
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      reviewFilter === 'all' ? 'bg-[#06452C] text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    All (50)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFilter('incorrect')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      reviewFilter === 'incorrect' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    Incorrect ({50 - resultsData.correctCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFilter('correct')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      reviewFilter === 'correct' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    Correct ({resultsData.correctCount})
                  </button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {questionPool
                    .filter((q, idx) => {
                      const isCorrect = responses[idx] === q.ans;
                      if (reviewFilter === 'incorrect') return !isCorrect;
                      if (reviewFilter === 'correct') return isCorrect;
                      return true;
                    })
                    .map((q, i) => {
                      const origIndex = questionPool.findIndex((item) => item.id === q.id);
                      const userChoice = responses[origIndex];
                      const isCorrect = userChoice === q.ans;

                      return (
                        <div
                          key={i}
                          className={`p-4 rounded-2xl border text-xs space-y-2 ${
                            isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[10px] font-black text-gray-500">
                              Q{origIndex + 1} · {q.subject} ({q.topic})
                            </span>
                            <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                              isCorrect ? 'bg-emerald-200 text-emerald-950' : 'bg-rose-200 text-rose-950'
                            }`}>
                              {isCorrect ? '✓ Correct' : `✗ Missed (Chose ${userChoice || 'None'})`}
                            </span>
                          </div>

                          <p className="font-bold text-gray-900" dangerouslySetInnerHTML={{ __html: q.question }} />

                          <div className="p-2.5 rounded-xl bg-white border border-gray-200 text-[11px] text-gray-700">
                            <div className="font-black text-green-primary">Correct Option: {q.ans}</div>
                            <div className="text-gray-600 mt-1 font-medium">{q.explanation}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="bg-gradient-to-br from-[#06452C] to-[#0A5637] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Close the Gap with ExamSuccess CBT Suite
              </h3>
              <p className="text-xs text-emerald-100 max-w-md">
                Get unlimited full 180-question mock exams, 15,000+ past questions, and video lessons for 2026/2027.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep('setup');
                  setResponses({});
                  setShowSolutionReview(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('buy-plan')}
                className="px-5 py-3 rounded-xl bg-[#FDE68A] hover:bg-amber-300 text-gray-950 font-black text-xs transition-all shadow-md cursor-pointer"
              >
                Unlock ExamSuccess App →
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
