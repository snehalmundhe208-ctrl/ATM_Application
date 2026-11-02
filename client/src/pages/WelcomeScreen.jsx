import React from 'react';
import {
  Landmark,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Beaker,
} from 'lucide-react';

export default function WelcomeScreen({ onStartBanking, onOpenTestPanel }) {
  return (
    <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Solid White Card - NO Glassmorphism, 24px Radius, 1px Subtle Border, Soft Shadow */}
      <div className="w-full max-w-lg bg-white rounded-[24px] border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 sm:p-8 text-center flex flex-col items-center screen-fade-in my-auto">
        {/* Bank Brand Emblem */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#CF6F2E] via-[#E88745] to-[#F2A066] flex items-center justify-center text-white shadow-md shadow-[#E88745]/25 ring-4 ring-[#FFF8F0] mb-3 transform hover:scale-105 transition-transform duration-200">
          <Landmark className="w-7 h-7" />
        </div>

        {/* Crisp Typography & Hierarchy */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#292929] leading-tight">
          Welcome to <span className="text-[#E88745]">SecureBank</span>
        </h1>
        <p className="text-sm sm:text-base text-[#4A4A4A] mt-1 font-medium max-w-sm">
          Your banking, made simple and secure.
        </p>

        {/* Demo ATM Debit Card Badge */}
        <div className="w-full max-w-sm my-5 p-3.5 bg-[#FFF8F0] rounded-2xl border border-[#E8DDD2] shadow-xs flex items-center justify-between text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E88745]/30 flex items-center justify-center text-[#E88745] shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#737373] tracking-wider">
                Demo Card Number
              </p>
              <p className="font-mono text-sm font-extrabold text-[#292929] tracking-wider">
                1234 •••• •••• 3456
              </p>
              <p className="text-[11px] font-bold text-[#CF6F2E]">
                Holder: Sneha Sharma
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => onStartBanking('1234567890123456')}
          className="w-full max-w-sm py-3.5 px-6 bg-gradient-to-r from-[#E88745] to-[#D9732F] hover:from-[#D9732F] hover:to-[#CF6F2E] text-white font-extrabold text-base rounded-2xl shadow-lg shadow-[#E88745]/30 hover:shadow-xl hover:shadow-[#E88745]/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center space-x-2.5 group"
        >
          <span>Start Banking</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Security Notice */}
        <div className="mt-4 flex items-center justify-center space-x-1.5 text-[11px] text-[#4A4A4A] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>256-Bit Encrypted Session • Never share your PIN</span>
        </div>

        {/* Footer info: SET Academic Suite Link & Demo Hint */}
        <div className="mt-4 pt-3 border-t border-[#E8DDD2] w-full flex items-center justify-between text-xs text-[#737373]">
          <span>
            Demo PIN: <strong className="font-mono text-[#CF6F2E] font-bold">1234</strong>
          </span>

          <button
            type="button"
            onClick={onOpenTestPanel}
            className="flex items-center space-x-1.5 font-bold text-[#CF6F2E] hover:text-[#B6591E] bg-[#FFF8F0] hover:bg-[#FBECE3] border border-[#E88745]/30 px-3 py-1 rounded-xl transition-colors shadow-xs"
          >
            <Beaker className="w-3.5 h-3.5 text-[#E88745]" />
            <span>SET Test Suite</span>
          </button>
        </div>
      </div>
    </div>
  );
}
