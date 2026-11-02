import React, { useState } from 'react';
import { Eye, EyeOff, Wifi, Landmark, CreditCard, Sparkles } from 'lucide-react';

export default function BalanceCard({ account, onRefresh }) {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const maskAccount = (num) => {
    if (!num) return '•••• •••• •••• ••••';
    const clean = num.toString().replace(/\s+/g, '');
    if (clean.length >= 16) {
      return `${clean.substring(0, 4)} •••• •••• ${clean.substring(clean.length - 4)}`;
    }
    return `•••• •••• ${clean.slice(-4)}`;
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF8F0] via-[#FAF5EE] to-[#F5EEE6] border border-[#E8DDD2] p-6 shadow-soft-lg text-[#292929]">
      {/* Decorative Warm Geometric Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E88745]/15 via-[#F2A066]/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none blur-2xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#CF6F2E]/10 rounded-full -ml-12 -mb-12 pointer-events-none blur-xl" />

      <div className="relative z-10 flex flex-col justify-between h-full gap-5">
        {/* Top Header: Bank Emblem & Contactless icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#E88745] flex items-center justify-center text-white shadow-sm">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#292929]">
                Secure<span className="text-[#E88745]">Bank</span> Platinum
              </span>
              <p className="text-[10px] uppercase font-bold text-[#737373] tracking-wider">Debit Card</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[#737373]">
            <Wifi className="w-5 h-5 rotate-90 text-[#CF6F2E]" />
            <span className="text-[11px] font-semibold bg-white/80 border border-[#E8DDD2] px-2 py-0.5 rounded-full">
              RuPay EMV
            </span>
          </div>
        </div>

        {/* EMV Microchip Graphic */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-9 rounded-md bg-gradient-to-r from-[#DFB550] via-[#F4D06F] to-[#E2B755] border border-[#C59B34] flex items-center justify-center shadow-inner relative overflow-hidden">
            <div className="absolute inset-1 border border-[#B38728] rounded-[2px] opacity-60" />
            <div className="w-full h-[1px] bg-[#B38728] opacity-70" />
            <div className="h-full w-[1px] bg-[#B38728] opacity-70 absolute" />
          </div>
          <span className="text-xs font-mono text-[#737373]">ATM / POS Enabled</span>
        </div>

        {/* Balance Display & Eye Toggle */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8DDD2] shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-medium text-[#737373] mb-1">
              <span>Available Account Balance</span>
              <button
                type="button"
                onClick={() => setShowBalance(!showBalance)}
                className="text-[#CF6F2E] hover:text-[#B6591E] transition-colors p-0.5 rounded"
                title={showBalance ? 'Hide Balance' : 'Show Balance'}
              >
                {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#292929] font-mono">
              {showBalance ? (
                formatCurrency(account?.balance)
              ) : (
                <span className="tracking-widest text-lg font-bold text-[#737373]">••••••••</span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
              ● Active
            </span>
            <p className="text-[11px] text-[#737373] mt-1">{account?.accountType || 'Savings Account'}</p>
          </div>
        </div>

        {/* Card Number & Holder Info */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#737373] tracking-wider">Card Holder</p>
            <p className="font-bold text-sm tracking-wide uppercase text-[#292929]">
              {account?.cardHolder || 'Sneha Sharma'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-[#737373] tracking-wider">Account Number</p>
            <p className="font-mono text-sm tracking-wider font-semibold text-[#4A4A4A]">
              {maskAccount(account?.accountNumber)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
