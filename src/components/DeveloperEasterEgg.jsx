import React, { useState, useEffect } from 'react';
import { Sparkles, Code2, Cpu, Terminal, X, Heart, Zap, CheckCircle2, Rocket, Award } from 'lucide-react';

export default function DeveloperEasterEgg({ isOpen, onClose }) {
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfettiActive(true);
      const t = setTimeout(() => setConfettiActive(false), 4000);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Confetti particles */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => {
            const left = Math.random() * 100;
            const animDuration = 1.5 + Math.random() * 2;
            const size = 6 + Math.random() * 8;
            const colors = ['#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#34D399'];
            const color = colors[i % colors.length];
            return (
              <div
                key={i}
                className="absolute rounded-sm animate-bounce"
                style={{
                  left: `${left}%`,
                  top: `-10px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animation: `fallDown ${animDuration}s linear forwards`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            );
          })}
          <style>{`
            @keyframes fallDown {
              0% { transform: translateY(0vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Modal Container */}
      <div className="bg-[#0B1512] text-white w-full max-w-lg rounded-3xl border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/60 overflow-hidden relative p-6 sm:p-8 space-y-6">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar */}
        <div className="flex justify-between items-center relative z-10 border-b border-emerald-900/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              // DEVELOPER CREDITS & ARCHITECTURE
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Creator Hero Header */}
        <div className="text-center relative z-10 space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-[#06452C] p-1 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0B1512] rounded-[22px] flex items-center justify-center">
              <span className="text-2xl font-black font-mono tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
                𝕃𝟜𝕪𝕚
              </span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lead Systems Architect & Creator</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Engineered by <span className="text-emerald-400">𝕃𝟜𝕪𝕚</span>
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mt-1">
              Custom-built digital campus operating system for <strong className="text-emerald-300">New State High School</strong>.
            </p>
          </div>
        </div>

        {/* System Specs & Features */}
        <div className="bg-emerald-950/40 rounded-2xl p-4 border border-emerald-900/60 text-xs space-y-2.5 font-mono relative z-10">
          <div className="flex justify-between items-center text-[11px] text-gray-400 border-b border-emerald-900/40 pb-2">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Terminal className="w-3.5 h-3.5" /> Project Build
            </span>
            <span className="text-gray-200 font-bold">NSHS v2.8.4-PROD</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded-xl bg-black/40 border border-emerald-900/30">
              <span className="text-gray-500 block text-[10px]">FRONTEND CORE</span>
              <span className="text-emerald-300 font-bold">React 19 + Vite Engine</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-emerald-900/30">
              <span className="text-gray-500 block text-[10px]">DESIGN & RESPONSIVENESS</span>
              <span className="text-emerald-300 font-bold">Tailwind CSS 4.0</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-emerald-900/30">
              <span className="text-gray-500 block text-[10px]">DATA ARCHITECTURE</span>
              <span className="text-emerald-300 font-bold">Optimistic Sync Ledger</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-emerald-900/30">
              <span className="text-gray-500 block text-[10px]">CLOUD HOSTING</span>
              <span className="text-emerald-300 font-bold">Firebase Global CDN</span>
            </div>
          </div>
        </div>

        {/* Signature Message */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-emerald-900/30 border border-emerald-500/20 text-center relative z-10">
          <p className="text-xs text-emerald-200 font-medium italic">
            "Designed and programmed with 100% devotion to clean architecture, intuitive mobile usability, and zero-friction school operations."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 relative z-10">
          <button
            onClick={triggerConfetti}
            className="w-1/2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Rocket className="w-4 h-4" />
            <span>Launch Confetti 🎉</span>
          </button>
          <button
            onClick={onClose}
            className="w-1/2 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Return to School</span>
          </button>
        </div>

      </div>
    </div>
  );
}
