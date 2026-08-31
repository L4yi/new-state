import React, { useEffect } from 'react';
import { CheckCircle2, Trash2, X, Sparkles } from 'lucide-react';

export default function SuccessModal({
  isOpen,
  onClose,
  title = 'Operation Successful!',
  message = 'Your changes have been securely saved to the school management system.',
  type = 'success', // 'success' | 'delete' | 'info'
  autoCloseMs = 4000
}) {
  useEffect(() => {
    if (isOpen && autoCloseMs > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  const isDelete = type === 'delete';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 text-center space-y-4 animate-scaleUp relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top decorative accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${isDelete ? 'bg-rose-500' : 'bg-green-primary'}`} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="pt-2 flex justify-center">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transition-transform ${
            isDelete ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-green-primary border border-emerald-200'
          }`}>
            {isDelete ? (
              <Trash2 className="w-8 h-8 text-rose-600 animate-bounce" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-green-primary" />
            )}
          </div>
        </div>

        {/* Title & Message */}
        <div className="space-y-1.5">
          <h3 className="text-lg sm:text-xl font-black text-[#1B2521] tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-600 font-medium leading-relaxed px-2">
            {message}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`w-full py-3.5 rounded-2xl font-black text-xs text-white transition-all shadow-md cursor-pointer active:scale-[0.99] flex items-center justify-center gap-1.5 ${
              isDelete ? 'bg-rose-600 hover:bg-rose-700' : 'bg-green-primary hover:bg-green-dark'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
