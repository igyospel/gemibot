import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { WalletModal } from './components/WalletModal';

// Simple view router state
type View = 'LANDING' | 'DASHBOARD';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('LANDING');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletKey, setWalletKey] = useState<string | null>(null);

  const handleConnectWallet = () => {
    setIsWalletModalOpen(true);
  };

  const handleWalletConnected = (key: string) => {
    setWalletKey(key);
    setIsWalletModalOpen(false);
    setCurrentView('DASHBOARD');
  };

  const handleLogout = () => {
    setWalletKey(null);
    setCurrentView('LANDING');
  };

  return (
    <div className="min-h-screen bg-poly-bg text-poly-text font-sans">
      <Layout 
        isConnected={!!walletKey} 
        onConnect={handleConnectWallet} 
        onLogout={handleLogout}
      >
        {currentView === 'LANDING' ? (
          <Landing onConnect={handleConnectWallet} />
        ) : (
          <Dashboard walletKey={walletKey} />
        )}
      </Layout>

      {isWalletModalOpen && (
        <WalletModal 
          onClose={() => setIsWalletModalOpen(false)} 
          onConnect={handleWalletConnected} 
        />
      )}
    </div>
  );
}