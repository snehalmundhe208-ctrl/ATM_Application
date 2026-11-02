import React, { useState, useEffect } from 'react';
import {
  Send,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  Building,
  Sparkles,
} from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import TransactionReceipt from '../components/TransactionReceipt';
import { api } from '../services/api';

export default function TransferScreen({
  account,
  onBack,
  onRefreshBalance,
  onNewTransaction,
}) {
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [customAccountNumber, setCustomAccountNumber] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    async function loadRecipients() {
      try {
        const res = await api.getRecipients();
        if (res.success && res.data) {
          setRecipients(res.data);
          if (res.data.length > 0) {
            setSelectedRecipient(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load recipients:', err);
      } finally {
        setIsLoadingRecipients(false);
      }
    }
    loadRecipients();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const targetAccountNumber = isCustomMode
    ? customAccountNumber.trim()
    : selectedRecipient?.accountNumber;

  const targetRecipientName = isCustomMode
    ? 'External / Other Account'
    : selectedRecipient?.name;

  const handleProceed = () => {
    const numAmount = Number(amount);

    if (!targetAccountNumber) {
      setError('Please select or specify a recipient account number.');
      return;
    }

    if (targetAccountNumber === account?.accountNumber) {
      setError('You cannot transfer funds to your own account.');
      return;
    }

    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid transfer amount greater than ₹0.');
      return;
    }

    if (numAmount > (account?.balance || 0)) {
      setError(`Insufficient balance. You currently have ${formatCurrency(account?.balance)}.`);
      return;
    }

    setError(null);
    setIsConfirming(true);
  };

  const handleConfirmTransfer = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await api.transfer(targetAccountNumber, Number(amount), note);

      if (response.success && response.receipt) {
        setIsConfirming(false);
        setReceiptData(response.receipt);
        onRefreshBalance();
      }
    } catch (err) {
      setIsConfirming(false);
      setError(err.message || 'Fund transfer failed. Please check recipient details and balance.');
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
            <span>Fund Transfer Executed Successfully</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#292929]">Transfer Receipt</h2>
          <p className="text-xs text-[#737373]">Beneficiary has been credited instantaneously.</p>
        </div>

        <TransactionReceipt
          receipt={receiptData}
          onBackToMenu={onBack}
          onNewTransaction={() => {
            setReceiptData(null);
            setAmount('');
            setNote('');
            if (onNewTransaction) onNewTransaction();
          }}
        />
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
          <p className="text-[10px] uppercase font-bold text-gray-500">Available Balance</p>
          <p className="text-sm sm:text-base font-extrabold font-mono text-emerald-700">
            {formatCurrency(account?.balance)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form Area */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#FFF8F0] border border-[#E8DDD2] px-3 py-1 rounded-full text-xs font-semibold text-[#CF6F2E] mb-2">
              <Send className="w-3.5 h-3.5" />
              <span>Simulated Instant Transfer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
              Transfer Funds
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] mt-1">
              Select a verified demo beneficiary or enter an external account number.
            </p>
          </div>

          {/* Mode Switch: Predefined Beneficiaries vs Custom Account */}
          <div className="flex items-center bg-[#FAF5EE] p-1 rounded-2xl border border-[#E8DDD2] text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsCustomMode(false);
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                !isCustomMode
                  ? 'bg-white text-[#292929] shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Demo Beneficiaries ({recipients.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCustomMode(true);
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                isCustomMode
                  ? 'bg-white text-[#292929] shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Enter Account Manually
            </button>
          </div>

          {/* Beneficiary Selector */}
          {!isCustomMode ? (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                Select Predefined Beneficiary
              </label>

              <div className="space-y-2.5">
                {recipients.map((rec) => {
                  const isSelected = selectedRecipient?.accountNumber === rec.accountNumber;
                  return (
                    <div
                      key={rec.accountNumber}
                      onClick={() => {
                        setSelectedRecipient(rec);
                        setError(null);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#FFF8F0] border-[#E88745] shadow-sm ring-1 ring-[#E88745]'
                          : 'bg-white hover:bg-[#FAF5EE] border-[#E8DDD2]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-[#E88745] text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#292929]">{rec.name}</p>
                            <p className="font-mono text-xs text-gray-500">
                              {rec.accountNumber} • {rec.bankName}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {rec.ifscCode}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-[#E8DDD2] space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                Recipient Account Number
              </label>
              <input
                type="text"
                value={customAccountNumber}
                onChange={(e) => {
                  setCustomAccountNumber(e.target.value);
                  setError(null);
                }}
                placeholder="Enter 16-digit account number"
                className="w-full px-4 py-3 bg-[#FAF5EE] rounded-xl border border-[#E8DDD2] font-mono text-base font-semibold focus:outline-none focus:border-[#E88745]"
              />
              <p className="text-[11px] text-gray-500">
                You can enter Rahul Verma's account (`9876543210987654`) or test account (`9999888877776666`).
              </p>
            </div>
          )}

          {/* Amount & Note Fields */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DDD2] space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <span>Transfer Amount (₹)</span>
                <span>Max: {formatCurrency(account?.balance)}</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-4 font-bold text-xl text-[#E88745]">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3.5 bg-[#FAF5EE] rounded-xl border border-[#E8DDD2] font-mono font-extrabold text-2xl text-[#292929] focus:outline-none focus:border-[#E88745]"
                />
              </div>
            </div>

            {/* Transfer Note (Optional) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-1">
                Transaction Note / Remarks (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Rent, College fees, Project expenses"
                className="w-full px-4 py-2.5 bg-[#FAF5EE] rounded-xl border border-[#E8DDD2] text-sm focus:outline-none focus:border-[#E88745]"
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Transfer Button */}
          <button
            type="button"
            onClick={handleProceed}
            className="w-full py-4 bg-[#E88745] hover:bg-[#D9732F] text-white font-extrabold text-base rounded-2xl shadow-lg shadow-[#E88745]/25 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Proceed with Transfer</span>
          </button>
        </div>

        {/* Right Side Summary Info Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[24px] p-6 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.08)] space-y-4">
            <h4 className="text-sm font-bold text-[#292929] uppercase tracking-wider">
              Transfer Summary
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">From Account:</span>
                <span className="font-bold font-mono">1234 •••• 3456</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Beneficiary:</span>
                <span className="font-bold text-[#CF6F2E]">{targetRecipientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Transfer Amount:</span>
                <span className="font-bold font-mono text-sm">
                  {amount ? formatCurrency(Number(amount)) : '₹0'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Service Fee:</span>
                <span className="font-bold text-emerald-700">₹0.00 (Zero Fee)</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#737373] bg-white p-3 rounded-xl border border-[#E8DDD2]">
              🔒 Protected by 256-Bit SSL Encryption. Real-time IMPS/NEFT simulation without external banking gateway.
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirming}
        title="Confirm Beneficiary Fund Transfer"
        message="Please confirm the transfer of funds to the recipient. This action will immediately debit your account."
        confirmText="Confirm & Send"
        isLoading={isProcessing}
        onConfirm={handleConfirmTransfer}
        onCancel={() => setIsConfirming(false)}
        details={[
          { label: 'Sender', value: 'Sneha Sharma (1234 •••• •••• 3456)' },
          { label: 'Recipient Name', value: targetRecipientName },
          { label: 'Recipient Account', value: targetAccountNumber },
          { label: 'Transfer Amount', value: formatCurrency(Number(amount)) },
          {
            label: 'Remaining Balance',
            value: formatCurrency((account?.balance || 0) - Number(amount)),
          },
        ]}
      />
    </div>
  );
}
