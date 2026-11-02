import React, { useState, useEffect } from 'react';
import { Landmark, CheckCircle2, ArrowRight, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

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
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Graphic */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF8F0]/95 via-[#F5EEE6]/90 to-[#FAF5EE]/85 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl border border-[#E8DDD2] shadow-2xl p-8 sm:p-10 text-center flex flex-col items-center">
        {/* Animated Check / Card Icon */}
        <div className="w-18 h-18 w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/15 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2">
          Session Terminated Safely
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
          Thank You for Banking with SecureBank!
        </h2>

        <p className="text-sm text-[#737373] mt-2 max-w-sm leading-relaxed">
          Your card has been safely ejected and your banking credentials have been cleared from memory.
        </p>

        {/* Reminder card */}
        <div className="my-6 p-4 bg-[#FAF5EE] rounded-2xl border border-[#E8DDD2] w-full text-left flex items-start space-x-3">
          <CreditCard className="w-5 h-5 text-[#E88745] flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-[#292929]">Important Security Reminder</p>
            <p className="text-gray-500 mt-0.5">
              Please ensure you have collected your debit card, cash bills, and printed transaction receipt before leaving the ATM booth.
            </p>
          </div>
        </div>

        {/* Auto Countdown Indicator */}
        <div className="w-full space-y-2 mb-6">
          <div className="flex justify-between text-xs text-gray-500 font-semibold">
            <span>Returning to Welcome Screen in:</span>
            <span className="font-mono text-[#CF6F2E] font-bold">{countdown}s</span>
          </div>

          <div className="w-full h-2 bg-[#E8DDD2] rounded-full overflow-hidden">
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
          className="w-full py-3.5 bg-[#E88745] hover:bg-[#D9732F] text-white font-extrabold rounded-2xl shadow-lg shadow-[#E88745]/25 transition-all active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>Return to Welcome Screen Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
