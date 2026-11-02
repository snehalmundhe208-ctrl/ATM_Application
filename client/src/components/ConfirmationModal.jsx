import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm & Proceed',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  details = [],
  variant = 'orange', // 'orange' | 'danger' | 'green'
}) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          btn: 'bg-red-600 hover:bg-red-700 text-white',
          iconBg: 'bg-red-100 text-red-600',
        };
      case 'green':
        return {
          btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          iconBg: 'bg-emerald-100 text-emerald-600',
        };
      default:
        return {
          btn: 'bg-[#E88745] hover:bg-[#D9732F] text-white shadow-[#E88745]/20',
          iconBg: 'bg-[#FFF8F0] text-[#CF6F2E]',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E8DDD2] shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        {/* Close Icon */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-center space-x-3.5 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${styles.iconBg} shadow-sm`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#292929] tracking-tight">{title}</h3>
            <p className="text-xs text-gray-500">SecureBank ATM Transaction Verification</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-4">{message}</p>

        {/* Key details list if provided */}
        {details && details.length > 0 && (
          <div className="bg-[#FAF5EE] rounded-2xl p-4 border border-[#E8DDD2] space-y-2 mb-6 text-xs">
            {details.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-0.5">
                <span className="text-gray-500 font-medium">{item.label}</span>
                <span className="font-bold text-[#292929]">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 ${styles.btn}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
