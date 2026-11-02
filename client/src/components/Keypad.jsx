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

  // Sound or tactile press simulation
  const handlePress = (key, action) => {
    if (disabled) return;
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 120);
    action();
  };

  useEffect(() => {
    if (!enableKeyboard || disabled) return;

    const handleKeyDown = (e) => {
      // Don't intercept if an actual input with its own handling has focus unless intended
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
    <div className="w-full max-w-sm mx-auto p-4 bg-[#FAF5EE] rounded-2xl border border-[#E8DDD2] shadow-inner select-none">
      <div className="grid grid-cols-4 gap-2.5">
        {/* Left 3 columns: Numbers 1-9 & 0 */}
        <div className="col-span-3 grid grid-cols-3 gap-2.5">
          {keys.map((num) => (
            <button
              key={num}
              type="button"
              disabled={disabled}
              onClick={() => handlePress(num, () => onDigit && onDigit(num))}
              className={`atm-key h-13 sm:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-xl text-[#292929] shadow-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                activeKey === num ? 'pressed' : ''
              }`}
            >
              {num}
            </button>
          ))}

          {/* Empty spacer / Clear */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePress('clear', () => onClear && onClear())}
            className={`atm-key atm-key-action-clear h-13 sm:h-14 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-sm transition-transform active:scale-95 disabled:opacity-50 ${
              activeKey === 'clear' ? 'pressed' : ''
            }`}
          >
            <RotateCcw className="w-4 h-4 mb-0.5 text-amber-700" />
            <span className="text-[10px] uppercase font-semibold">Clear</span>
          </button>

          {/* 0 Key */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePress('0', () => onDigit && onDigit('0'))}
            className={`atm-key h-13 sm:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-xl text-[#292929] shadow-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              activeKey === '0' ? 'pressed' : ''
            }`}
          >
            0
          </button>

          {/* Backspace Key */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePress('backspace', () => onBackspace && onBackspace())}
            className={`atm-key atm-key-action-backspace h-13 sm:h-14 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-sm transition-transform active:scale-95 disabled:opacity-50 ${
              activeKey === 'backspace' ? 'pressed' : ''
            }`}
          >
            <Delete className="w-4 h-4 mb-0.5 text-gray-700" />
            <span className="text-[10px] uppercase font-semibold">Back</span>
          </button>
        </div>

        {/* Right 1 column: ATM Action Control Keys (Cancel, Clear/Back, Enter) */}
        <div className="col-span-1 flex flex-col gap-2.5 justify-between">
          {/* Cancel button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePress('cancel', () => onCancel && onCancel())}
            className={`atm-key atm-key-action-cancel flex-1 rounded-xl flex flex-col items-center justify-center py-2 px-1 text-xs font-bold transition-transform active:scale-95 disabled:opacity-50 ${
              activeKey === 'cancel' ? 'pressed' : ''
            }`}
          >
            <XCircle className="w-5 h-5 mb-1 text-red-600" />
            <span className="text-[11px] uppercase tracking-wide">Cancel</span>
          </button>

          {/* Enter / Proceed button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePress('enter', () => onEnter && onEnter())}
            className={`atm-key atm-key-action-enter flex-[1.6] rounded-xl flex flex-col items-center justify-center py-2 px-1 text-xs font-bold transition-transform active:scale-95 disabled:opacity-50 ${
              activeKey === 'enter' ? 'pressed' : ''
            }`}
          >
            <CheckCircle2 className="w-6 h-6 mb-1 text-emerald-600" />
            <span className="text-[11px] uppercase tracking-wider font-extrabold">Enter</span>
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[#737373] px-1 font-mono">
        <span>* Tactile keypad simulation</span>
        <span>Keyboard input enabled</span>
      </div>
    </div>
  );
}
