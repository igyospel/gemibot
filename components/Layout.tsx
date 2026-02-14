import React from 'react';
import { Wallet, LogOut, Bot, Menu, ArrowRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  isConnected: boolean;
  onConnect: () => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isConnected, onConnect, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-poly-accent/5 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-poly-secondary/5 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-poly-accentDim/10 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <div className="glass-panel rounded-full px-6 h-16 flex items-center justify-between shadow-2xl shadow-black/50">

          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-poly-accent/10 group-hover:bg-poly-accent/20 transition-colors">
              <Bot className="h-5 w-5 text-poly-accent relative z-10" />
              <div className="absolute inset-0 bg-poly-accent/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              Poly<span className="text-poly-accent">Bot</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {['Markets', 'Strategies', 'Ecosystem', 'Docs'].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-poly-muted hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5">
                {item}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="hidden sm:flex flex-col items-end leading-none">
                  <span className="text-[10px] uppercase tracking-wider text-poly-accent font-bold mb-1">Live</span>
                  <span className="text-xs font-mono text-white/80">0x...8aF2</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-poly-muted hover:text-red-400 transition-colors hover:bg-red-500/10 rounded-full"
                  title="Disconnect"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="group relative flex items-center gap-2 bg-white text-black px-3 py-1.5 md:px-5 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg shadow-white/5 overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-shimmer-slide z-10"></div>
                <span className="relative z-20 flex items-center gap-1 md:gap-2">
                  Connect
                  <span className="hidden sm:inline">Wallet</span>
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                </span>
              </button>
            )}
            {/* Mobile Menu Toggle - Ensure Z-Index is high enough */}
            <button
              className="md:hidden text-white p-2 rounded-full hover:bg-white/10 relative z-[60]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <LogOut className="h-5 w-5 rotate-180" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden animate-[fadeIn_0.2s_ease-out] flex flex-col items-center justify-center space-y-8 p-8">
            <nav className="flex flex-col items-center gap-6 w-full">
              {['Markets', 'Strategies', 'Ecosystem', 'Docs'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-2xl font-bold text-white hover:text-poly-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="w-full h-[1px] bg-white/10"></div>
            {isConnected ? (
              <button
                onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/20"
              >
                Disconnect Wallet
              </button>
            ) : (
              <button
                onClick={() => { onConnect(); setIsMobileMenuOpen(false); }}
                className="w-full py-4 rounded-xl bg-poly-accent text-black font-bold shadow-[0_0_20px_rgba(0,229,153,0.3)]"
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow pt-32 pb-12 px-4 sm:px-6">
        {children}
      </main>

      <footer className="border-t border-white/5 py-12 bg-black/40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-poly-muted text-sm gap-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 opacity-50" />
            <p>© 2024 PolyBot AI Inc.</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
};