import React, { useState, useEffect } from 'react';
import {
  Lock,
  ArrowLeft,
  AlertCircle,
  Unlock,
  CreditCard,
} from 'lucide-react';
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
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Solid White Card - NO Glassmorphism, 24px Radius, 1px Border, Soft Shadow */}
      <div className="w-full max-w-lg bg-white rounded-[24px] border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 sm:p-8 flex flex-col items-center screen-fade-in my-auto">
        {/* Top Header Card Bar */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-[#E8DDD2] mb-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-1.5 text-xs font-bold text-[#4A4A4A] hover:text-[#292929] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel & Return</span>
          </button>

          <div className="flex items-center space-x-2 bg-[#FFF8F0] border border-[#E8DDD2] px-3 py-1 rounded-full text-xs font-semibold text-[#CF6F2E]">
            <CreditCard className="w-3.5 h-3.5" />
            <span className="font-mono font-bold">1234 •••• •••• 3456</span>
          </div>
        </div>

        {/* Lock Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#CF6F2E] via-[#E88745] to-[#F2A066] flex items-center justify-center text-white shadow-md shadow-[#E88745]/25 ring-3 ring-[#FFF8F0] mb-2">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-[#292929] tracking-tight">
          Enter Your 4-Digit PIN
        </h2>
        <p className="text-xs text-[#4A4A4A] mt-0.5 text-center max-w-sm">
          Use the on-screen keypad below or your physical keyboard.
        </p>

        {/* PIN Display Dots Container */}
        <div className="my-4 flex items-center justify-center space-x-3.5">
          {[0, 1, 2, 3].map((idx) => {
            const hasDigit = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-150 ${
                  hasDigit
                    ? 'border-[#E88745] bg-[#FFF8F0] shadow-xs scale-105 ring-2 ring-[#E88745]/30'
                    : 'border-gray-300 bg-white shadow-xs'
                }`}
              >
                {hasDigit ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#E88745] animate-in zoom-in duration-100" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </div>
            );
          })}
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="w-full max-w-sm mb-3.5 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <span className="font-semibold">{error}</span>
              {isLocked && (
                <div className="mt-2 pt-2 border-t border-red-200 flex items-center justify-between">
                  <span className="font-bold">Reviewer Override:</span>
                  <button
                    type="button"
                    onClick={handleQuickUnlock}
                    className="flex items-center space-x-1 bg-white hover:bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-lg border border-red-300 shadow-xs"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>Reset Lock</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-xs font-bold text-[#CF6F2E] mb-2.5 animate-pulse">
            <div className="w-3.5 h-3.5 border-2 border-[#CF6F2E] border-t-transparent rounded-full animate-spin" />
            <span>Verifying PIN with SecureBank Gateway...</span>
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

        {/* Demo PIN helper */}
        <div className="mt-4 flex items-center justify-between w-full max-w-sm text-xs text-[#737373] pt-2.5 border-t border-[#E8DDD2]">
          <span>
            Demo PIN: <strong className="font-mono text-[#CF6F2E] font-bold">1234</strong>
          </span>
          <button
            type="button"
            onClick={() => setPin('1234')}
            className="text-xs font-bold text-[#E88745] hover:text-[#CF6F2E] underline"
          >
            Auto-fill 1234
          </button>
        </div>
      </div>
    </div>
  );
}
