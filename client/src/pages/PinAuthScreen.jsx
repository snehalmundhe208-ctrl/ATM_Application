import React, { useState, useEffect } from 'react';
import {
  Lock,
  ArrowLeft,
  AlertCircle,
  Unlock,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import Keypad from '../components/Keypad';
import AtmTerminalBezel from '../components/AtmTerminalBezel';
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
    <AtmTerminalBezel
      backgroundImage="/images/atm-bank-lobby.jpg"
      cardInserted={true}
      screenTitle="PIN Authentication"
    >
      <div className="w-full max-w-xl bg-white/94 backdrop-blur-md rounded-3xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 sm:p-8 flex flex-col items-center screen-fade-in relative">
        {/* Top Header Card Bar */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-gray-200/80 mb-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel & Eject</span>
          </button>

          <div className="flex items-center space-x-2 bg-[#FFF8F0] border border-[#E8DDD2] px-3 py-1 rounded-full text-xs font-semibold text-[#CF6F2E]">
            <CreditCard className="w-3.5 h-3.5" />
            <span className="font-mono font-bold">1234 •••• •••• 3456</span>
          </div>
        </div>

        {/* Lock Icon & Instruction */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#CF6F2E] via-[#E88745] to-[#F2A066] flex items-center justify-center text-white shadow-lg shadow-[#E88745]/25 ring-4 ring-white mb-3">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
          Enter Your 4-Digit PIN
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 text-center max-w-sm">
          Please enter your Personal Identification Number using the tactile keypad or physical keyboard.
        </p>

        {/* PIN Display Dots Container */}
        <div className="my-5 flex items-center justify-center space-x-4">
          {[0, 1, 2, 3].map((idx) => {
            const hasDigit = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-150 ${
                  hasDigit
                    ? 'border-[#E88745] bg-[#FFF8F0] shadow-md shadow-[#E88745]/20 scale-105 ring-2 ring-[#E88745]/30'
                    : 'border-gray-300 bg-white shadow-sm'
                }`}
              >
                {hasDigit ? (
                  <div className="w-4 h-4 rounded-full bg-[#E88745] animate-in zoom-in duration-100" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                )}
              </div>
            );
          })}
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="w-full max-w-sm mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <span className="font-semibold">{error}</span>
              {isLocked && (
                <div className="mt-2 pt-2 border-t border-red-200 flex items-center justify-between">
                  <span className="font-bold">Reviewer Override:</span>
                  <button
                    type="button"
                    onClick={handleQuickUnlock}
                    className="flex items-center space-x-1 bg-white hover:bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-lg border border-red-300 shadow-sm"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Reset Lock</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-xs font-bold text-[#CF6F2E] mb-3 animate-pulse">
            <div className="w-4 h-4 border-2 border-[#CF6F2E] border-t-transparent rounded-full animate-spin" />
            <span>Verifying PIN with SecureBank Gateway...</span>
          </div>
        )}

        {/* Tactile Metal Keypad */}
        <Keypad
          onDigit={handleDigit}
          onBackspace={handleBackspace}
          onClear={handleClear}
          onEnter={handleSubmit}
          onCancel={onCancel}
          disabled={isLoading || isLocked}
        />

        {/* Demo PIN helper */}
        <div className="mt-5 flex items-center justify-between w-full max-w-sm text-xs text-gray-500 pt-3 border-t border-gray-200/80">
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
    </AtmTerminalBezel>
  );
}
