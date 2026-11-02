import React, { useState, useEffect } from 'react';
import { Landmark, Clock, ShieldCheck, LogOut, Beaker, HelpCircle } from 'lucide-react';

export default function Header({ account, onLogout, onOpenTestPanel }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#E8DDD2] px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-sm">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#CF6F2E] via-[#E88745] to-[#F2A066] flex items-center justify-center text-white shadow-md shadow-[#E88745]/20 ring-2 ring-[#FFF8F0]">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-lg tracking-tight text-[#292929]">
              Secure<span className="text-[#E88745]">Bank</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#FFF8F0] text-[#E88745] border border-[#F2A066]/30 px-1.5 py-0.5 rounded">
              ATM Terminal
            </span>
          </div>
          <p className="text-xs text-[#737373] hidden sm:block">Bangalore Indiranagar Branch • ATM-BLR-042</p>
        </div>
      </div>

      {/* Center Live Clock */}
      <div className="flex items-center space-x-2 bg-[#FFF8F0] border border-[#E8DDD2] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#4A4A4A] shadow-inner">
        <Clock className="w-3.5 h-3.5 text-[#E88745] animate-pulse" />
        <span className="font-mono tracking-tight">{formatDateTime(currentTime)}</span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2.5">
        {/* SET Testing Academic Suite Button */}
        <button
          onClick={onOpenTestPanel}
          title="Open Software Engineering & Testing Panel"
          className="flex items-center space-x-1.5 bg-[#FFF8F0] hover:bg-[#FBECE3] border border-[#E88745]/40 text-[#CF6F2E] hover:text-[#B6591E] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95"
        >
          <Beaker className="w-4 h-4 text-[#E88745]" />
          <span>SET Test Suite</span>
          <span className="bg-[#E88745] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            14 TC
          </span>
        </button>

        {/* Eject / Exit Card Button when logged in */}
        {account && (
          <button
            onClick={onLogout}
            className="flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-[#D32F2F] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Eject Card</span>
          </button>
        )}
      </div>
    </header>
  );
}
