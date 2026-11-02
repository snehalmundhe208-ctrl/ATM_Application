import React, { useEffect, useState } from 'react';
import { Delete, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export default function Keypad({
  onDigit,
  onClear,
  onBackspace,
  onEnter,
  onCancel,
  disabled = false,
  enableKeyboard = true,
}) {
  const [activeKey, setActiveKey] = useState(null);

  const handlePress = (key, action) => {
    if (disabled) return;
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 120);
    action();
  };

  useEffect(() => {
    if (!enableKeyboard || disabled) return;

    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handlePress(e.key, () => onDigit && onDigit(e.key));
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handlePress('backspace', () => onBackspace && onBackspace());
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handlePress('enter', () => onEnter && onEnter());
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handlePress('cancel', () => onCancel && onCancel());
      } else if (e.key.toLowerCase() === 'c') {
        handlePress('clear', () => onClear && onClear());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, disabled, onDigit, onBackspace, onEnter, onCancel, onClear]);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-gradient-to-b from-[#2D2B28] to-[#22201D] rounded-2xl border-2 border-[#43403B] shadow-2xl select-none">
      {/* Top Brushed Steel Header Plate */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#3D3A36] text-[10px] font-mono tracking-widest text-[#B0A79C] uppercase">
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Encrypted Keypad</span>
        </span>
        <span>ADA Compliant</span>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {/* Left 3 columns: Numbers 1-9, Clear, 0, Back */}
        <div className="col-span-3 grid grid-cols-3 gap-2.5">
          {keys.map((num) => (
            <button
              key={num}
              type="button"
              disabled={disabled}
              onClick={() => handlePress(num, () => onDigit && onDigit(num))}
              className={`atm-key-metal h-14 rounded-xl flex items-center justify-center font-mono font-extrabold text-xl text-[#292929] relative transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${
                activeKey === num ? 'pressed' : ''
              }`}
            >
              <span>{num}</span>
              {/* Tactile guide dot on key 5 for accessibility */}
              {num === '5' && (
                <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-[#B8ACA0]" />
              )}
            </button>
          ))}

          {/* Clear Button (Ceramic Yellow) */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePress('clear', () => onClear && onClear())}
            className={`atm-key-metal-clear h-14 rounded-xl flex flex-col items-center justify-center font-bold text-xs transition-all active:scale-[0.98] disabled:opacity-40 ${
              activeKey === 'clear' ? 'pressed' : ''
            }`}
          >
            <RotateCcw className="w-4 h-4 mb-0.5 text-amber-700" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Clear</span>
          </button>

          {/* 0 Key */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePress('0', () => onDigit && onDigit('0'))}
            className={`atm-key-metal h-14 rounded-xl flex items-center justify-center font-mono font-extrabold text-xl text-[#292929] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${
              activeKey === '0' ? 'pressed' : ''
            }`}
          >
            0
          </button>

          {/* Backspace Key (Brushed Steel) */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePress('backspace', () => onBackspace && onBackspace())}
            className={`atm-key-metal-backspace h-14 rounded-xl flex flex-col items-center justify-center font-bold text-xs transition-all active:scale-[0.98] disabled:opacity-40 ${
              activeKey === 'backspace' ? 'pressed' : ''
            }`}
          >
            <Delete className="w-4 h-4 mb-0.5 text-gray-700" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Back</span>
          </button>
        </div>

        {/* Right 1 column: ATM Action Control Keys (Cancel & Enter) */}
        <div className="col-span-1 flex flex-col gap-2.5 justify-between">
          {/* Cancel button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePress('cancel', () => onCancel && onCancel())}
            className={`atm-key-metal-cancel flex-1 rounded-xl flex flex-col items-center justify-center py-2 px-1 text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-40 ${
              activeKey === 'cancel' ? 'pressed' : ''
            }`}
          >
            <XCircle className="w-5 h-5 mb-1 text-red-600" />
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Cancel</span>
          </button>

          {/* Enter button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePress('enter', () => onEnter && onEnter())}
            className={`atm-key-metal-enter flex-[1.6] rounded-xl flex flex-col items-center justify-center py-2 px-1 text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-40 ${
              activeKey === 'enter' ? 'pressed' : ''
            }`}
          >
            <CheckCircle2 className="w-6 h-6 mb-1 text-emerald-600" />
            <span className="text-[11px] uppercase font-extrabold tracking-wider">Enter</span>
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-[#A69C90] px-1 font-mono">
        <span>* Tactile feedback</span>
        <span>Keyboard: 0-9, Enter, Esc</span>
      </div>
    </div>
  );
}
