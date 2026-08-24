import React, { useState } from 'react';
import { CheckCircle2, Sparkles, ArrowRight, ArrowLeft, Briefcase, Loader2 } from 'lucide-react';

export default function TeachersApply({ onNavigate }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    homeAddress: '',
    subjects: [],
    classes: [],
    qualifications: [],
    experience: '',
    hasCertificates: '',
    startDate: '',
  });

  const subjectOptions = [
    'Mathematics',
    'English Language',
    'English Literature',
    'Computer Science',
    'Physics',
    'French',
    'Physical & Health Education',
  ];

  const classOptions = [
    'Primary School',
    'Junior Secondary School',
    'Senior Secondary School',
  ];

  const qualificationOptions = ['OND', 'HND', 'B. Education', 'BSc', 'BA'];

  const experienceOptions = ['None', '1 - 5 years', '6 - 10 years', 'Over 10 years'];

  const startDateOptions = ['Immediately', '2 weeks', 'Next term'];

  const handleCheckboxChange = (field, option) => {
    setFormData((prev) => {
      const currentArr = prev[field];
      const updated = currentArr.includes(option)
        ? currentArr.filter((item) => item !== option)
        : [...currentArr, option];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 850);
  };

  return (
    <div className="pt-[72px]">
      {/* Hero Banner */}
      <section className="bg-[#06452C] text-white py-16 lg:py-20 px-6 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-emerald-300 mb-3">
            <span className="w-6 h-[2px] bg-emerald-300 inline-block" />
            JOIN OUR FACULTY
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Teachers Apply Here!
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
            We are always looking for qualified and experienced teachers with a passion for teaching, willing to embrace innovation. If that is you, apply now!
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-20 px-6 bg-[#F8FAFA]">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-gray-100">
          <div className="mb-8 border-b pb-6">
            <span className="px-3 py-1 rounded-full bg-green-light text-green-primary text-xs font-bold uppercase tracking-wider">
              Faculty Recruitment
            </span>
            <h2 className="text-2xl font-extrabold text-[#1B2521] mt-3">Teacher Application Form</h2>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-green-light text-center border border-green-primary/20 space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-primary text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-primary">Thank you for your response!</h3>
              <p className="text-xs sm:text-sm text-[#55635C] max-w-md mx-auto">
                Your application has been successfully submitted to New State Schools recruitment committee. We will review your details and contact shortlisted candidates.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-green-primary text-white hover:bg-green-dark transition-all inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Apply Again</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Name */}
              <div>
                <label className="block text-xs font-bold text-[#1B2521] mb-1">
                  Name (first, middle, last) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Olusegun Ogunlesi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                />
              </div>

              {/* 2. Phone Number */}
              <div>
                <label className="block text-xs font-bold text-[#1B2521] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0813 400 0644"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                />
              </div>

              {/* 3. Home Address */}
              <div>
                <label className="block text-xs font-bold text-[#1B2521] mb-1">Home Address *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Enter your residential address in Lagos"
                  value={formData.homeAddress}
                  onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-[#FAFCFA]"
                ></textarea>
              </div>

              {/* 4. What subjects can you teach? */}
              <div>
                <label className="block text-xs font-bold text-[#1B2521] mb-2">
                  What subjects can you teach? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#FAFCFA] p-4 rounded-xl border border-gray-100">
                  {subjectOptions.map((sub, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs font-medium text-[#1B2521] cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(sub)}
                        onChange={() => handleCheckboxChange('subjects', sub)}
                        className="w-4 h-4 text-green-primary accent-green-primary rounded"
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. What classes can you teach? */}
              <div>
                <label className="block text-xs font-bold text-[#1B2521] mb-2">
                  What classes can you teach? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#FAFCFA] p-4 rounded-xl border border-gray-100">
                  {classOptions.map((cls, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs font-medium text-[#1B2521] cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={formData.classes.includes(cls)}
                        onChange={() => handleCheckboxChange('classes', cls)}
                        className="w-4 h-4 text-green-primary accent-green-primary rounded"
                      />
                      <span>{cls}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. What are your qualifications? */}
              <div>
                <label className="block text-xs font-bold text-[#1B2521] mb-2">
                  What are your qualifications? *
                </label>
                <div className="flex flex-wrap gap-4 bg-[#FAFCFA] p-4 rounded-xl border border-gray-100">
                  {qualificationOptions.map((qual, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs font-medium text-[#1B2521] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.qualifications.includes(qual)}
                        onChange={() => handleCheckboxChange('qualifications', qual)}
                        className="w-4 h-4 text-green-primary accent-green-primary rounded"
                      />
                      <span>{qual}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 7. Years of teaching experience */}
              <div>
                <label className="block text-xs font-bold text-[#1B2521] mb-2">
                  Years of teaching experience *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FAFCFA] p-4 rounded-xl border border-gray-100">
                  {experienceOptions.map((exp, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs font-medium text-[#1B2521] cursor-pointer">
                      <input
                        type="radio"
                        name="experience"
                        required
                        checked={formData.experience === exp}
                        onChange={() => setFormData({ ...formData, experience: exp })}
                        className="w-4 h-4 text-green-primary accent-green-primary"
                      />
                      <span>{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 8. Do you have your certificates? */}
              <div>
                <label className="block text-xs font-bold text-[#1B2521] mb-2">
                  Do you have your certificates? *
                </label>
                <div className="flex gap-6 bg-[#FAFCFA] p-4 rounded-xl border border-gray-100">
                  {['Yes', 'No'].map((ans, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs font-medium text-[#1B2521] cursor-pointer">
                      <input
                        type="radio"
                        name="hasCertificates"
                        required
                        checked={formData.hasCertificates === ans}
                        onChange={() => setFormData({ ...formData, hasCertificates: ans })}
                        className="w-4 h-4 text-green-primary accent-green-primary"
                      />
                      <span>{ans}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 9. When can you start */}
              <div>
                <label className="block text-xs font-bold text-[#1B2521] mb-2">
                  When can you start? *
                </label>
                <div className="grid grid-cols-3 gap-2 bg-[#FAFCFA] p-4 rounded-xl border border-gray-100">
                  {startDateOptions.map((st, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs font-medium text-[#1B2521] cursor-pointer">
                      <input
                        type="radio"
                        name="startDate"
                        required
                        checked={formData.startDate === st}
                        onChange={() => setFormData({ ...formData, startDate: st })}
                        className="w-4 h-4 text-green-primary accent-green-primary"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-extrabold text-sm text-white bg-green-primary hover:bg-green-dark transition-all shadow-md mt-4 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting Educator Application...</span>
                  </>
                ) : (
                  <>
                    <span>Send Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
