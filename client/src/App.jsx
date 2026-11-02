import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SetTestingModal from './components/SetTestingModal';

import WelcomeScreen from './pages/WelcomeScreen';
import PinAuthScreen from './pages/PinAuthScreen';
import MainMenuScreen from './pages/MainMenuScreen';
import WithdrawScreen from './pages/WithdrawScreen';
import DepositScreen from './pages/DepositScreen';
import TransferScreen from './pages/TransferScreen';
import ChangePinScreen from './pages/ChangePinScreen';
import CheckBalanceScreen from './pages/CheckBalanceScreen';
import TransactionHistoryScreen from './pages/TransactionHistoryScreen';
import ExitScreen from './pages/ExitScreen';

import { api, getStoredToken, setSessionToken } from './services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('WELCOME');
  const [activeCardNumber, setActiveCardNumber] = useState('1234567890123456');
  const [account, setAccount] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Show temporary toast message
  const showToast = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Re-fetch balance from backend
  const refreshBalance = useCallback(async () => {
    try {
      const res = await api.getBalance();
      if (res.success && res.data) {
        setAccount((prev) => ({
          ...(prev || {}),
          ...res.data,
        }));
      }
    } catch (err) {
      console.warn('Could not refresh balance:', err);
    }
  }, []);

  // Try to restore session if token exists
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      api.getBalance()
        .then((res) => {
          if (res.success && res.data) {
            setAccount(res.data);
            setCurrentScreen('MAIN_MENU');
          }
        })
        .catch(() => {
          setSessionToken(null);
          setAccount(null);
          setCurrentScreen('WELCOME');
        });
    }
  }, []);

  // Handle Start Banking
  const handleStartBanking = (cardNum) => {
    setActiveCardNumber(cardNum || '1234567890123456');
    setCurrentScreen('PIN_AUTH');
  };

  // Handle Login Success
  const handleLoginSuccess = (accountData) => {
    setAccount(accountData);
    setCurrentScreen('MAIN_MENU');
    showToast(`Welcome back, ${accountData.cardHolder}!`, 'success');
  };

  // Handle Logout / Eject Card
  const handleLogout = async () => {
    await api.logout();
    setAccount(null);
    setCurrentScreen('EXIT');
  };

  // Is this a fullscreen hero screen?
  const isHeroScreen = currentScreen === 'WELCOME' || currentScreen === 'PIN_AUTH' || currentScreen === 'EXIT';

  // Render the current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'WELCOME':
        return (
          <WelcomeScreen
            onStartBanking={handleStartBanking}
            onOpenTestPanel={() => setIsTestModalOpen(true)}
          />
        );

      case 'PIN_AUTH':
        return (
          <PinAuthScreen
            cardNumber={activeCardNumber}
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setCurrentScreen('WELCOME')}
            onOpenTestPanel={() => setIsTestModalOpen(true)}
          />
        );

      case 'MAIN_MENU':
        return (
          <MainMenuScreen
            account={account}
            onSelectOperation={(opId) => {
              if (opId === 'WITHDRAW') setCurrentScreen('WITHDRAW');
              else if (opId === 'DEPOSIT') setCurrentScreen('DEPOSIT');
              else if (opId === 'TRANSFER') setCurrentScreen('TRANSFER');
              else if (opId === 'CHANGE_PIN') setCurrentScreen('CHANGE_PIN');
              else if (opId === 'CHECK_BALANCE') setCurrentScreen('CHECK_BALANCE');
            }}
            onViewHistory={() => setCurrentScreen('TRANSACTION_HISTORY')}
            onEjectCard={handleLogout}
            onRefreshBalance={refreshBalance}
          />
        );

      case 'WITHDRAW':
        return (
          <WithdrawScreen
            account={account}
            onBack={() => setCurrentScreen('MAIN_MENU')}
            onRefreshBalance={refreshBalance}
            onNewTransaction={() => setCurrentScreen('MAIN_MENU')}
          />
        );

      case 'DEPOSIT':
        return (
          <DepositScreen
            account={account}
            onBack={() => setCurrentScreen('MAIN_MENU')}
            onRefreshBalance={refreshBalance}
            onNewTransaction={() => setCurrentScreen('MAIN_MENU')}
          />
        );

      case 'TRANSFER':
        return (
          <TransferScreen
            account={account}
            onBack={() => setCurrentScreen('MAIN_MENU')}
            onRefreshBalance={refreshBalance}
            onNewTransaction={() => setCurrentScreen('MAIN_MENU')}
          />
        );

      case 'CHANGE_PIN':
        return (
          <ChangePinScreen
            account={account}
            onBack={() => setCurrentScreen('MAIN_MENU')}
          />
        );

      case 'CHECK_BALANCE':
        return (
          <CheckBalanceScreen
            account={account}
            onBack={() => setCurrentScreen('MAIN_MENU')}
            onRefreshBalance={refreshBalance}
          />
        );

      case 'TRANSACTION_HISTORY':
        return (
          <TransactionHistoryScreen
            account={account}
            onBack={() => setCurrentScreen('MAIN_MENU')}
            onNewTransaction={() => setCurrentScreen('MAIN_MENU')}
          />
        );

      case 'EXIT':
        return (
          <ExitScreen
            onReturnToWelcome={() => setCurrentScreen('WELCOME')}
          />
        );

      default:
        return (
          <WelcomeScreen
            onStartBanking={handleStartBanking}
            onOpenTestPanel={() => setIsTestModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen ${isHeroScreen ? 'h-screen overflow-hidden' : ''} text-[#292929] flex flex-col font-sans relative`}>
      {/* Fixed Fullscreen Background Image across all screens */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none z-0"
        style={{
          backgroundImage: `url('/images/bank-bg.jpg')`,
        }}
      >
        {/* Dynamic Warm Cream Overlay:
            30% light overlay for Welcome/PIN/Exit screens (photo clearly visible)
            85% soft cream overlay for Dashboard and operation screens (subtle bank backdrop) */}
        <div
          className={`absolute inset-0 transition-colors duration-300 ${
            isHeroScreen ? 'bg-[#FFF8F0]/30' : 'bg-[#F5EEE6]/85'
          }`}
        />
      </div>

      {/* Top Navbar */}
      <div className="relative z-40">
        <Header
          account={account}
          onLogout={handleLogout}
          onOpenTestPanel={() => setIsTestModalOpen(true)}
          transparent={isHeroScreen}
        />
      </div>

      {/* Toast Alert Notification */}
      {notification && (
        <div className="fixed top-16 right-5 z-50 animate-in slide-in-from-top duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-lg border text-xs font-bold flex items-center space-x-2 ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-white border-[#E8DDD2] text-[#292929]'
            }`}
          >
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col justify-start relative z-10">
        {renderScreen()}
      </main>

      {/* SET Academic Testing Panel Modal */}
      <SetTestingModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />

      {/* Footer only on internal application screens */}
      {!isHeroScreen && (
        <footer className="w-full bg-white/90 border-t border-[#E8DDD2] py-3.5 px-4 text-center text-xs text-[#737373] relative z-10 no-print">
          <p>
            SecureBank ATM Simulation System • Software Engineering & Testing (SET) Project Demo • 256-Bit SSL Encrypted
          </p>
        </footer>
      )}
    </div>
  );
}
