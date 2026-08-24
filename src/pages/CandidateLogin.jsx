import React, { useState } from 'react';
import { Sparkles, KeyRound, Phone, ShieldCheck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export default function CandidateLogin({ onNavigate }) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setMessage('Please enter a valid phone number (e.g. 08012345678).');
      return;
    }
    setMessage('');
    setIsSending(true);

    // Simulate SMS dispatch latency for smooth realistic UX
    setTimeout(() => {
      setIsSending(false);
      setStep(2);
    }, 800);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setMessage('');

    setTimeout(() => {
      setIsVerifying(false);
      if (code === '123456' || code.length === 6) {
        onNavigate('exam-success');
      } else {
        setMessage('Invalid verification code. Enter 123456 for demo test mode.');
      }
    }, 900);
  };

  return (
    <div className="pt-[72px] min-h-screen bg-[#F8FAFA] py-16 px-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Top Motivational Quote Box */}
        <div className="bg-[#F0FDF4] border border-[#DCFCE7] p-5 rounded-2xl text-center mb-6 shadow-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-[#166534] text-xs sm:text-sm italic font-medium leading-relaxed">
            <strong>Champion,</strong> may your name be among those celebrated for excellence this year; your success is non-negotiable.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold tracking-widest uppercase mb-3 inline-flex items-center gap-1.5">
            <KeyRound className="w-3 h-3" />
            CBT Examination Portal
          </span>
          <h1 className="text-2xl font-extrabold text-[#1B2521] mb-1">
            Candidate <span className="text-blue-600 italic">Login</span>
          </h1>
          <p className="text-xs text-[#55635C] mb-6 leading-relaxed">
            Available to all WAEC & JAMB candidates. Enter your registered phone number to receive a secure SMS access code.
          </p>

          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 08012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 bg-[#FAFCFA] text-center font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Dispatching SMS Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Access Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('buy-plan')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Don't have an active plan? Buy Plan Here
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit code (Use 123456)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 bg-[#FAFCFA] text-center font-bold tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Access Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Enter CBT Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:underline"
                >
                  ← Change Phone Number
                </button>
              </div>
            </form>
          )}

          {message && (
            <p className="text-xs font-semibold text-red-500 mt-4 bg-red-50 py-2 px-3 rounded-lg">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
