import React, { useState } from 'react';

const jambSubjectsList = [
  'Agricultural Science', 'Arabic', 'Biology', 'Chemistry', 'Christian Religious Knowledge',
  'Commerce', 'Computer Studies', 'Economics', 'French', 'Geography',
  'Government', 'Hausa', 'History', 'Home Economics', 'Igbo',
  'Islamic Religious Knowledge', 'Literature in English', 'Mathematics', 'Music',
  'Physical and Health Education (PHE)', 'Physics', 'Principles of Accounts',
  'Use of English', 'Visual Art', 'Yoruba'
];

const waecSubjectsList = [
  'Agricultural Science', 'Animal Husbandry', 'Arabic', 'Biology', 'Book Keeping',
  'Catering Craft Practice', 'Chemistry', 'Christian Religious Knowledge',
  'Civic Education', 'Commerce', 'Computer Studies', 'Data Processing',
  'Economics', 'English Language', 'Financial Accounting', 'Foods and Nutrition',
  'French', 'Further Mathematics', 'General Mathematics', 'Geography',
  'Government', 'Hausa', 'Health Education', 'History', 'Home Management',
  'Igbo', 'Insurance', 'Islamic Religious Studies', 'Literature in English',
  'Marketing', 'Music', 'Office Practice', 'Physical Education', 'Physics',
  'Store Management', 'Technical Drawing', 'Visual Art', 'Yoruba'
];

const careerTips = {
  med: '💡 Medicine & Health require Use of English, Biology, Chemistry, and Physics.',
  eng: '💡 Engineering requires Use of English, Mathematics, Physics, and Chemistry.',
  comp: '💡 Computer Science requires Use of English, Mathematics, Physics, and Chemistry/ICT.',
  law: '💡 Law requires Use of English, Literature in English, Government, and CRS/IRS.',
  mass: '💡 Mass Comm requires Use of English, Literature, Government, and any other Social Science/Art subject.',
  acc: '💡 Accounting requires Use of English, Mathematics, Economics, and Financial Accounting/Commerce.',
  bus: '💡 Business requires Use of English, Mathematics, Economics, and Commerce.'
};

export default function BuyPlan({ onNavigate }) {
  const [mode, setMode] = useState('student'); // 'student' or 'corporate'
  const [selectedGoal, setSelectedGoal] = useState('');
  const [examType, setExamType] = useState('JAMB');
  const [planType, setPlanType] = useState('Full Access');
  const [activationCode, setActivationCode] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState(['Use of English']);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Corporate State
  const [corpExam, setCorpExam] = useState('Combined');
  const [corpQty, setCorpQty] = useState(20);
  const [corpOrg, setCorpOrg] = useState({ name: '', phone: '', email: '' });

  // Calculate pricing
  const getPlanPrice = () => {
    if (planType === 'Code') return '₦0.00 (Pre-paid Code)';
    if (planType === 'Free') return '₦0.00 (7-Day Free Trial)';
    if (planType === 'Monthly') return '₦1,500 / Month';

    if (examType === 'JAMB') return '₦3,500 (Full Session)';
    if (examType === 'WAEC') return '₦4,500 (Full Session)';
    return '₦6,000 (Combined WAEC + JAMB)';
  };

  const getCorpUnit = () => {
    if (corpExam === 'JAMB') return 3500;
    if (corpExam === 'WAEC') return 4500;
    return 6000;
  };

  const corpTotal = getCorpUnit() * (parseInt(corpQty) || 0);

  // Subject Toggle
  const toggleSubject = (sub) => {
    const isJamb = examType === 'JAMB';
    const limit = isJamb ? 4 : 9;

    if (selectedSubjects.includes(sub)) {
      if (sub === 'Use of English' || sub === 'English Language' || sub === 'General Mathematics') return; // locked
      setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
    } else {
      if (selectedSubjects.length >= limit) {
        alert(`You can select a maximum of ${limit} subjects for ${examType}.`);
        return;
      }
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-[72px] min-h-screen bg-[#F8FAFA] py-12 px-6">
      <div className="max-w-[850px] mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl">
        {/* Title Block */}
        <div className="text-center mb-8">
          <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold tracking-widest uppercase border border-slate-200 inline-block mb-3">
            Available to All WAEC & JAMB Candidates
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            WAEC JAMB <span className="text-blue-600 italic">Success</span>
          </h1>
          <div className="w-16 h-1 bg-[#4B5320] rounded-full mx-auto my-3" />
          <p className="text-xs sm:text-sm font-extrabold text-[#4B5320] tracking-wider">
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
          <div className="max-w-lg mx-auto space-y-6">
            {/* Warning Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-center space-y-1">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">⚠️ Payment Required</h3>
              <p className="text-xs text-amber-800">
                Your plan is <strong>NOT ACTIVE</strong> until payment is confirmed. You must complete payment below either via Paystack or Direct Bank Transfer.
              </p>
            </div>

            {/* Complete Enrollment Card */}
            <div className="p-6 rounded-3xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-4">
              <h2 className="text-xl font-extrabold text-[#0F172A] text-center">Complete Enrollment</h2>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-slate-500 font-medium">Candidate Name:</div>
                <div className="font-bold text-slate-900">{name || 'Candidate'}</div>

                <div className="text-slate-500 font-medium">Mobile Number:</div>
                <div className="font-bold text-slate-900">{phone}</div>

                <div className="text-slate-500 font-medium">Exam Type:</div>
                <div className="font-bold text-slate-900">{examType}</div>

                <div className="text-slate-500 font-medium">Access Plan:</div>
                <div className="font-bold text-slate-900">{planType}</div>
              </div>

              <div className="pt-3 border-t border-[#BAE6FD] text-center">
                <span className="text-xs text-slate-500 block uppercase font-bold">Total Amount Due:</span>
                <span className="text-3xl font-black text-[#0284C7]">{getPlanPrice()}</span>
              </div>
            </div>

            {/* Paystack Button */}
            <button
              onClick={() => {
                alert(`Redirecting to Paystack secure checkout for ₦${getPlanPrice()} (${phone})...`);
              }}
              className="w-full py-4 rounded-2xl font-extrabold text-sm text-white bg-[#22C55E] hover:bg-[#16A34A] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>💳 Pay with Paystack</span>
            </button>

            {/* Manual Bank Transfer Card */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-3 text-xs">
              <h4 className="font-extrabold text-sm text-[#0F172A]">Manual Bank Transfer</h4>
              <p className="text-slate-600">
                Pay directly to: <strong className="text-[#0F172A] block text-sm mt-1">🏦 Stanbic IBTC — 0047625465</strong>
              </p>
              <a
                href="https://wa.me/2348134000644"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800"
              >
                Send Proof of Payment via WhatsApp 💬
              </a>

              <hr className="border-[#E2E8F0] my-2" />

              <button
                onClick={() => onNavigate('candidate-login')}
                className="font-extrabold text-green-700 hover:underline block mx-auto text-xs"
              >
                ✅ Approved? Login to Candidate Portal →
              </button>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 block mx-auto pt-2"
            >
              ← Modify Selected Subjects or Plan
            </button>
          </div>
        ) : mode === 'student' ? (
          <form onSubmit={handleEnrollSubmit} className="space-y-6">
            {/* Step 1 */}
            <div>
              <h3 className="font-extrabold text-sm text-[#1B2521] mb-2">Step 1: Your Career Goal</h3>
              <select
                required
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 bg-[#FAFCFA] font-medium"
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

              {selectedGoal && careerTips[selectedGoal] && (
                <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border-l-4 border-amber-400 text-xs text-amber-900 font-medium">
                  {careerTips[selectedGoal]}
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="font-extrabold text-sm text-[#1B2521] mb-2">Step 2: Choose Exam Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'JAMB', label: 'JAMB UTME' },
                  { id: 'WAEC', label: 'WAEC / NECO' },
                  { id: 'Combined', label: 'Combined (WAEC + JAMB)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setExamType(item.id);
                      setSelectedSubjects(item.id === 'JAMB' ? ['Use of English'] : ['English Language', 'General Mathematics']);
                    }}
                    className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      examType === item.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 border-2'
                        : 'border-gray-200 bg-[#FAFCFA] text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordion: The Sauce */}
            <details className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-900 text-white overflow-hidden group">
              <summary className="p-4 sm:p-5 font-extrabold text-sm sm:text-base cursor-pointer flex justify-between items-center text-sky-400 select-none">
                <span>🔥 Here's the Sauce to Acing WAEC & JAMB (The Marathon Method)</span>
                <span className="text-xs transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="p-6 border-t border-slate-800 space-y-4 text-xs leading-relaxed text-slate-300">
                <p className="italic text-slate-400">
                  You don’t run a marathon by waking up and running 42km on day one. You build stamina. Follow this exact Training Cadence:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-800 border-t-2 border-sky-400">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-400 text-slate-950 uppercase">Phases 1 & 2</span>
                    <h4 className="font-bold text-white text-sm mt-2">The Foundation</h4>
                    <p className="text-slate-400 mt-1">Master concepts with EASY drill sessions. Once you score 18/20, move to Medium.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800 border-t-2 border-indigo-400">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-400 text-white uppercase">Phases 3 & 4</span>
                    <h4 className="font-bold text-white text-sm mt-2">Muscle Building</h4>
                    <p className="text-slate-400 mt-1">Face trick questions with HARD Practice. For every 3 Medium sessions, do 1 Hard.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800 border-t-2 border-amber-400">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase">Phase 5</span>
                    <h4 className="font-bold text-white text-sm mt-2">Endurance Mocks</h4>
                    <p className="text-slate-400 mt-1">Take 1 full Mock every two days under strict timed conditions.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800 border-t-2 border-red-400">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-400 text-white uppercase">Phase 6 (Exam Week)</span>
                    <h4 className="font-bold text-white text-sm mt-2">The Crucible</h4>
                    <p className="text-slate-400 mt-1">Daily mocks without distractions. On exam day, the real hall will feel slower and easier.</p>
                  </div>
                </div>
              </div>
            </details>

            {/* Step 3: Access Plan */}
            <div>
              <h3 className="font-extrabold text-sm text-[#1B2521] mb-2">Step 3: Access Plan</h3>
              <div className="space-y-2.5">
                {[
                  { id: 'Full Access', label: `Full Session Access (${getPlanPrice()})` },
                  { id: 'Monthly', label: 'Monthly Practice - ₦1,500' },
                  { id: 'Code', label: '🔑 I have an Activation Code (Pre-paid)' },
                  { id: 'Free', label: '7-Day Free Trial (Mandatory Subjects Only)' },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer text-xs font-bold transition-all ${
                      planType === p.id
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 border-2'
                        : 'border-gray-200 bg-[#FAFCFA] text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="planType"
                      value={p.id}
                      checked={planType === p.id}
                      onChange={() => setPlanType(p.id)}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>

              {planType === 'Code' && (
                <div className="mt-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <label className="block text-xs font-bold text-emerald-900">Enter Activation Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JAMB-A8X9-22M1"
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                    className="w-full p-3 rounded-xl border border-emerald-300 font-mono text-sm uppercase bg-white"
                  />
                  <span className="text-[11px] text-emerald-700 font-bold">Price: ₦0.00 (Pre-paid Code)</span>
                </div>
              )}
            </div>

            {/* Step 4: Subject Picker */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-extrabold text-sm text-[#1B2521]">Step 4: Select Subjects</h3>
                <span className="text-xs font-bold text-blue-600">
                  {selectedSubjects.length} / {examType === 'JAMB' ? 4 : 9} Selected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-3 rounded-2xl border border-gray-200 bg-[#FAFCFA] text-xs">
                {(examType === 'JAMB' ? jambSubjectsList : waecSubjectsList).map((sub) => {
                  const isChecked = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{sub}</span>
                      {isChecked && <span className="text-blue-600 font-bold ml-1">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Candidate Info */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-[#1B2521]">Step 5: Candidate Info</h3>
              <input
                type="tel"
                required
                placeholder="Mobile Number (e.g. 08012345678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={11}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 bg-[#FAFCFA]"
              />

              <input
                type="text"
                placeholder="Full Name (Optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 bg-[#FAFCFA]"
              />

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <span>⚠️</span>
                <span><strong>Please Note:</strong> If you already have an active plan for this exam, proceeding will extend your access.</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-extrabold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md mt-4 uppercase tracking-wider"
            >
              ENROLL & PROCEED ({getPlanPrice()}) →
            </button>
          </form>
        ) : (
          /* CORPORATE / SPONSOR MODE */
          <form onSubmit={handleEnrollSubmit} className="space-y-6 text-xs">
            <div className="text-center pb-4 border-b border-gray-100">
              <h3 className="text-xl font-extrabold text-[#1B2521]">Bulk Purchase for Schools & Donors</h3>
              <p className="text-gray-500 mt-1">Purchase Access Codes in bulk and distribute them to your students.</p>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">1. Select Exam Type</label>
              <div className="space-y-2">
                {[
                  { id: 'JAMB', label: 'JAMB Full Season (₦3,500 / Student)' },
                  { id: 'WAEC', label: 'WAEC/NECO Full Season (₦4,500 / Student)' },
                  { id: 'Combined', label: 'Combined (WAEC & JAMB) Full Season (₦6,000 / Student)' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer font-bold ${
                      corpExam === item.id ? 'border-slate-900 bg-slate-50 text-slate-900 border-2' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="corpExam"
                      value={item.id}
                      checked={corpExam === item.id}
                      onChange={() => setCorpExam(item.id)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">2. Number of Students</label>
              <input
                type="number"
                min="1"
                required
                value={corpQty}
                onChange={(e) => setCorpQty(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-gray-200 text-sm font-bold bg-[#FAFCFA]"
              />

              <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span>Price per Student:</span>
                  <strong>₦{getCorpUnit().toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <strong>{corpQty} Students</strong>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                  <span>Total to Pay:</span>
                  <span>₦{corpTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-gray-700">3. Organization / Donor Details</label>
              <input
                type="text"
                placeholder="School / Organization Name"
                value={corpOrg.name}
                onChange={(e) => setCorpOrg({ ...corpOrg, name: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-gray-200 text-sm bg-[#FAFCFA]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="tel"
                  required
                  placeholder="Phone Number (e.g. 08012345678)"
                  value={corpOrg.phone}
                  onChange={(e) => setCorpOrg({ ...corpOrg, phone: e.target.value.replace(/[^0-9]/g, '') })}
                  maxLength={11}
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-sm bg-[#FAFCFA]"
                />

                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={corpOrg.email}
                  onChange={(e) => setCorpOrg({ ...corpOrg, email: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-sm bg-[#FAFCFA]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-extrabold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md uppercase tracking-wider"
            >
              Proceed to Payment (₦{corpTotal.toLocaleString()}) →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
