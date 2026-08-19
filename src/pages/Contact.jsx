import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, ChevronDown, CheckCircle2, Send } from 'lucide-react';

export default function Contact({ onNavigate }) {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const contactDetails = [
    {
      title: 'Call or Message Us',
      detail: '+234 813 400 0644',
      sub: 'Mon – Fri: 8:00 AM – 4:00 PM',
      icon: <Phone className="w-6 h-6 text-green-primary" />,
    },
    {
      title: 'Official Email',
      detail: 'info@newstateschools.org',
      sub: 'We reply within 24 business hours',
      icon: <Mail className="w-6 h-6 text-green-primary" />,
    },
    {
      title: 'Main Campus Office',
      detail: '36 Palm Avenue, Mushin, Lagos, Nigeria',
      sub: 'New State High School & Primary School',
      icon: <MapPin className="w-6 h-6 text-green-primary" />,
    },
    {
      title: 'WhatsApp Support',
      detail: '+234 813 400 0644',
      sub: 'Instant inquiry & technical support',
      icon: <MessageCircle className="w-6 h-6 text-green-primary" />,
    },
  ];

  const faqs = [
    {
      q: 'How do I enroll in the Online School?',
      a: 'Click the Admissions button in the menu, choose your child’s class, and complete the application form. Our admissions team will follow up with next steps.',
    },
    {
      q: 'Do you offer both in-person and online classes?',
      a: 'Yes! New State Schools operates New State Nursery & Primary School and New State High School in Mushin, Lagos. We also offer an Online School for WAEC Success and JAMB Success preparation.',
    },
    {
      q: 'Can students outside Lagos or Nigeria join the Online School?',
      a: 'Yes! Our Online School is open to all students preparing for WAEC, JAMB, and related exams worldwide, as long as they have internet access.',
    },
    {
      q: 'What payment options are available?',
      a: 'We accept bank transfer, debit/credit cards, and secure online payments via Paystack, Flutterwave, and Interswitch.',
    },
    {
      q: 'Will I get support if I have technical issues?',
      a: 'Yes! Our technical support team is available via phone, WhatsApp, and email to assist students, parents, and guardians with login, payment, or platform issues.',
    },
  ];

  return (
    <div className="pt-[72px]">
      {/* Hero Banner */}
      <section className="bg-[#06452C] text-white py-16 lg:py-20 px-6 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-emerald-300 mb-3">
            <span className="w-6 h-[2px] bg-emerald-300 inline-block" />
            NEED HELP? WE'RE HERE FOR YOU
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Contact New State Schools
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
            We’re here to answer your questions about admissions, WAEC Success, JAMB Success, BECE Success, our Online School, or campus visits.
          </p>
        </div>
      </section>

      {/* Official Contact Cards Bar */}
      <section className="py-12 px-6 bg-[#F8FAFA] border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactDetails.map((card, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="text-3xl p-2.5 rounded-xl bg-green-50 w-fit mb-4">{card.icon}</div>
                <h3 className="font-bold text-sm text-[#1B2521] mb-1">{card.title}</h3>
                <p className="text-sm font-bold text-green-primary mb-1">{card.detail}</p>
                <p className="text-xs text-[#55635C] leading-relaxed">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Form & Interactive FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#F9FCFA] rounded-3xl p-8 sm:p-10 border border-green-primary/10">
            <span className="px-3 py-1 rounded-full bg-green-light text-green-primary text-xs font-bold uppercase tracking-wider">
              Message Office
            </span>
            <h2 className="text-2xl font-extrabold text-[#1B2521] mt-3 mb-2">Send Us an Inquiry</h2>
            <p className="text-xs sm:text-sm text-[#55635C] mb-8">
              Fill in your details below and our school administration team will reach back out to you promptly.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-green-light border border-green-primary/20 text-center">
                <div className="w-14 h-14 rounded-full bg-green-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-3">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-green-primary mb-2">Message Sent Successfully!</h3>
                <p className="text-xs sm:text-sm text-[#55635C] max-w-md mx-auto mb-6">
                  Thank you for contacting New State Schools. We have received your inquiry and will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-lg text-xs font-bold bg-green-primary text-white hover:bg-green-dark transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1B2521] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Mr. Babatunde Ogunlesi"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1B2521] mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1B2521] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0813 400 0644"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B2521] mb-1">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-white"
                  >
                    <option value="">Select Topic</option>
                    <option value="Student Admissions">Student Admissions</option>
                    <option value="WAEC & JAMB Online School">WAEC & JAMB Online School</option>
                    <option value="BECE Preparation">BECE Preparation</option>
                    <option value="Technical Support">Technical & Login Support</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B2521] mb-1">Your Message *</label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-primary bg-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-extrabold text-sm text-white bg-green-primary hover:bg-green-dark transition-all shadow-md"
                >
                  Send Inquiry Message →
                </button>
              </form>
            )}
          </div>

          {/* FAQs Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                COMMON QUESTIONS
              </span>
              <h2 className="text-2xl font-extrabold text-[#1B2521] mt-3 mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-[#55635C] mb-6">
                Find quick answers to common questions about our physical school campuses and online exam portal.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#1B2521] flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-green-primary transition-transform duration-200 ml-2 flex-shrink-0 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-[#55635C] leading-relaxed border-t border-gray-100 pt-3 bg-[#FAFCFA]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
