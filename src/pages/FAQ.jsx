import React, { useState, useMemo } from 'react';
import {
  HelpCircle, Search, ChevronDown, ChevronUp, BookOpen, GraduationCap,
  CreditCard, ShieldCheck, Laptop, Users, Phone, Mail, ArrowRight,
  Sparkles, CheckCircle2, MessageSquare
} from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Admissions & Enrollment',
    icon: GraduationCap,
    questions: [
      {
        q: 'What classes are open for admission at New State High School?',
        a: 'We admit students into Junior Secondary School (JSS 1, JSS 2, JSS 3) and Senior Secondary School (SSS 1 and SSS 2). For SSS 3, transfer admissions are subject to special review of the student’s continuous assessment records from their previous school.'
      },
      {
        q: 'How does the online application and entrance examination process work?',
        a: 'Parents can fill out the online admission form on our website (/admission) or purchase an application scratch card at the school administrative office. Once submitted, candidates are scheduled for our internal entrance examination covering Mathematics, English Language, and General Aptitude.'
      },
      {
        q: 'What are the required documents for admission screening?',
        a: 'Applicants must provide: (1) Birth Certificate or Statutory Declaration of Age, (2) Last two terms\' academic report cards from their previous school, (3) Two recent passport photographs, and (4) Primary 6 School Leaving Certificate (for JSS 1 candidates).'
      },
      {
        q: 'What is the minimum age requirement for JSS 1 admission?',
        a: 'Candidates for JSS 1 must have attained a minimum age of 10 years by the date of school resumption in September.'
      }
    ]
  },
  {
    category: 'Academics & Examination Success',
    icon: BookOpen,
    questions: [
      {
        q: 'What academic curriculum does New State High School operate?',
        a: 'We operate the enriched Nigerian National Curriculum (NERDC) integrated with British Cambridge IGCSE standards. In Senior Secondary, students specialize into Science & Technology, Commercial & Social Sciences, or Arts & Humanities tracks.'
      },
      {
        q: 'What is the school’s record in WAEC, NECO, and BECE examinations?',
        a: 'New State High School maintains a consistent 100% pass rate in WAEC and BECE examinations in Lagos State, with over 94% of our graduating candidates achieving 5 or more credits including Mathematics and English Language in a single sitting.'
      },
      {
        q: 'Does the school offer practical STEM and Computer Coding classes?',
        a: 'Yes! All students participate in hands-on STEM laboratory experiments and our AI & Coding Academy (/ai-coding), where they learn Python programming, web development, robotics, and computer literacy in our modern ICT laboratories.'
      }
    ]
  },
  {
    category: 'Tuition Fees & Bursary Payments',
    icon: CreditCard,
    questions: [
      {
        q: 'What are the school fees for Junior and Senior Secondary students?',
        a: 'Tuition fees are structured termly: Junior Secondary School (JSS 1–3) tuition is ₦95,000 per term, and Senior Secondary School (SSS 1–3) tuition is ₦125,000 per term. This covers tuition, laboratory access, ICT facilities, and continuous assessments.'
      },
      {
        q: 'Are installment payment plans allowed?',
        a: 'Yes, parents may pay in two installments upon formal application to the Bursar: a minimum 60% deposit before term resumption, and the remaining 40% balance before mid-term examinations.'
      },
      {
        q: 'How do I submit bank transfer proofs for bursary approval?',
        a: 'Parents can transfer directly to our official First Bank account (New State High School, Account Number: 1029384756) and upload the payment receipt or transaction reference through the Student Portal (/portal) or present it at the Bursary counter for instant clearance.'
      }
    ]
  },
  {
    category: 'Student & Parent Portal',
    icon: ShieldCheck,
    questions: [
      {
        q: 'How do parents and students check termly report cards online?',
        a: 'Log into the School Portal (/portal) using the student’s unique Admission Number (e.g. NSHS/2026/001) and 6-character Portal PIN. Navigate to the "Report Card & Results" tab to view grades, CA breakdowns, teacher remarks, and print official watermarked result broadsheets.'
      },
      {
        q: 'What should I do if I forget or misplace my Student Portal PIN?',
        a: 'You can retrieve your PIN by contacting the School ICT Administrator or visiting the Principal’s office with proof of student identity. Parents can also request a PIN reset via email at info@newstateschools.org or phone at +234 813 400 0644.'
      },
      {
        q: 'Can teachers record continuous assessment scores online?',
        a: 'Yes, our portal provides dedicated Teacher Dashboards where subject teachers record CA 1 (20%), CA 2 (20%), and Examination (60%) scores in real time with automatic grading and GPA compilation.'
      }
    ]
  },
  {
    category: 'JAMB CBT Predictor & ExamSuccess',
    icon: Laptop,
    questions: [
      {
        q: 'How does the free JAMB Score Predictor work?',
        a: 'Our JAMB Predictor (/jamb-score-predictor) delivers a real-time 35-minute timed CBT simulation across 50 high-probability past questions in your chosen 4 Nigerian subjects. Upon submission, it projects your scaled score out of 400 with confidence intervals and generates an Emergency Revision Roadmap highlighting your weakest topics.'
      },
      {
        q: 'How can candidates unlock the full 180-question ExamSuccess CBT App?',
        a: 'Candidates can upgrade to the complete ExamSuccess CBT software (/buy-plan) for ₦2,500/year to access over 15,000 past questions, full 180-question mock exams, detailed video explanations, and offline practice modes.'
      }
    ]
  },
  {
    category: 'Teacher Recruitment & Careers',
    icon: Users,
    questions: [
      {
        q: 'How can qualified teachers apply for job vacancies at New State High School?',
        a: 'Educators can visit our "Teachers Apply Here!" page (/teachers-apply) to submit their CV, subject specializations, qualifications, and teaching experience. All applications are reviewed directly by the Principal and School Management on the Admin Portal.'
      },
      {
        q: 'What qualifications are required to teach at New State High School?',
        a: 'We require a minimum of B.Ed, B.Sc/B.A with PGDE, or HND/NCE in relevant subject disciplines, along with passion for student mentorship and openness to digital teaching methods.'
      }
    ]
  }
];

export default function FAQ({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter FAQs based on search and selected category
  const filteredFAQ = useMemo(() => {
    return FAQ_DATA.map((cat, catIdx) => {
      if (activeCategory !== 'All' && cat.category !== activeCategory) {
        return null;
      }

      const matchingQuestions = cat.questions.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
          item.q.toLowerCase().includes(query) ||
          item.a.toLowerCase().includes(query) ||
          cat.category.toLowerCase().includes(query)
        );
      });

      if (matchingQuestions.length === 0) return null;

      return {
        ...cat,
        originalIndex: catIdx,
        questions: matchingQuestions,
      };
    }).filter(Boolean);
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#F8FAFA] font-sans pt-[72px] pb-20">
      {/* Hero Header */}
      <section className="bg-[#06452C] text-white py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url('/school-hall.jpg')` }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wide">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Help Center & Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Frequently Asked <span className="text-[#FDE68A]">Questions</span>
          </h1>

          <p className="text-xs sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions regarding student admissions, school fees, examination results, portal access, CBT mock predictors, and teacher recruitment.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative pt-2">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-5" />
            <input
              type="text"
              placeholder="Search questions (e.g., school fees, portal pin, admission, mock)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-gray-900 text-xs sm:text-sm font-semibold placeholder:text-gray-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-6">
        {/* Category Filter Pills */}
        <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-100 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-[#06452C] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Questions
          </button>
          {FAQ_DATA.map((cat) => (
            <button
              key={cat.category}
              type="button"
              onClick={() => setActiveCategory(cat.category)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeCategory === cat.category
                  ? 'bg-[#06452C] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{cat.category}</span>
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        {filteredFAQ.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-700">No matching questions found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              We couldn't find any questions matching "{searchQuery}". Try a different keyword or contact our support team.
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="px-4 py-2 rounded-xl bg-green-primary text-white text-xs font-bold"
            >
              Reset Search
            </button>
          </div>
        ) : (
          filteredFAQ.map((categoryGroup) => {
            const Icon = categoryGroup.icon;
            return (
              <div
                key={categoryGroup.category}
                className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-100 space-y-4"
              >
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#06452C] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-[#1B2521]">
                    {categoryGroup.category}
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {categoryGroup.questions.map((item, qIdx) => {
                    const isOpen = Boolean(openItems[`${categoryGroup.originalIndex}-${qIdx}`]);

                    return (
                      <div key={qIdx} className="py-3">
                        <button
                          type="button"
                          onClick={() => toggleItem(categoryGroup.originalIndex, qIdx)}
                          className="w-full flex justify-between items-center text-left gap-3 py-1 cursor-pointer group"
                        >
                          <span className="text-xs sm:text-sm font-bold text-[#1B2521] group-hover:text-green-primary transition-colors">
                            {item.q}
                          </span>
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${
                            isOpen ? 'bg-emerald-100 text-[#06452C] rotate-180' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="mt-2.5 p-4 rounded-2xl bg-[#FAFCFA] border border-gray-100 text-xs text-gray-700 leading-relaxed animate-fadeIn">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {/* Contact Support Card */}
        <div className="bg-gradient-to-br from-[#06452C] to-[#0B5D3B] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black text-white">
              Still Have Questions?
            </h3>
            <p className="text-xs text-emerald-100 max-w-md">
              Our admissions and administrative team is available to assist you with any inquiries or guidance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-5 py-3 rounded-xl bg-white text-[#06452C] font-black text-xs hover:bg-emerald-50 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Admissions</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admission')}
              className="px-5 py-3 rounded-xl bg-[#FDE68A] hover:bg-amber-300 text-gray-950 font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>Apply for Admission →</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
