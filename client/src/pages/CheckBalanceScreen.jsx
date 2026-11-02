import React, { useState } from 'react';
import {
  Wallet,
  ArrowLeft,
  Printer,
  ShieldCheck,
  RefreshCw,
  Landmark,
  Clock,
  Sparkles,
} from 'lucide-react';
import TransactionReceipt from '../components/TransactionReceipt';

export default function CheckBalanceScreen({
  account,
  onBack,
  onRefreshBalance,
}) {
  const [showSlip, setShowSlip] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const maskAccount = (num) => {
    if (!num) return '1234 •••• •••• 3456';
    const clean = num.toString().replace(/\s+/g, '');
    if (clean.length >= 16) {
      return `${clean.substring(0, 4)} •••• •••• ${clean.substring(clean.length - 4)}`;
    }
    return `•••• •••• ${clean.slice(-4)}`;
  };

  const balanceReceipt = {
    referenceNumber: `BAL-INQ-${Date.now().toString().slice(-6)}`,
    type: 'BALANCE_INQUIRY',
    amount: 0,
    balanceAfter: account?.balance || 0,
    date: new Date().toISOString(),
    terminalId: 'ATM-BLR-042',
    cardHolder: account?.cardHolder || 'Sneha Sharma',
    accountNumber: account?.accountNumber || '1234567890123456',
    status: 'COMPLETED',
  };

  if (showSlip) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <div className="inline-flex items-center space-x-2 bg-[#FFF8F0] border border-[#E8DDD2] px-4 py-1.5 rounded-full text-[#CF6F2E] text-xs font-bold mb-2">
            <Landmark className="w-4 h-4 text-[#E88745]" />
            <span>Balance Inquiry Receipt</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#292929]">Official Account Balance Slip</h2>
          <p className="text-xs text-[#737373]">Print or review your verified balance certificate.</p>
        </div>

        <TransactionReceipt
          receipt={balanceReceipt}
          onBackToMenu={onBack}
          onNewTransaction={() => setShowSlip(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DDD2]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Menu</span>
        </button>

        <button
          type="button"
          onClick={onRefreshBalance}
          className="flex items-center space-x-1 text-xs font-semibold text-[#CF6F2E] hover:text-[#B6591E] bg-[#FFF8F0] px-3 py-1.5 rounded-xl border border-[#E8DDD2] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Balance Card Display */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DDD2] shadow-soft text-center flex flex-col items-center relative overflow-hidden">
        {/* Subtle orange accent orb */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#E88745]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-[#FFF8F0] border border-[#E8DDD2] flex items-center justify-center text-[#E88745] shadow-sm mb-4">
          <Wallet className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#737373]">
          Available Account Balance
        </span>

        {/* Big Balance */}
        <div className="text-3xl sm:text-5xl font-extrabold text-[#292929] my-3 font-mono tracking-tight text-[#CF6F2E]">
          {formatCurrency(account?.balance)}
        </div>

        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
          ● Account in Good Standing • No Overdraft
        </p>

        {/* Detailed Breakdown Grid */}
        <div className="w-full max-w-md mt-8 bg-[#FAF5EE] rounded-2xl p-5 border border-[#E8DDD2] text-xs space-y-3 text-left">
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500 font-medium">Account Holder:</span>
            <span className="font-bold text-[#292929] uppercase">{account?.cardHolder || 'Sneha Sharma'}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500 font-medium">Account Number:</span>
            <span className="font-mono font-bold text-[#292929]">{maskAccount(account?.accountNumber)}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500 font-medium">Account Category:</span>
            <span className="font-bold text-[#292929]">{account?.accountType || 'Savings Account'}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500 font-medium">Ledger Balance:</span>
            <span className="font-mono font-bold text-[#292929]">{formatCurrency(account?.balance)}</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-gray-500 font-medium">Inquiry Timestamp:</span>
            <span className="font-mono text-gray-700">{new Date().toLocaleTimeString('en-IN')}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <button
            type="button"
            onClick={() => setShowSlip(true)}
            className="w-full sm:flex-1 py-3.5 px-4 bg-[#FFF8F0] hover:bg-[#FBECE3] border border-[#E88745]/40 text-[#CF6F2E] font-bold rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Balance Slip</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full sm:flex-1 py-3.5 px-4 bg-[#E88745] hover:bg-[#D9732F] text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-95"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
