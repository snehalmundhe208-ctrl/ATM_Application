import React, { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import Keypad from '../components/Keypad';
import ConfirmationModal from '../components/ConfirmationModal';
import TransactionReceipt from '../components/TransactionReceipt';
import { api } from '../services/api';

export default function DepositScreen({
  account,
  onBack,
  onRefreshBalance,
  onNewTransaction,
}) {
  const [selectedQuick, setSelectedQuick] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [error, setError] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAcceptingNotes, setIsAcceptingNotes] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const quickAmounts = [1000, 2000, 5000, 10000];

  const currentAmount = selectedQuick || (customAmount ? Number(customAmount) : 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleQuickSelect = (amt) => {
    setSelectedQuick(amt);
    setCustomAmount('');
    setError(null);
  };

  const handleDigit = (d) => {
    setSelectedQuick(null);
    if (customAmount.length < 6) {
      setCustomAmount((prev) => prev + d);
      setError(null);
    }
  };

  const handleBackspace = () => {
    setSelectedQuick(null);
    setCustomAmount((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setSelectedQuick(null);
    setCustomAmount('');
    setError(null);
  };

  const handleProceed = () => {
    const amt = currentAmount;

    if (!amt || amt <= 0) {
      setError('Please select or enter a valid deposit amount.');
      return;
    }

    if (amt > 200000) {
      setError('Maximum per-transaction instant ATM cash deposit is ₹2,00,000.');
      return;
    }

    setError(null);
    setIsConfirming(true);
  };

  const handleConfirmDeposit = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await api.deposit(currentAmount);

      if (response.success && response.receipt) {
        setIsConfirming(false);
        // Show realistic cash slot deposit animation
        setIsAcceptingNotes(true);
        setTimeout(() => {
          setIsAcceptingNotes(false);
          setReceiptData(response.receipt);
          onRefreshBalance();
        }, 1800);
      }
    } catch (err) {
      setIsConfirming(false);
      setError(err.message || 'Deposit failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (receiptData) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-emerald-800 text-xs font-bold mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Deposit Successful</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#292929]">Deposit Receipt</h2>
          <p className="text-xs text-[#737373]">Your account has been credited in real time.</p>
        </div>

        <TransactionReceipt
          receipt={receiptData}
          onBackToMenu={onBack}
          onNewTransaction={() => {
            setReceiptData(null);
            setSelectedQuick(null);
            setCustomAmount('');
            if (onNewTransaction) onNewTransaction();
          }}
        />
      </div>
    );
  }

  if (isAcceptingNotes) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-lg mb-6 animate-pulse">
          <ArrowDownToLine className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#292929]">Accepting Currency Notes...</h3>
        <p className="text-sm text-[#737373] mt-2 max-w-sm">
          Please place your flat currency notes of{' '}
          <strong className="text-emerald-700">{formatCurrency(currentAmount)}</strong> into the deposit feeder slot.
        </p>
        <div className="w-48 h-2 bg-[#E8DDD2] rounded-full overflow-hidden mt-6">
          <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '100%' }} />
        </div>
        <p className="text-xs font-mono text-emerald-700 mt-3">⚡ Validating note denominations & security threads...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 screen-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DDD2] mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Menu</span>
        </button>

        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-gray-500">Current Balance</p>
          <p className="text-sm sm:text-base font-extrabold font-mono text-emerald-700">
            {formatCurrency(account?.balance)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Quick Amounts & Custom Input Display */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 mb-2">
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Instant Cash Deposit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
              Deposit Funds
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] mt-1">
              Select or type the total cash amount you are depositing into your account.
            </p>
          </div>

          {/* Quick Amount Tiles */}
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2.5">
              Common Deposit Amounts
            </p>
            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((amt) => {
                const isSelected = selectedQuick === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickSelect(amt)}
                    className={`p-4 rounded-2xl border text-center transition-all duration-150 transform active:scale-95 font-bold text-base ${
                      isSelected
                        ? 'bg-[#E88745] border-[#CF6F2E] text-white shadow-md shadow-[#E88745]/25 text-lg'
                        : 'bg-white hover:bg-[#FFF8F0] border-[#E8DDD2] text-[#292929] hover:border-[#E88745]'
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount Field */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8DDD2] shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              <span>Deposit Amount</span>
              <span className="font-mono text-gray-400">INR (₹)</span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 font-bold text-xl text-[#E88745]">₹</span>
              <input
                type="text"
                readOnly
                value={currentAmount ? currentAmount.toLocaleString('en-IN') : ''}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3.5 bg-[#FAF5EE] rounded-xl border border-[#E8DDD2] font-mono font-extrabold text-2xl text-[#292929] tracking-wider focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-1.5 text-[11px] text-[#737373] pt-1">
              <Info className="w-3.5 h-3.5 text-[#E88745] flex-shrink-0" />
              <span>Accepts clean notes of ₹100, ₹200, and ₹500 denominations.</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Deposit Button */}
          <button
            type="button"
            onClick={handleProceed}
            className="w-full py-4 bg-[#E88745] hover:bg-[#D9732F] text-white font-extrabold text-base rounded-2xl shadow-lg shadow-[#E88745]/25 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Deposit {currentAmount > 0 ? formatCurrency(currentAmount) : 'Cash'}</span>
          </button>
        </div>

        {/* Right Side: Keypad */}
        <div className="lg:col-span-5 bg-white p-6 rounded-[24px] border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Deposit Amount Keypad
          </p>
          <Keypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            onClear={handleClear}
            onEnter={handleProceed}
            onCancel={onBack}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirming}
        title="Confirm Cash Deposit"
        message="Please verify your deposit amount before feeding the currency notes."
        confirmText="Confirm & Deposit"
        isLoading={isProcessing}
        onConfirm={handleConfirmDeposit}
        onCancel={() => setIsConfirming(false)}
        variant="green"
        details={[
          { label: 'Beneficiary Account', value: 'Bill Gates (1234 •••• •••• 3456)' },
          { label: 'Deposit Amount', value: formatCurrency(currentAmount) },
          {
            label: 'Estimated New Balance',
            value: formatCurrency((account?.balance || 0) + currentAmount),
          },
        ]}
      />
    </div>
  );
}
