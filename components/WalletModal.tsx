import React, { useState } from 'react';
import { X, AlertTriangle, Key } from 'lucide-react';

interface WalletModalProps {
  onClose: () => void;
  onConnect: (key: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ onClose, onConnect }) => {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.length > 5) {
      onConnect(inputKey);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-poly-card border border-poly-accent/20 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-poly-accent to-transparent"></div>
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-poly-accent/10 rounded-lg border border-poly-accent/20">
                <Key className="h-5 w-5 text-poly-accent" />
              </div>
              Connect Wallet
            </h2>
            <button onClick={onClose} className="text-poly-muted hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 mb-8 flex gap-4">
            <div className="p-2 bg-orange-500/10 rounded-lg h-fit">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-orange-500 mb-1">Security Warning</h4>
              <p className="text-xs text-orange-200/60 leading-relaxed">
                This is a <strong>DEMO</strong> interface. In a real application, you should never paste your private key directly into a website. For this demo, you can enter any random string.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-poly-muted uppercase tracking-wider mb-3">
                Private Key (Polygon)
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter your private key..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-poly-accent focus:ring-1 focus:ring-poly-accent transition-all font-mono text-sm"
                autoFocus
              />
              <p className="mt-3 text-xs text-poly-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Local encryption enabled (Simulated)
              </p>
            </div>

            <button
              type="submit"
              disabled={inputKey.length < 5}
              className="w-full bg-poly-accent hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              Unlock Wallet & Start Bot
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};