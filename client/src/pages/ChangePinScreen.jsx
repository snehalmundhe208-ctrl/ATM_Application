import React, { useState } from 'react';
import {
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import Keypad from '../components/Keypad';
import { api } from '../services/api';

export default function ChangePinScreen({ account, onBack }) {
  const [activeStep, setActiveStep] = useState(0); // 0: current PIN, 1: new PIN, 2: confirm PIN
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState(null);

  const steps = [
    { label: 'Current PIN', key: 'currentPin', desc: 'Enter your active 4-digit ATM PIN' },
    { label: 'New PIN', key: 'newPin', desc: 'Choose a new 4-digit secure code' },
    { label: 'Confirm New PIN', key: 'confirmPin', desc: 'Re-enter your new 4-digit PIN' },
  ];

  const getActiveValue = () => {
    if (activeStep === 0) return currentPin;
    if (activeStep === 1) return newPin;
    return confirmPin;
  };

  const handleDigit = (d) => {
    if (isProcessing) return;
    setError(null);

    if (activeStep === 0) {
      if (currentPin.length < 4) setCurrentPin((prev) => prev + d);
    } else if (activeStep === 1) {
      if (newPin.length < 4) setNewPin((prev) => prev + d);
    } else if (activeStep === 2) {
      if (confirmPin.length < 4) setConfirmPin((prev) => prev + d);
    }
  };

  const handleBackspace = () => {
    if (isProcessing) return;
    setError(null);

    if (activeStep === 0) setCurrentPin((prev) => prev.slice(0, -1));
    else if (activeStep === 1) setNewPin((prev) => prev.slice(0, -1));
    else if (activeStep === 2) setConfirmPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isProcessing) return;
    setError(null);

    if (activeStep === 0) setCurrentPin('');
    else if (activeStep === 1) setNewPin('');
    else if (activeStep === 2) setConfirmPin('');
  };

  const handleNextOrSubmit = async () => {
    setError(null);

    if (activeStep === 0) {
      if (currentPin.length !== 4) {
        setError('Please enter your 4-digit current PIN.');
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (newPin.length !== 4) {
        setError('New PIN must be exactly 4 digits.');
        return;
      }
      if (newPin === currentPin) {
        setError('New PIN cannot be identical to your current PIN.');
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (confirmPin.length !== 4) {
        setError('Please re-enter the 4 digits to confirm.');
        return;
      }
      if (confirmPin !== newPin) {
        setError('New PIN and Confirmation PIN do not match.');
        return;
      }

      // Submit to backend
      setIsProcessing(true);
      try {
        const response = await api.changePin(currentPin, newPin, confirmPin);
        if (response.success) {
          setIsSuccess(true);
          setReferenceNumber(response.referenceNumber || 'PIN-UPD-SUCCESS');
        }
      } catch (err) {
        setError(err.message || 'Failed to update PIN. Please verify your current PIN.');
        // If current PIN is wrong, go back to step 0
        if (err.status === 401 || err.code === 'INCORRECT_CURRENT_PIN') {
          setActiveStep(0);
          setCurrentPin('');
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-3xl p-8 border border-[#E8DDD2] shadow-soft flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-extrabold text-[#292929]">
            PIN Changed Successfully!
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-md">
            Your ATM security PIN has been updated and securely hashed using bcrypt encryption. Please use your new PIN for all subsequent ATM transactions.
          </p>

          <div className="my-6 p-4 bg-[#FAF5EE] rounded-2xl border border-[#E8DDD2] w-full text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Security Audit Ref:</span>
              <span className="font-mono font-bold text-[#CF6F2E]">{referenceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Card Number:</span>
              <span className="font-mono">1234 •••• •••• 3456</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Card Holder:</span>
              <span className="font-bold uppercase">{account?.cardHolder || 'Bill Gates'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-3.5 bg-[#E88745] hover:bg-[#D9732F] text-white font-bold rounded-2xl shadow-md transition-all active:scale-95"
          >
            Return to Main Menu
          </button>
        </div>
      </div>
    );
  }

  const currentVal = getActiveValue();

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

        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          256-Bit Cryptographic Hashing
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Steps & Form */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#FFF8F0] border border-[#E8DDD2] px-3 py-1 rounded-full text-xs font-semibold text-[#CF6F2E] mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Card Security Settings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
              Change ATM PIN
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] mt-1">
              Follow the 3 steps to update your secret 4-digit ATM card PIN.
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-3 gap-2">
            {steps.map((st, idx) => {
              const isCurrent = activeStep === idx;
              const isDone = activeStep > idx;

              return (
                <div
                  key={st.key}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-[#FFF8F0] border-[#E88745] shadow-sm'
                      : isDone
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-white border-[#E8DDD2] text-gray-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1.5 mb-1">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isCurrent ? 'bg-[#E88745] text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {idx + 1}
                      </span>
                    )}
                    <span className="text-xs font-bold text-[#292929]">{st.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Step Box */}
          <div className="bg-white rounded-[24px] p-6 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.08)] text-center space-y-4">
            <h3 className="text-base font-bold text-[#292929]">
              {steps[activeStep].desc}
            </h3>

            {/* Masked Dots */}
            <div className="flex items-center justify-center space-x-4 my-4">
              {[0, 1, 2, 3].map((idx) => {
                const hasDigit = currentVal.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      hasDigit
                        ? 'border-[#E88745] bg-[#FFF8F0] scale-105'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {hasDigit ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-[#E88745]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Step Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              {activeStep > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep((prev) => prev - 1);
                    setError(null);
                  }}
                  className="py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs transition-colors hover:bg-gray-50"
                >
                  Previous Step
                </button>
              )}

              <button
                type="button"
                disabled={isProcessing || currentVal.length !== 4}
                onClick={handleNextOrSubmit}
                className="flex-1 py-3 px-4 bg-[#E88745] hover:bg-[#D9732F] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{activeStep === 2 ? 'Update & Hash PIN' : 'Confirm & Next'}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Keypad */}
        <div className="lg:col-span-5 bg-white p-6 rounded-[24px] border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            PIN Numeric Keypad
          </p>
          <Keypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            onClear={handleClear}
            onEnter={handleNextOrSubmit}
            onCancel={onBack}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
