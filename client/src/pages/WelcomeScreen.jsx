import React, { useState, useEffect } from 'react';
import { Landmark, ArrowRight, ShieldCheck, CreditCard, Sparkles, Beaker, Clock, Lock } from 'lucide-react';

export default function WelcomeScreen({ onStartBanking, onOpenTestPanel }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) => {
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (d) => {
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* High Quality Bank Interior Background Image with Warm Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        {/* Soft cream & beige warm gradient overlay for maximum contrast and elegance */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF8F0]/95 via-[#F5EEE6]/90 to-[#FAF5EE]/85 backdrop-blur-[2px]" />
      </div>

      {/* Decorative Subtle Background Orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#E88745]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#CF6F2E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl border border-[#E8DDD2] shadow-2xl p-6 sm:p-10 text-center flex flex-col items-center">
        {/* Bank Logo & Badge */}
        <div className="mb-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#CF6F2E] via-[#E88745] to-[#F2A066] flex items-center justify-center text-white shadow-lg shadow-[#E88745]/25 ring-4 ring-[#FFF8F0] mb-3 transform hover:scale-105 transition-transform">
            <Landmark className="w-8 h-8" />
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#292929]">
              Secure<span className="text-[#E88745]">Bank</span> ATM
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF8F0] text-[#CF6F2E] border border-[#F2A066]/40 px-2 py-0.5 rounded-full">
              24/7 E-Lobby
            </span>
          </div>
        </div>

        {/* Welcome Headline & Subtitle */}
        <div className="space-y-1.5 max-w-lg mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#292929]">
            Welcome to SecureBank
          </h2>
          <p className="text-sm sm:text-base text-[#737373]">
            Your banking, made simple and secure.
          </p>
        </div>

        {/* Live Date & Time Display Badge */}
        <div className="mb-7 inline-flex items-center space-x-2 bg-[#FFF8F0] border border-[#E8DDD2] px-4 py-2 rounded-full text-xs font-medium text-[#4A4A4A] shadow-inner">
          <Clock className="w-4 h-4 text-[#E88745] animate-pulse" />
          <span className="font-semibold">{formatDate(currentTime)}</span>
          <span className="text-gray-300">•</span>
          <span className="font-mono font-bold text-[#CF6F2E]">{formatTime(currentTime)}</span>
        </div>

        {/* Demo Card Number Display Card with Tap to Insert */}
        <div className="w-full max-w-md bg-gradient-to-r from-[#FAF5EE] to-[#FFF8F0] rounded-2xl p-4 border border-[#E8DDD2] mb-7 shadow-sm text-left flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DDD2] flex items-center justify-center text-[#E88745] shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Demo ATM Card Inserted</p>
              <p className="font-mono text-sm font-extrabold text-[#292929] tracking-wider">
                1234 •••• •••• 3456
              </p>
              <p className="text-[11px] text-[#CF6F2E] font-medium">Card Holder: Sneha Sharma</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg">
            Ready
          </span>
        </div>

        {/* Prominent Orange "Start Banking" Button */}
        <button
          type="button"
          onClick={() => onStartBanking('1234567890123456')}
          className="w-full max-w-md py-4 px-8 bg-gradient-to-r from-[#E88745] to-[#D9732F] hover:from-[#D9732F] hover:to-[#CF6F2E] text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-[#E88745]/30 hover:shadow-xl hover:shadow-[#E88745]/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center space-x-3 group"
        >
          <span>Start Banking</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Security Notice */}
        <div className="mt-7 flex items-center justify-center space-x-2 text-xs text-[#737373] max-w-md">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>256-Bit Encrypted Session • Never share your PIN • Press Cancel anytime</span>
        </div>

        {/* Academic Project Attribution & Quick Link to SET Panel */}
        <div className="mt-8 pt-5 border-t border-[#E8DDD2] w-full flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] gap-3">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-[#E88745]" />
            <span>SET Academic Project Demo (PIN: <code className="bg-[#FFF8F0] px-1 py-0.5 rounded font-mono font-bold text-[#CF6F2E]">1234</code>)</span>
          </div>

          <button
            type="button"
            onClick={onOpenTestPanel}
            className="text-xs font-bold text-[#CF6F2E] hover:text-[#B6591E] flex items-center space-x-1 bg-[#FFF8F0] hover:bg-[#FBECE3] px-3 py-1.5 rounded-lg border border-[#E88745]/30 transition-colors"
          >
            <Beaker className="w-3.5 h-3.5 text-[#E88745]" />
            <span>Launch SET Test Suite</span>
          </button>
        </div>
      </div>
    </div>
  );
}
