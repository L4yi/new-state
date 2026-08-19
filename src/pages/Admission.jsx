import React, { useState } from 'react';
import { School, UserCheck, Calendar, Phone, CheckCircle2, Sparkles, FileText, ArrowRight } from 'lucide-react';

export default function Admission({ onNavigate }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    age: '',
    currentClass: '',
    classApplyingFor: '',
    fatherName: '',
    motherName: '',
    guardianName: '',
    primaryPhone: '',
    altPhone: '',
    email: '',
    previousSchool: '',
    medicalConditions: '',
    referralSource: '',
    infoConfirmed: false,
    consentGiven: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const admissionOverviewCards = [
    { title: 'Entry Levels', desc: 'JSS 1, SSS 1 & Transfer Classes (JSS 2, SSS 2)', icon: <School className="w-6 h-6 text-green-primary" /> },
    { title: 'Who Can Apply', desc: 'Prospective students fulfilling entry requirements & assessment', icon: <UserCheck className="w-6 h-6 text-green-primary" /> },
    { title: 'Admission Period', desc: 'Ongoing for 2026/2027 Academic Session', icon: <Calendar className="w-6 h-6 text-green-primary" /> },
    { title: 'Contact Admissions', desc: '0813 400 0644 · info@newstateschools.org', icon: <Phone className="w-6 h-6 text-green-primary" /> }
  ];

  const steps = [
    { num: '01', title: 'Complete Online Application', desc: 'Fill out the candidate registration form below with accurate student and parent details.' },
    { num: '02', title: 'Entrance Assessment', desc: 'Candidate sits for placement test in English, Mathematics, and General Studies.' },
    { num: '03', title: 'Interview & Verification', desc: 'Short interview with the school academic panel and verification of previous school records.' },
    { num: '04', title: 'Admission Letter & Enrollment', desc: 'Successful candidates receive provisional admission letter and fee structure.' }
  ];

  return (
    <div className="pt-[72px]">
      {/* Hero Banner */}
      <section className="bg-[#06452C] text-white py-16 lg:py-20 px-6 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-green-200 mb-3">
            <span className="w-6 h-[2px] bg-green-300 inline-block" />
            STUDENT ADMISSIONS
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Start Your Journey at New State High School
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
            We welcome families who share our commitment to academic excellence and character development. Apply online for the 2026/2027 academic session.
          </p>
        </div>
      </section>

      {/* Admission Overview Bar */}
      <section className="py-12 px-6 bg-[#F8FAFA] border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {admissionOverviewCards.map((card, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="text-3xl p-2 rounded-xl bg-green-50">{card.icon}</div>
              <div>
                <h3 className="font-bold text-sm text-[#1B2521] mb-1">{card.title}</h3>
                <p className="text-xs text-[#55635C] leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase text-green-primary mb-2">
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
              APPLICATION PROCESS
              <span className="w-6 h-[2px] bg-green-primary inline-block" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#1B2521]">How to Apply in 4 Simple Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#F9FCFA] border border-green-primary/10 relative">
                <div className="text-2xl font-black text-green-primary mb-2">{st.num}</div>
                <h3 className="font-bold text-base text-[#1B2521] mb-2">{st.title}</h3>
                <p className="text-xs text-[#55635C] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-20 px-6 bg-[#F8FAFA]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
            <div className="mb-8 pb-6 border-b border-gray-100">
              <span className="px-3 py-1 rounded-full bg-green-light text-green-primary text-xs font-bold uppercase tracking-wider">
                Online Registration
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2521] mt-3">
                Student Admissions Form
              </h2>
              <p className="text-xs sm:text-sm text-[#55635C] mt-1">
                Please complete all required fields accurately. Our admissions office will review and reach out to you promptly.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-green-light border border-green-primary/20 text-center">
                <div className="w-16 h-16 rounded-full bg-green-primary text-white text-3xl font-bold flex items-center justify-center mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-extrabold text-green-primary mb-2">Thank you for your response! ✨</h3>
                <p className="text-sm text-[#55635C] max-w-md mx-auto mb-6 leading-relaxed">
                  Your student admission form for <strong className="text-[#1B2521]">{formData.studentName}</strong> has been successfully received by New State High School admissions office.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-lg text-xs font-bold bg-green-primary text-white hover:bg-green-dark transition-all"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Candidate Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-green-primary border-b pb-2">
                    1. Student Information
                  </h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-[#1B2521] mb-1">
                      Student’s Full Name (First, Middle, Last) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      required
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="e.g. Chukwuemeka David Adebayo"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1B2521] mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dob"
                        required
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1B2521] mb-1">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="age"
                        required
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="e.g. 12 years"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1B2521] mb-1">
                        Current Class
                      </label>
                      <input
                        type="text"
                        name="currentClass"
                        value={formData.currentClass}
                        onChange={handleChange}
                        placeholder="e.g. Primary 6 / JSS 3"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1B2521] mb-1">
                        Class Applying to <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="classApplyingFor"
                        required
                        value={formData.classApplyingFor}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                      >
                        <option value="">Select Class</option>
                        <option value="JSS 1">JSS 1</option>
                        <option value="JSS 2">JSS 2 (Transfer)</option>
                        <option value="JSS 3">JSS 3 (Transfer)</option>
                        <option value="SSS 1 (Science)">SSS 1 (Science Track)</option>
                        <option value="SSS 1 (Commercial)">SSS 1 (Commercial Track)</option>
                        <option value="SSS 1 (Arts)">SSS 1 (Arts Track)</option>
                        <option value="SSS 2">SSS 2 (Transfer)</option>
                        <option value="Creche / Primary">Creche / Nursery / Basic 1-5</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Parent / Guardian Info */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-green-primary border-b pb-2">
                    2. Parent / Guardian Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1B2521] mb-1">Father’s Full Name</label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1B2521] mb-1">Mother’s Full Name</label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2521] mb-1">Guardian’s Full Name (If applicable)</label>
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1B2521] mb-1">
                        Primary Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="primaryPhone"
                        required
                        value={formData.primaryPhone}
                        onChange={handleChange}
                        placeholder="0803 000 0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1B2521] mb-1">Alternative Phone Number</label>
                      <input
                        type="tel"
                        name="altPhone"
                        value={formData.altPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2521] mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="parent@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>
                </div>

                {/* Academic Background & Additional Info */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-green-primary border-b pb-2">
                    3. Academic Background & Special Needs
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2521] mb-1">Previous School Attended</label>
                    <input
                      type="text"
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      placeholder="Name of previous primary or secondary school"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2521] mb-1">Special Needs / Medical Conditions</label>
                    <textarea
                      name="medicalConditions"
                      rows="3"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      placeholder="Specify any allergies, health conditions, or learning support requirements"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2521] mb-1">
                      How did you hear about us? <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="referralSource"
                      required
                      value={formData.referralSource}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                    >
                      <option value="">Select Referral Source</option>
                      <option value="Referral">Word of Mouth / Referral</option>
                      <option value="Social Media">Social Media (Facebook / Instagram)</option>
                      <option value="Website">School Website / Google Search</option>
                      <option value="Banner">Flier / Billboard Banner in Mushin</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Consent & Confirmation */}
                <div className="space-y-3 pt-4 border-t border-gray-100 text-xs text-[#55635C]">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="infoConfirmed"
                      required
                      checked={formData.infoConfirmed}
                      onChange={handleChange}
                      className="mt-0.5 rounded text-green-primary focus:ring-green-primary"
                    />
                    <span>I confirm that the information provided above is correct. <span className="text-red-500">*</span></span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consentGiven"
                      required
                      checked={formData.consentGiven}
                      onChange={handleChange}
                      className="mt-0.5 rounded text-green-primary focus:ring-green-primary"
                    />
                    <span>I consent to New State Schools contacting me regarding this application. <span className="text-red-500">*</span></span>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-extrabold text-sm text-white bg-green-primary hover:bg-green-dark transition-all shadow-lg hover:shadow-xl"
                  >
                    Submit Student Application →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
