import React, { useState } from 'react';

export default function BuyPlan({ onNavigate }) {
  const [mode, setMode] = useState('student'); // 'student' or 'corporate'
  const [selectedGoal, setSelectedGoal] = useState('');
  const [examType, setExamType] = useState('JAMB');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-[72px] min-h-screen bg-[#F8FAFA] py-16 px-6">
      <div className="max-w-[850px] mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl">
        {/* Title Block */}
        <div className="text-center mb-8">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold tracking-widest uppercase border border-slate-200 inline-block mb-3">
            Available to All WAEC & JAMB Candidates
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            WAEC JAMB <span className="text-blue-600 italic">Success</span>
          </h1>
          <div className="w-16 h-1 bg-[#4B5320] rounded-full mx-auto my-3" />
          <p className="text-xs sm:text-sm font-bold text-[#4B5320] uppercase tracking-wider">
            Daily Practice Reps. Exam Success Check. 💅🏾✅
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button
            onClick={() => setMode('student')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            👤 Private Candidate
          </button>
          <button
            onClick={() => setMode('corporate')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === 'corporate' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🏢 Corporate / Sponsor
          </button>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-green-light border border-green-primary/20 text-center">
            <div className="w-14 h-14 rounded-full bg-green-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-3">
              ✓
            </div>
            <h3 className="text-xl font-bold text-green-primary mb-2">Access Plan Order Placed!</h3>
            <p className="text-xs sm:text-sm text-[#55635C] max-w-md mx-auto mb-6">
              Thank you for subscribing for <strong>{phone}</strong> under the {examType} examination plan. Enter your phone number in the Candidate Login portal to begin CBT practice.
            </p>
            <button
              onClick={() => onNavigate('candidate-login')}
              className="px-6 py-2.5 rounded-lg text-xs font-bold bg-green-primary text-white hover:bg-green-dark transition-all"
            >
              Go to Candidate Login →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-extrabold text-sm text-[#1B2521] mb-2">Step 1: Your Career Goal</h3>
              <select
                required
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 bg-[#FAFCFA]"
              >
                <option value="">-- Select Goal --</option>
                <optgroup label="Science & Technology">
                  <option value="med">Medicine / Nursing / Pharmacy</option>
                  <option value="eng">Engineering / Technology</option>
                  <option value="comp">Computer Science / ICT</option>
                </optgroup>
                <optgroup label="Arts & Humanities">
                  <option value="law">Law / Political Science</option>
                  <option value="mass">Mass Communication / Journalism</option>
                </optgroup>
                <optgroup label="Commercial & Social">
                  <option value="acc">Accounting / Finance</option>
                  <option value="bus">Business / Marketing</option>
                </optgroup>
              </select>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-[#1B2521] mb-2">Step 2: Choose Exam Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {['JAMB', 'WAEC', 'Combined'].map((type) => (
                  <label
                    key={type}
                    className={`p-3.5 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                      examType === type
                        ? 'border-blue-600 bg-blue-50/60 text-blue-700 border-2'
                        : 'border-gray-200 bg-[#FAFCFA] text-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="examType"
                      value={type}
                      checked={examType === type}
                      onChange={() => setExamType(type)}
                      className="sr-only"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-[#1B2521] mb-2">Step 3: Candidate Phone Number</h3>
              <input
                type="tel"
                required
                placeholder="e.g. 08012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 bg-[#FAFCFA]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl font-extrabold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
            >
              Get Full CBT Access Now →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
