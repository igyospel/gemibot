import React from 'react';
import { Zap, TrendingUp, Shield, Cpu, ChevronRight, ArrowUpRight, Lock, Database, Globe, Users, Wallet } from 'lucide-react';

interface LandingProps {
  onConnect: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onConnect }) => {
  return (
    <div className="flex flex-col w-full overflow-hidden">

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center pb-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 px-4">

          <div className="text-left space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-poly-accent/10 border border-poly-accent/20 text-poly-accent text-xs font-bold tracking-wide uppercase backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-poly-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-poly-accent"></span>
              </span>
              Tracking 14,000+ Elite Wallets
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.95] font-display">
              Copy Trade <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-poly-accent via-white to-poly-accent bg-[length:200%_auto] animate-text-shimmer">Smart Money</span>
            </h1>

            <p className="text-xl text-poly-muted max-w-lg font-light leading-relaxed">
              Don't guess. Mirror the top performing whales on Polymarket automatically.
              <span className="text-white font-medium"> Non-custodial</span>,
              <span className="text-white font-medium"> instant execution</span>.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {/* ADVANCED PRIMARY BUTTON - LIQUID NEON STYLE */}
              <button
                onClick={onConnect}
                className="group relative px-10 py-5 rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,229,153,0.3)] hover:shadow-[0_0_50px_rgba(0,229,153,0.6)] hover:scale-105 transition-all duration-300"
              >
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-poly-accent via-poly-secondary to-poly-accent bg-[length:200%_100%] animate-gradient-xy"></div>

                {/* Subtle Grain Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                {/* Glare/Shine Effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:animate-shimmer-slide skew-x-12"></div>

                {/* Button Content */}
                <div className="relative z-10 flex items-center gap-3">
                  <span className="text-lg font-bold text-black tracking-wide">Start Copying</span>
                  <div className="bg-black/10 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="h-5 w-5 text-black stroke-[3px]" />
                  </div>
                </div>
              </button>

              {/* ADVANCED SECONDARY BUTTON - GLASS STYLE */}
              <button className="relative px-8 py-5 rounded-full font-semibold overflow-hidden group border border-white/10 hover:border-white/30 transition-colors">
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer-slide"></div>
                <span className="relative text-white/90 group-hover:text-white transition-colors">View Leaderboard</span>
              </button>
            </div>

            <div className="flex items-center gap-8 pt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="h-8 w-auto flex items-center gap-2 font-bold font-display text-xl"><Globe className="h-6 w-6" /> POLYGON</div>
              <div className="h-8 w-auto flex items-center gap-2 font-bold font-display text-xl"><Wallet className="h-6 w-6" /> POLYMARKET</div>
            </div>
          </div>

          {/* Hero Visual - Floating Interface */}
          <div className="relative h-[400px] md:h-[600px] flex items-center justify-center perspective-[2000px] group animate-float mt-12 lg:mt-0">
            {/* Main Card */}
            <div className="relative w-full max-w-[300px] md:max-w-[340px] h-[580px] md:h-[640px] bg-[#050505] rounded-[2.5rem] md:rounded-[3rem] border border-white/10 shadow-2xl transform rotate-y-[-12deg] rotate-x-[5deg] group-hover:rotate-y-0 group-hover:rotate-x-0 transition-transform duration-700 ease-out overflow-hidden z-20 scale-90 md:scale-100 origin-center">

              {/* Scanner Effect */}
              <div className="absolute inset-0 z-50 pointer-events-none opacity-20 bg-gradient-to-b from-transparent via-poly-accent/30 to-transparent h-[20%] w-full animate-scan"></div>

              {/* Screen Content */}
              <div className="absolute inset-0 p-6 flex flex-col bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50 mix-blend-overlay"></div>

              <div className="relative z-10 p-6 flex flex-col h-full font-mono">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-xs text-poly-muted">09:41 AM</div>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full border border-white/20"></div>
                    <div className="w-4 h-4 rounded-full border border-white/20"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Notification */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md animate-[slideIn_0.5s_ease-out_0.2s]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white uppercase">Whale Alert</div>
                        <div className="text-[10px] text-poly-muted">GCR_Whale bought YES</div>
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-32 w-full rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden animate-[slideIn_0.5s_ease-out_0.4s]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">+452%</div>
                        <div className="text-[10px] text-poly-accent uppercase tracking-widest">GCR_Whale PnL</div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-poly-accent/20 to-transparent"></div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto pt-8">
                    <div className="w-full py-4 bg-poly-accent text-black font-bold text-center rounded-xl shadow-[0_0_20px_rgba(0,229,153,0.4)] animate-pulse">
                      COPYING TRADER...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Cards for Depth */}
            <div className="absolute top-20 right-20 w-[300px] h-[500px] bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm transform translate-z-[-50px] rotate-y-[-12deg] rotate-x-[5deg] opacity-60 z-10 transition-transform duration-700 group-hover:rotate-y-[5deg] group-hover:translate-x-10"></div>

            {/* Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-poly-accent/20 blur-[100px] rounded-full -z-10"></div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FLOATING STATS */}
      <div className="max-w-6xl mx-auto w-full px-4 mb-32">
        <div className="glass-panel rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-poly-accent/5 via-transparent to-poly-secondary/5 opacity-50"></div>

          <div className="relative text-center md:text-left md:border-r border-white/10 px-4">
            <div className="text-poly-muted text-xs font-bold uppercase tracking-widest mb-3">Copied Volume</div>
            <div className="text-5xl font-display font-bold text-white mb-2 tracking-tight">$450M+</div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-poly-accent text-sm font-medium">
              <TrendingUp className="h-4 w-4" /> +12.5% this week
            </div>
          </div>
          <div className="relative text-center md:text-left md:border-r border-white/10 px-4">
            <div className="text-poly-muted text-xs font-bold uppercase tracking-widest mb-3">Active Whales</div>
            <div className="text-5xl font-display font-bold text-white mb-2 tracking-tight">1,204</div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-poly-secondary text-sm font-medium">
              <Users className="h-4 w-4" /> Verified PnL
            </div>
          </div>
          <div className="relative text-center md:text-left px-4">
            <div className="text-poly-muted text-xs font-bold uppercase tracking-widest mb-3">Avg ROI</div>
            <div className="text-5xl font-display font-bold text-white mb-2 tracking-tight">34%</div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-white/80 text-sm font-medium">
              <Shield className="h-4 w-4" /> Per Strategy
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: FEATURES GRID */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display">
              Infrastructure for <br />
              <span className="text-poly-muted">Social Trading</span>
            </h2>
            <p className="text-lg text-poly-muted">
              We aggregate on-chain data to identify the most profitable prediction market traders. You just click "Copy".
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
          {/* Tall Card */}
          <div className="md:col-span-1 h-[400px] md:h-full glass-panel rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group hover:border-poly-accent/50 transition-colors">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-poly-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-poly-accent/10 flex items-center justify-center mb-6 text-poly-accent">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Sync</h3>
              <p className="text-poly-muted leading-relaxed">
                When the whale executes, you execute. <br />
                Our bot monitors the mempool for pending transactions from your watched list.
              </p>
            </div>

            <div className="relative h-32 w-full mt-8 opacity-50">
              <div className="absolute inset-0 bg-poly-accent/20 blur-xl rounded-full transform translate-y-10"></div>
              <div className="absolute inset-0 border-t border-dashed border-poly-accent/30"></div>
            </div>
          </div>

          {/* Wide Cards Column */}
          <div className="md:col-span-2 flex flex-col gap-6 h-full">

            {/* Top Wide */}
            <div className="flex-1 glass-panel rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:border-poly-secondary/50 transition-colors">
              <div className="flex-1 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-poly-secondary/10 flex items-center justify-center mb-6 text-poly-secondary">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Your Keys, Your Crypto</h3>
                <p className="text-poly-muted">Non-custodial architecture. The bot signs transactions using your local wallet permissions. We never hold your funds.</p>
              </div>
              <div className="w-full md:w-1/3 aspect-video bg-black/40 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_infinite]"></div>
                <div className="text-xs font-mono text-poly-secondary">SELF_CUSTODY</div>
              </div>
            </div>

            {/* Bottom Split */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden hover:bg-white/5 transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-white mb-2">Leaderboard</h3>
                <p className="text-sm text-poly-muted">Find traders by Win Rate, PnL, and Volume.</p>
                <ArrowUpRight className="absolute top-8 right-8 text-white/20 h-6 w-6" />
              </div>
              <div className="glass-panel rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden hover:bg-white/5 transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-white mb-2">Risk Management</h3>
                <p className="text-sm text-poly-muted">Set max allocation per copy trade.</p>
                <ArrowUpRight className="absolute top-8 right-8 text-white/20 h-6 w-6" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};