import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, CreditCard } from 'lucide-react';

export default function ExitScreen({ onReturnToWelcome }) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      onReturnToWelcome();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onReturnToWelcome]);

  const progressPercent = ((10 - countdown) / 10) * 100;

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Fullscreen High-Resolution Edge-to-edge Background */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `url('/images/bank-bg.jpg')`,
        }}
      >
        {/* 25-30% Warm Cream Overlay */}
        <div className="absolute inset-0 bg-[#FFF8F0]/30" />
      </div>

      <div className="relative z-10 w-full max-w-lg bg-white/94 backdrop-blur-[6px] rounded-[24px] border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] p-6 sm:p-8 text-center flex flex-col items-center screen-fade-in my-auto">
        {/* Animated Check / Card Icon */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/15 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full mb-2">
          Session Terminated Safely
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
          Thank You for Banking with SecureBank!
        </h2>

        <p className="text-sm text-gray-600 mt-1 max-w-sm leading-relaxed">
          Your card has been safely ejected and your banking credentials have been cleared from memory.
        </p>

        {/* Security Reminder card */}
        <div className="my-5 p-4 bg-[#FAF5EE] rounded-2xl border border-[#E8DDD2] w-full text-left flex items-start space-x-3.5">
          <CreditCard className="w-5 h-5 text-[#E88745] flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-[#292929]">Security Reminder</p>
            <p className="text-gray-500 mt-0.5 leading-relaxed">
              Please ensure you have collected your debit card, cash bills, and printed transaction receipt before leaving.
            </p>
          </div>
        </div>

        {/* Auto Countdown Indicator */}
        <div className="w-full space-y-2 mb-5">
          <div className="flex justify-between text-xs text-gray-500 font-semibold">
            <span>Returning to Welcome Screen in:</span>
            <span className="font-mono text-[#CF6F2E] font-extrabold">{countdown}s</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E88745] transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Immediate Return Button */}
        <button
          type="button"
          onClick={onReturnToWelcome}
          className="w-full py-3.5 bg-gradient-to-r from-[#E88745] to-[#D9732F] hover:from-[#D9732F] hover:to-[#CF6F2E] text-white font-extrabold rounded-2xl shadow-lg shadow-[#E88745]/30 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
        >
          <span>Return to Welcome Screen Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
