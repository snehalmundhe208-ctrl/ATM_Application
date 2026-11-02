import React, { useState, useEffect } from 'react';
import {
  History,
  ArrowLeft,
  Search,
  Filter,
  ArrowDownToLine,
  Banknote,
  Send,
  Printer,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
  KeyRound,
} from 'lucide-react';
import TransactionReceipt from '../components/TransactionReceipt';
import { api } from '../services/api';

export default function TransactionHistoryScreen({
  account,
  onBack,
  onNewTransaction,
}) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'WITHDRAWAL' | 'DEPOSIT' | 'TRANSFER'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await api.getHistory();
        if (res.success && res.data) {
          setTransactions(res.data);
        }
      } catch (err) {
        console.error('Failed to load transaction history:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownToLine className="w-4 h-4 text-emerald-600" />;
      case 'WITHDRAWAL':
        return <Banknote className="w-4 h-4 text-[#E88745]" />;
      case 'TRANSFER':
        return <Send className="w-4 h-4 text-blue-600" />;
      case 'PIN_CHANGE':
        return <KeyRound className="w-4 h-4 text-purple-600" />;
      default:
        return <History className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAmountColor = (type) => {
    if (type === 'DEPOSIT') return 'text-emerald-700 font-extrabold';
    if (type === 'WITHDRAWAL' || type === 'TRANSFER') return 'text-[#CF6F2E] font-extrabold';
    return 'text-gray-600';
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchRef = t.referenceNumber?.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchRecipient = t.recipientName?.toLowerCase().includes(q);
      return matchRef || matchDesc || matchRecipient;
    }
    return true;
  });

  if (selectedReceipt) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-extrabold text-[#292929]">Transaction Receipt</h2>
          <p className="text-xs text-[#737373]">Viewing saved transaction voucher</p>
        </div>

        <TransactionReceipt
          receipt={selectedReceipt}
          onBackToMenu={onBack}
          onNewTransaction={() => setSelectedReceipt(null)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8DDD2]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Menu</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 bg-white hover:bg-gray-50 border border-[#E8DDD2] text-gray-700 font-semibold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      {/* Screen Title & Balance Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-[#FFF8F0] border border-[#E8DDD2] px-3 py-1 rounded-full text-xs font-semibold text-[#CF6F2E] mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Audit Ledger</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
            Transaction History
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
            Real-time record of all deposits, cash withdrawals, and electronic transfers.
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl border border-[#E8DDD2] shadow-sm text-right">
          <span className="text-[10px] font-bold uppercase text-gray-500">Current Balance</span>
          <p className="font-mono font-extrabold text-lg text-emerald-700">
            {formatCurrency(account?.balance)}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8DDD2] shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference, recipient, or note..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5EE] rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#E88745]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto text-xs font-semibold">
          {['ALL', 'WITHDRAWAL', 'DEPOSIT', 'TRANSFER'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                filterType === f
                  ? 'bg-[#E88745] text-white shadow-sm font-bold'
                  : 'text-gray-600 hover:bg-[#FAF5EE]'
              }`}
            >
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="bg-white rounded-3xl border border-[#E8DDD2] shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#E88745] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500">Loading verified ledger history...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF5EE] flex items-center justify-center text-gray-400 mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-700">No Transactions Found</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              There are no transactions matching your active filter or search query.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F5EEE6]">
            {filteredTransactions.map((tx) => {
              const isCredit = tx.type === 'DEPOSIT';
              return (
                <div
                  key={tx.id || tx.referenceNumber}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FFF8F0]/40 transition-colors"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#E8DDD2] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getTransactionIcon(tx.type)}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-[#292929]">
                          {tx.type}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {tx.referenceNumber}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full">
                          {tx.status || 'SUCCESS'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mt-0.5">
                        {tx.description || `${tx.type} transaction`}
                      </p>

                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                        {formatDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className={`font-mono text-base ${getAmountColor(tx.type)}`}>
                      {isCredit ? '+' : tx.amount > 0 ? '-' : ''}
                      {formatCurrency(tx.amount)}
                    </div>

                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-[11px] font-mono text-gray-500">
                        Bal: {formatCurrency(tx.balanceAfter)}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedReceipt({
                            referenceNumber: tx.referenceNumber,
                            type: tx.type,
                            amount: tx.amount,
                            balanceAfter: tx.balanceAfter,
                            recipientName: tx.recipientName,
                            recipientAccountNumber: tx.recipientAccountNumber,
                            date: tx.createdAt,
                            terminalId: tx.terminalId || 'ATM-BLR-042',
                            cardHolder: account?.cardHolder || 'Sneha Sharma',
                            accountNumber: account?.accountNumber || '1234567890123456',
                            status: tx.status || 'SUCCESS',
                          })
                        }
                        className="text-xs font-semibold text-[#CF6F2E] hover:text-[#B6591E] flex items-center space-x-1 bg-[#FFF8F0] px-2 py-0.5 rounded border border-[#E88745]/30 hover:border-[#E88745]"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
