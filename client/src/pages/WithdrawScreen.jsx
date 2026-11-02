import React, { useState } from 'react';
import {
  Banknote,
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

export default function WithdrawScreen({
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
  const [isDispensing, setIsDispensing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const quickAmounts = [500, 1000, 2000, 5000];

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
    if (customAmount.length < 5) {
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
      setError('Please select or enter a valid withdrawal amount.');
      return;
    }

    if (amt % 100 !== 0) {
      setError('Amount must be a multiple of ₹100, ₹200, or ₹500.');
      return;
    }

    if (amt > (account?.balance || 0)) {
      setError(
        `Insufficient balance. Available balance is ${formatCurrency(account?.balance)}.`
      );
      return;
    }

    if (amt > 40000) {
      setError('Maximum per-transaction ATM withdrawal limit is ₹40,000.');
      return;
    }

    setError(null);
    setIsConfirming(true);
  };

  const handleConfirmWithdraw = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await api.withdraw(currentAmount);

      if (response.success && response.receipt) {
        setIsConfirming(false);
        // Show realistic cash dispensing animation for 2 seconds
        setIsDispensing(true);
        setTimeout(() => {
          setIsDispensing(false);
          setReceiptData(response.receipt);
          onRefreshBalance();
        }, 1800);
      }
    } catch (err) {
      setIsConfirming(false);
      setError(err.message || 'Withdrawal request failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // If receipt is ready, show Transaction Receipt Screen
  if (receiptData) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-emerald-800 text-xs font-bold mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Cash Dispensed Successfully</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#292929]">Withdrawal Receipt</h2>
          <p className="text-xs text-[#737373]">Please collect your cash from the dispenser slot.</p>
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

  // Realistic Cash Dispenser Animation Overlay
  if (isDispensing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#FFF8F0] border-2 border-[#E88745] flex items-center justify-center text-[#E88745] shadow-lg mb-6 animate-bounce">
          <Banknote className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#292929]">Counting Notes...</h3>
        <p className="text-sm text-[#737373] mt-2 max-w-sm">
          Please wait while the ATM counts and dispenses your cash of{' '}
          <strong className="text-[#CF6F2E]">{formatCurrency(currentAmount)}</strong>.
        </p>
        <div className="w-48 h-2 bg-[#E8DDD2] rounded-full overflow-hidden mt-6">
          <div className="h-full bg-[#E88745] rounded-full animate-pulse" style={{ width: '100%' }} />
        </div>
        <p className="text-xs font-mono text-[#CF6F2E] mt-3">⚡ Cash shutter opening...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
          <p className="text-[10px] uppercase font-bold text-gray-500">Available Balance</p>
          <p className="text-sm sm:text-base font-extrabold font-mono text-emerald-700">
            {formatCurrency(account?.balance)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Quick Amounts & Custom Input Display */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#FFF8F0] border border-[#E8DDD2] px-3 py-1 rounded-full text-xs font-semibold text-[#CF6F2E] mb-2">
              <Banknote className="w-3.5 h-3.5" />
              <span>Cash Dispenser</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
              Withdraw Cash
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] mt-1">
              Select a quick denomination or enter a custom amount in multiples of ₹100.
            </p>
          </div>

          {/* Quick Amount Tiles */}
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2.5">
              Quick Withdrawal Amounts
            </p>
            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((amt) => {
                const isSelected = selectedQuick === amt;
                const canAfford = (account?.balance || 0) >= amt;

                return (
                  <button
                    key={amt}
                    type="button"
                    disabled={!canAfford}
                    onClick={() => handleQuickSelect(amt)}
                    className={`p-4 rounded-2xl border text-center transition-all duration-150 transform active:scale-95 ${
                      isSelected
                        ? 'bg-[#E88745] border-[#CF6F2E] text-white shadow-md shadow-[#E88745]/25 font-extrabold text-lg'
                        : canAfford
                        ? 'bg-white hover:bg-[#FFF8F0] border-[#E8DDD2] text-[#292929] font-bold text-base hover:border-[#E88745]'
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div>{formatCurrency(amt)}</div>
                    {!canAfford && (
                      <span className="text-[10px] text-red-500 font-semibold">Insufficient Bal</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount Field */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8DDD2] shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              <span>Selected Amount</span>
              <span className="font-mono text-gray-400">Multiples of ₹100</span>
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

            {/* Dispenser Denomination Note */}
            <div className="flex items-center space-x-1.5 text-[11px] text-[#737373] pt-1">
              <Info className="w-3.5 h-3.5 text-[#E88745] flex-shrink-0" />
              <span>Dispensing available in ₹100, ₹200, and ₹500 currency notes.</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Proceed Button */}
          <button
            type="button"
            onClick={handleProceed}
            className="w-full py-4 bg-[#E88745] hover:bg-[#D9732F] text-white font-extrabold text-base rounded-2xl shadow-lg shadow-[#E88745]/25 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Dispense {currentAmount > 0 ? formatCurrency(currentAmount) : 'Cash'}</span>
          </button>
        </div>

        {/* Right Side: Keypad */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-[#E8DDD2] shadow-soft">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Custom Amount Numeric Keypad
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
        title="Confirm Cash Withdrawal"
        message="Please verify your requested cash withdrawal amount before ATM dispensing."
        confirmText="Confirm & Dispense"
        isLoading={isProcessing}
        onConfirm={handleConfirmWithdraw}
        onCancel={() => setIsConfirming(false)}
        details={[
          { label: 'Card Number', value: '1234 •••• •••• 3456' },
          { label: 'Withdrawal Amount', value: formatCurrency(currentAmount) },
          { label: 'Transaction Fee', value: '₹0.00 (Free)' },
          {
            label: 'Estimated New Balance',
            value: formatCurrency((account?.balance || 0) - currentAmount),
          },
        ]}
      />
    </div>
  );
}
