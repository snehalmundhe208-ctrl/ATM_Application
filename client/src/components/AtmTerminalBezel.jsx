import React from 'react';
import { CreditCard, Landmark, ShieldCheck } from 'lucide-react';

export default function AtmTerminalBezel({
  children,
  backgroundImage = '/images/atm-bank-lobby.jpg',
  cardInserted = true,
  screenTitle = 'SecureBank ATM Terminal',
}) {
  return (
    <div className="w-full max-w-5xl mx-auto my-4 sm:my-8 px-2 sm:px-4">
      {/* Outer ATM Machine Hardware Cabinet / Bezel */}
      <div className="atm-chassis rounded-[32px] p-3 sm:p-5 shadow-2xl relative">
        {/* ATM Top Hardware Bezel Bar */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 text-[#B0A79C] text-xs font-mono border-b border-[#3D3A36] mb-3">
          {/* Left: Speaker Grille Micro-Dots */}
          <div className="flex items-center space-x-1.5 opacity-60">
            <div className="grid grid-cols-6 gap-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-[#706B64]" />
              ))}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider ml-2 hidden sm:inline">
              Audio
            </span>
          </div>

          {/* Center: Camera Lens & Security Sensor */}
          <div className="flex items-center space-x-2 bg-[#171615] px-3 py-1 rounded-full border border-[#3A3834] shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-emerald-500/50 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-gray-300 font-sans tracking-wide">
              Privacy Camera Active
            </span>
          </div>

          {/* Right: Terminal Branding */}
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#E88745] shadow-[0_0_8px_#E88745]" />
            <span className="font-extrabold text-[#FFF8F0] tracking-wider text-xs">
              SECURE<span className="text-[#E88745]">BANK</span>
            </span>
          </div>
        </div>

        {/* ATM Recessed Display Screen Area */}
        <div className="relative rounded-2xl overflow-hidden atm-screen-recess border border-[#43403B] min-h-[580px] flex items-center justify-center">
          {/* High-Resolution Bank/ATM Interior Photography Background */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
              backgroundPosition: 'center 40%',
            }}
          >
            {/* 35-40% Warm Cream Overlay - Keeps photo sharp and clearly visible */}
            <div className="absolute inset-0 bg-[#FFF8F0]/40 backdrop-contrast-[1.05]" />
          </div>

          {/* Screen Content Wrapper */}
          <div className="relative z-10 w-full p-4 sm:p-8 flex items-center justify-center">
            {children}
          </div>
        </div>

        {/* ATM Bottom Hardware Panel: Card Reader Slot & Cash Dispenser Shutter */}
        <div className="mt-4 pt-3 border-t border-[#3D3A36] grid grid-cols-1 sm:grid-cols-12 gap-4 items-center px-2 sm:px-4">
          {/* Cash Dispenser Shutter Strip */}
          <div className="sm:col-span-7 bg-[#171615] rounded-xl p-2.5 border border-[#3A3834] flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-500/70" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#B0A79C]">
                  Cash Dispenser
                </p>
                <div className="w-48 sm:w-64 h-2 bg-[#2D2B28] rounded border border-[#43403B] mt-0.5 overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 w-8 bg-[#E88745]/60 blur-[2px]" />
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-gray-500">Auto-Shutter</span>
          </div>

          {/* Card Reader Slot with Glowing LED */}
          <div className="sm:col-span-5 bg-[#171615] rounded-xl p-2.5 border border-[#3A3834] flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-2.5">
              <CreditCard className="w-5 h-5 text-[#E88745]" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#B0A79C]">
                  Card Reader Slot
                </p>
                <div className="w-28 sm:w-36 h-2 bg-[#2D2B28] rounded border border-[#43403B] mt-0.5 relative overflow-hidden">
                  <div className={`h-full w-full ${cardInserted ? 'atm-led-slot bg-emerald-500' : 'bg-amber-400'}`} />
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{cardInserted ? 'CARD ACTIVE' : 'INSERT CARD'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
