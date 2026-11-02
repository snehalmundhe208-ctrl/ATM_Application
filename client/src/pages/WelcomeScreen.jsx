import React from 'react';
import {
  Landmark,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Beaker,
  Sparkles,
} from 'lucide-react';
import AtmTerminalBezel from '../components/AtmTerminalBezel';

export default function WelcomeScreen({ onStartBanking, onOpenTestPanel }) {
  return (
    <AtmTerminalBezel
      backgroundImage="/images/atm-bank-lobby.jpg"
      cardInserted={true}
      screenTitle="SecureBank ATM"
    >
      {/* High-Contrast Glassmorphic ATM Panel */}
      <div className="w-full max-w-xl bg-white/92 backdrop-blur-md rounded-3xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 sm:p-10 text-center flex flex-col items-center screen-fade-in relative">
        {/* Subtle Warm Orange Glow Edge */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-[#E88745] to-transparent" />

        {/* Brand Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#CF6F2E] via-[#E88745] to-[#F2A066] flex items-center justify-center text-white shadow-xl shadow-[#E88745]/30 ring-4 ring-white mb-4 transform hover:scale-105 transition-transform duration-200">
          <Landmark className="w-8 h-8" />
        </div>

        {/* Title & Hierarchy */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#292929] leading-tight">
          Welcome to <span className="text-[#E88745]">SecureBank</span>
        </h1>

        <p className="text-base sm:text-lg text-[#555] mt-2 font-medium max-w-md">
          Your banking, made simple and secure.
        </p>

        {/* Demo ATM Card Insertion Graphic */}
        <div className="w-full max-w-md my-6 p-4 bg-gradient-to-r from-[#FFF8F0] via-white to-[#FAF5EE] rounded-2xl border border-[#E8DDD2] shadow-sm flex items-center justify-between text-left">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FFF8F0] border border-[#E88745]/40 flex items-center justify-center text-[#E88745] shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                ATM Debit Card Ready
              </p>
              <p className="font-mono text-base font-extrabold text-[#292929] tracking-wider">
                1234 •••• •••• 3456
              </p>
              <p className="text-xs font-semibold text-[#CF6F2E]">
                Holder: Sneha Sharma
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready</span>
          </div>
        </div>

        {/* Prominent Orange "Start Banking" Button */}
        <button
          type="button"
          onClick={() => onStartBanking('1234567890123456')}
          className="w-full max-w-md py-4 px-8 bg-gradient-to-r from-[#E88745] to-[#D9732F] hover:from-[#D9732F] hover:to-[#CF6F2E] text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-[#E88745]/35 hover:shadow-2xl hover:shadow-[#E88745]/45 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center space-x-3 group"
        >
          <span>Start Banking</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>256-Bit Encrypted Session • Never share your PIN • Press Cancel anytime</span>
        </div>

        {/* Footer info: SET Academic Suite Link & Demo Hint */}
        <div className="mt-6 pt-4 border-t border-gray-200/80 w-full flex items-center justify-between text-xs text-gray-500">
          <span>
            Demo PIN: <strong className="font-mono text-[#CF6F2E] font-bold text-sm">1234</strong>
          </span>

          <button
            type="button"
            onClick={onOpenTestPanel}
            className="flex items-center space-x-1.5 font-bold text-[#CF6F2E] hover:text-[#B6591E] bg-[#FFF8F0] hover:bg-[#FBECE3] border border-[#E88745]/30 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
          >
            <Beaker className="w-3.5 h-3.5 text-[#E88745]" />
            <span>SET Test Suite (14 TC)</span>
          </button>
        </div>
      </div>
    </AtmTerminalBezel>
  );
}
