import React from 'react';
import {
  Banknote,
  ArrowDownToLine,
  Send,
  KeyRound,
  Wallet,
  History,
  LogOut,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import BalanceCard from '../components/BalanceCard';
import OperationCard from '../components/OperationCard';

export default function MainMenuScreen({
  account,
  onSelectOperation,
  onViewHistory,
  onEjectCard,
  onRefreshBalance,
}) {
  const operations = [
    {
      id: 'WITHDRAW',
      title: 'Withdraw Cash',
      description: 'Instant cash dispensing in ₹500, ₹1000, ₹2000, ₹5000 or custom amounts.',
      icon: Banknote,
      badge: 'Fast Cash',
    },
    {
      id: 'DEPOSIT',
      title: 'Deposit Funds',
      description: 'Instant cash deposit into your SecureBank account with zero service charge.',
      icon: ArrowDownToLine,
      badge: 'Instant',
    },
    {
      id: 'TRANSFER',
      title: 'Transfer Funds',
      description: 'Transfer funds seamlessly to verified demo beneficiaries or other accounts.',
      icon: Send,
    },
    {
      id: 'CHANGE_PIN',
      title: 'Change PIN',
      description: 'Update your 4-digit ATM card PIN securely with bcrypt cryptographic hashing.',
      icon: KeyRound,
    },
    {
      id: 'CHECK_BALANCE',
      title: 'Check Balance',
      description: 'View live account balance breakdown and generate an official mini statement.',
      icon: Wallet,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 screen-fade-in">
      {/* Top Welcome & Virtual Card Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Welcome Greeting Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 bg-white rounded-[24px] border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#FFF8F0] border border-[#E8DDD2] px-3.5 py-1 rounded-full text-xs font-bold text-[#CF6F2E] mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Session Authenticated</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
              Hello, <span className="text-[#E88745]">{account?.cardHolder || 'Bill Gates'}</span>
            </h2>
            <p className="text-sm text-[#4A4A4A] mt-2 leading-relaxed font-medium">
              Select an ATM service below to proceed. All operations are protected by 256-bit banking encryption.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-8 pt-5 border-t border-[#F5EEE6] flex items-center gap-3">
            <button
              type="button"
              onClick={onViewHistory}
              className="flex-1 flex items-center justify-center space-x-2 bg-[#FAF5EE] hover:bg-[#FBECE3] border border-[#E8DDD2] hover:border-[#E88745]/40 text-[#292929] hover:text-[#CF6F2E] font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm transition-all duration-150 active:scale-95 shadow-xs"
            >
              <History className="w-4 h-4 text-[#E88745]" />
              <span>Transaction History</span>
            </button>

            <button
              type="button"
              onClick={onEjectCard}
              className="flex items-center justify-center space-x-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-[#D32F2F] font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm transition-all duration-150 active:scale-95 shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Eject Card</span>
            </button>
          </div>
        </div>

        {/* Right Side: Virtual Debit Card / Available Balance */}
        <div className="lg:col-span-7">
          <BalanceCard account={account} onRefresh={onRefreshBalance} />
        </div>
      </div>

      {/* 5 Large Operation Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#292929] tracking-tight">
              ATM Banking Operations
            </h3>
            <p className="text-xs text-[#737373]">Tap any card to begin transaction</p>
          </div>
          <span className="text-xs font-bold text-[#CF6F2E] bg-[#FFF8F0] px-3.5 py-1.5 rounded-full border border-[#E8DDD2]">
            5 Services Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {operations.map((op) => (
            <OperationCard
              key={op.id}
              title={op.title}
              description={op.description}
              icon={op.icon}
              badge={op.badge}
              onClick={() => onSelectOperation(op.id)}
            />
          ))}

          {/* 6th Slot: Statement & Ledger Quick Tile */}
          <button
            type="button"
            onClick={onViewHistory}
            className="group relative text-left w-full p-6 bg-gradient-to-br from-[#FFF8F0] to-white hover:from-[#FBECE3] hover:to-[#FFF8F0] rounded-[24px] border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-soft-lg transition-all duration-200 transform hover:-translate-y-1.5 active:scale-[0.98] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8DDD2] text-[#CF6F2E] flex items-center justify-center shadow-sm">
                <History className="w-6 h-6 transition-transform group-hover:rotate-45 duration-300" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white text-[#CF6F2E] border border-[#E8DDD2] px-2.5 py-1 rounded-full">
                Ledger
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-[#292929] group-hover:text-[#CF6F2E] transition-colors">
                Account Statement
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                Review past deposits, withdrawals, transfers, and print mini-statements.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8DDD2]/60 text-xs font-bold text-[#CF6F2E] flex items-center justify-between">
              <span>View All Transactions</span>
              <span>→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
