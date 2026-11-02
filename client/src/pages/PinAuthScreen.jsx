import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, CreditCard, ArrowLeft, AlertCircle, Unlock, Sparkles } from 'lucide-react';
import Keypad from '../components/Keypad';
import { api } from '../services/api';

export default function PinAuthScreen({
  cardNumber,
  onLoginSuccess,
  onCancel,
  onOpenTestPanel,
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [lockoutTime, setLockoutTime] = useState(null);

  const handleDigit = (digit) => {
    if (isLocked || isLoading) return;
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
      setError(null);
    }
  };

  const handleBackspace = () => {
    if (isLocked || isLoading) return;
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    if (isLocked || isLoading) return;
    setPin('');
    setError(null);
  };

  const handleSubmit = async () => {
    if (isLocked || isLoading) return;

    if (pin.length !== 4) {
      setError('Please enter your complete 4-digit ATM PIN.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.login(cardNumber || '1234567890123456', pin);
      if (response.success && response.account) {
        onLoginSuccess(response.account);
      }
    } catch (err) {
      if (err.status === 423 || err.code === 'ACCOUNT_LOCKED') {
        setIsLocked(true);
        setLockoutTime(err.details?.lockedUntil || new Date(Date.now() + 5 * 60000));
        setError(err.message || 'Account locked due to 3 consecutive failed attempts.');
      } else if (err.status === 401) {
        const remaining = err.details?.attemptsRemaining ?? (attemptsRemaining - 1);
        setAttemptsRemaining(remaining);
        setError(err.message || `Incorrect PIN. ${remaining} attempt(s) remaining.`);
      } else {
        setError(err.message || 'Authentication error. Please try again.');
      }
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick auto-submit when 4 digits are entered
  useEffect(() => {
    if (pin.length === 4) {
      handleSubmit();
    }
  }, [pin]);

  const handleQuickUnlock = async () => {
    try {
      await api.unlockAccount(cardNumber || '1234567890123456');
      setIsLocked(false);
      setError(null);
      setAttemptsRemaining(3);
    } catch (err) {
      setError('Failed to unlock account: ' + err.message);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Image with Warm Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF8F0]/95 via-[#F5EEE6]/90 to-[#FAF5EE]/85 backdrop-blur-[2px]" />
      </div>

      {/* Center PIN Authentication Box */}
      <div className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl border border-[#E8DDD2] shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        {/* Top Header Card Info */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-[#E8DDD2] mb-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel & Eject Card</span>
          </button>

          <div className="flex items-center space-x-2 bg-[#FFF8F0] border border-[#E8DDD2] px-3 py-1 rounded-full text-xs font-semibold text-[#CF6F2E]">
            <CreditCard className="w-3.5 h-3.5" />
            <span className="font-mono">1234 •••• •••• 3456</span>
          </div>
        </div>

        {/* Lock Icon & Instruction */}
        <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] border border-[#E8DDD2] flex items-center justify-center text-[#E88745] shadow-sm mb-3">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-[#292929] tracking-tight">
          Enter Your 4-Digit PIN
        </h2>
        <p className="text-xs sm:text-sm text-[#737373] mt-1 text-center max-w-sm">
          Please enter your Personal Identification Number on the keypad below or using your physical keyboard.
        </p>

        {/* PIN Display Dots Container */}
        <div className="my-5 flex items-center justify-center space-x-4">
          {[0, 1, 2, 3].map((idx) => {
            const hasDigit = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-150 ${
                  hasDigit
                    ? 'border-[#E88745] bg-[#FFF8F0] shadow-md shadow-[#E88745]/15 scale-105'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {hasDigit ? (
                  <div className="w-4 h-4 rounded-full bg-[#E88745] animate-in zoom-in duration-100" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </div>
            );
          })}
        </div>

        {/* Status / Error Banner */}
        {error && (
          <div className="w-full max-w-sm mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <span>{error}</span>
              {isLocked && (
                <div className="mt-2 pt-2 border-t border-red-200 flex items-center justify-between">
                  <span className="font-semibold">Reviewer Override:</span>
                  <button
                    type="button"
                    onClick={handleQuickUnlock}
                    className="flex items-center space-x-1 bg-white hover:bg-red-100 text-red-800 font-bold px-2 py-1 rounded border border-red-300 shadow-sm"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>Reset Account Lock</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#CF6F2E] mb-3 animate-pulse">
            <div className="w-3.5 h-3.5 border-2 border-[#CF6F2E] border-t-transparent rounded-full animate-spin" />
            <span>Verifying PIN with SecureBank Auth Gateway...</span>
          </div>
        )}

        {/* Keypad Component */}
        <Keypad
          onDigit={handleDigit}
          onBackspace={handleBackspace}
          onClear={handleClear}
          onEnter={handleSubmit}
          onCancel={onCancel}
          disabled={isLoading || isLocked}
        />

        {/* Demo PIN helper note */}
        <div className="mt-5 flex items-center justify-between w-full max-w-sm text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span>
            Default Demo PIN: <strong className="font-mono text-[#CF6F2E]">1234</strong>
          </span>
          <button
            type="button"
            onClick={() => setPin('1234')}
            className="text-[11px] font-bold text-[#E88745] hover:text-[#CF6F2E] underline"
          >
            Auto-fill 1234
          </button>
        </div>
      </div>
    </div>
  );
}
