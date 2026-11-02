import React from 'react';
import { Printer, ArrowLeft, RefreshCw, CheckCircle2, Landmark } from 'lucide-react';

export default function TransactionReceipt({
  receipt,
  onBackToMenu,
  onNewTransaction,
}) {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const maskAccount = (num) => {
    if (!num) return '•••• •••• •••• ••••';
    const clean = num.toString().replace(/\s+/g, '');
    if (clean.length >= 16) {
      return `${clean.substring(0, 4)} •••• •••• ${clean.substring(clean.length - 4)}`;
    }
    return `•••• •••• ${clean.slice(-4)}`;
  };

  return (
    <div className="w-full max-w-md mx-auto my-4 flex flex-col items-center">
      {/* Thermal Receipt Paper Card */}
      <div
        id="printable-receipt"
        className="w-full bg-white rounded-t-xl border border-gray-300 shadow-receipt p-6 sm:p-8 font-mono text-xs text-[#292929] relative receipt-paper"
      >
        {/* ATM Bank Header */}
        <div className="text-center pb-4 border-b border-dashed border-gray-400">
          <div className="flex items-center justify-center space-x-1.5 mb-1">
            <Landmark className="w-5 h-5 text-[#E88745]" />
            <span className="font-extrabold text-base tracking-tight font-sans text-[#292929]">
              Secure<span className="text-[#E88745]">Bank</span> ATM
            </span>
          </div>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-sans">
            Bangalore Indiranagar Branch
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Terminal ID: {receipt.terminalId || 'ATM-BLR-042'}</p>
        </div>

        {/* Success Status Pill */}
        <div className="my-3 py-1.5 px-3 bg-emerald-50 border border-emerald-200 rounded text-center text-emerald-800 font-sans font-bold flex items-center justify-center space-x-1.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>TRANSACTION {receipt.status || 'SUCCESSFUL'}</span>
        </div>

        {/* Transaction Metadata Grid */}
        <div className="space-y-2 py-3 border-b border-dashed border-gray-400">
          <div className="flex justify-between">
            <span className="text-gray-500">REF NO:</span>
            <span className="font-bold text-gray-800">{receipt.referenceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">DATE & TIME:</span>
            <span>{formatDate(receipt.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">TXN TYPE:</span>
            <span className="font-bold text-[#CF6F2E]">{receipt.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">CARD NUMBER:</span>
            <span>{maskAccount(receipt.accountNumber)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">CARD HOLDER:</span>
            <span className="uppercase font-semibold">{receipt.cardHolder || 'Sneha Sharma'}</span>
          </div>

          {receipt.recipientName && (
            <div className="flex justify-between bg-amber-50/70 p-1 rounded">
              <span className="text-gray-600">BENEFICIARY:</span>
              <span className="font-bold text-amber-900">{receipt.recipientName}</span>
            </div>
          )}

          {receipt.recipientAccountNumber && (
            <div className="flex justify-between">
              <span className="text-gray-500">BENEFICIARY ACC:</span>
              <span>{maskAccount(receipt.recipientAccountNumber)}</span>
            </div>
          )}
        </div>

        {/* Amount & Remaining Balance Section */}
        <div className="py-4 border-b border-dashed border-gray-400 space-y-2">
          {receipt.amount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-700">TRANSACTION AMT:</span>
              <span className="font-extrabold text-base text-[#292929]">
                {formatCurrency(receipt.amount)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-gray-700">AVAILABLE BAL:</span>
            <span className="font-extrabold text-base text-emerald-700">
              {formatCurrency(receipt.balanceAfter)}
            </span>
          </div>
        </div>

        {/* Security & Regulatory Notice */}
        <div className="pt-4 text-center text-[10px] text-gray-500 font-sans leading-relaxed">
          <p className="font-semibold text-gray-700">THANK YOU FOR BANKING WITH SECUREBANK!</p>
          <p className="mt-1">Please take your card, receipt, and cash.</p>
          <p className="mt-1 text-[9px] text-gray-400">
            For 24/7 Helpline: 1800-SECURE-BANK • www.securebank.demo
          </p>
        </div>

        {/* Jagged / Perforated Receipt Bottom Edge */}
        <div className="receipt-zigzag-bottom absolute -bottom-2.5 left-0 right-0" />
      </div>

      {/* Action Buttons (Excluded from print) */}
      <div className="w-full mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl shadow-sm transition-all active:scale-95"
        >
          <Printer className="w-4 h-4 text-gray-600" />
          <span>Print Receipt</span>
        </button>

        <button
          type="button"
          onClick={onNewTransaction}
          className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 bg-[#FFF8F0] hover:bg-[#FBECE3] border border-[#E88745]/40 text-[#CF6F2E] font-bold py-3 px-4 rounded-xl shadow-sm transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4 text-[#E88745]" />
          <span>New Transaction</span>
        </button>

        <button
          type="button"
          onClick={onBackToMenu}
          className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 bg-[#E88745] hover:bg-[#D9732F] text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-[#E88745]/20 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Main Menu</span>
        </button>
      </div>
    </div>
  );
}
