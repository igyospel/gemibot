import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, Pause, TrendingUp, Users, Clock, Activity, DollarSign, BrainCircuit, Bot, Zap, Globe, Lock, UserPlus, UserCheck, Star, Settings, Plus, X } from 'lucide-react';
import { MOCK_MARKETS, MOCK_CHART_DATA, MOCK_TRADERS } from '../constants';
import { Market, TradeLog, PortfolioPosition, TraderProfile } from '../types';
import { analyzeMarketWithGemini } from '../services/geminiService';

interface DashboardProps {
  walletKey: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ walletKey }) => {
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [balance, setBalance] = useState(1250.00);
  const [tradeLogs, setTradeLogs] = useState<TradeLog[]>([]);
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [analyzingMarketId, setAnalyzingMarketId] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState('0.00');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const [followedTraders, setFollowedTraders] = useState<string[]>(['t1']); // Default following GCR_Whale
  const [riskPerTrade, setRiskPerTrade] = useState(5); // Default $5 per trade
  const [traders, setTraders] = useState<TraderProfile[]>(MOCK_TRADERS);
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletAddress, setNewWalletAddress] = useState('');


  const POLYGON_RPC = "https://polygon-rpc.com";
  const USDC_BRIDGED_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // PoS USDC
  const USDC_NATIVE_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";  // Native USDC
  const USDC_ABI = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];

  // Fetch Live Balance
  useEffect(() => {
    const fetchLiveBalances = async () => {
      if (!walletKey) return;
      setIsLoadingBalance(true);

      try {
        const provider = new ethers.JsonRpcProvider(POLYGON_RPC);
        let address = '';

        // Try to see if walletKey is a private key or an address
        if (ethers.isAddress(walletKey)) {
          address = walletKey;
        } else if (walletKey.length === 64 || (walletKey.startsWith('0x') && walletKey.length === 66)) {
          try {
            const wallet = new ethers.Wallet(walletKey);
            address = wallet.address;
          } catch (e) {
            console.error("Not a valid private key");
          }
        }

        if (address) {
          // Fetch MATIC
          const maticBal = await provider.getBalance(address);
          setBalance(parseFloat(ethers.formatEther(maticBal)));

          // Fetch USDC (Both Bridged and Native to be safe)
          const usdcBridgedContract = new ethers.Contract(USDC_BRIDGED_ADDRESS, USDC_ABI, provider);
          const usdcNativeContract = new ethers.Contract(USDC_NATIVE_ADDRESS, USDC_ABI, provider);

          const [bridgedBal, nativeBal, bridgedDecimals, nativeDecimals] = await Promise.all([
            usdcBridgedContract.balanceOf(address).catch(() => BigInt(0)),
            usdcNativeContract.balanceOf(address).catch(() => BigInt(0)),
            usdcBridgedContract.decimals().catch(() => 6),
            usdcNativeContract.decimals().catch(() => 6)
          ]);

          const bridgedFormatted = parseFloat(ethers.formatUnits(bridgedBal, bridgedDecimals));
          const nativeFormatted = parseFloat(ethers.formatUnits(nativeBal, nativeDecimals));

          // Total USDC
          setUsdcBalance((bridgedFormatted + nativeFormatted).toFixed(2));
        }
      } catch (error) {
        console.error("Failed to fetch live balance:", error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchLiveBalances();
    const interval = setInterval(fetchLiveBalances, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [walletKey]);

  // Refs for scrolling logs
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tradeLogs]);

  // Bot Logic Loop (Copy Trading Simulation)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isBotRunning) {
      interval = setInterval(async () => {
        // 1. Pick a random followed trader who "makes a move"
        if (followedTraders.length === 0) return;

        const randomTraderId = followedTraders[Math.floor(Math.random() * followedTraders.length)];
        const trader = traders.find(t => t.id === randomTraderId);
        if (!trader) return;

        // 2. Pick a random market they traded on
        const market = MOCK_MARKETS[Math.floor(Math.random() * MOCK_MARKETS.length)];
        setAnalyzingMarketId(market.id);

        // 3. Analyze whether we should copy (Gemini Check)
        const analysis = await analyzeMarketWithGemini(market, trader);

        // 4. Create log entry
        const newLog: TradeLog = {
          id: Date.now().toString(),
          timestamp: new Date(),
          marketId: market.id,
          marketQuestion: market.question,
          action: analysis.decision as any,
          copiedTrader: trader.name,
          amount: riskPerTrade,
          price: analysis.decision.includes('YES') ? market.oddsYes : market.oddsNo,
          status: 'EXECUTED',
          reasoning: analysis.reasoning
        };

        // Update logs
        setTradeLogs(prev => [...prev, newLog]);
        setAnalyzingMarketId(null);

        // Simulate balance update if trade happened
        if (analysis.decision !== 'HOLD') {
          setBalance(prev => prev - riskPerTrade);

          // Update positions (simplified logic)
          setPositions(prev => {
            const existing = prev.find(p => p.marketId === market.id);
            if (existing) {
              return prev.map(p => p.marketId === market.id ? { ...p, shares: p.shares + (riskPerTrade / newLog.price), currentValue: (p.shares * newLog.price) + riskPerTrade } : p);
            } else {
              return [...prev, {
                marketId: market.id,
                question: market.question,
                outcome: analysis.decision.includes('YES') ? 'YES' : 'NO',
                shares: riskPerTrade / newLog.price,
                avgPrice: newLog.price,
                currentValue: riskPerTrade,
                pnl: 0,
                copiedFrom: trader.name
              }];
            }
          });
        }

      }, 5000); // Run check every 5 seconds
    }

    return () => clearInterval(interval);
  }, [isBotRunning, followedTraders]);

  const toggleFollow = (id: string) => {
    setFollowedTraders(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleAddWallet = () => {
    if (!newWalletName || !newWalletAddress) return;

    const newTrader: TraderProfile = {
      id: `custom-${Date.now()}`,
      name: newWalletName,
      address: newWalletAddress,
      pnl: 0,
      winRate: 0,
      volume: '$0',
      followers: 0,
      tags: ['NEW'],
      isHot: false
    };

    setTraders(prev => [newTrader, ...prev]);
    setNewWalletName('');
    setNewWalletAddress('');
    setIsAddingWallet(false);

    // Auto follow
    setFollowedTraders(prev => [...prev, newTrader.id]);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-end pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Copy Center</h1>
          <p className="text-sm text-poly-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-poly-accent animate-pulse"></span>
            Monitoring Mempool • {followedTraders.length} Whales Active
          </p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-poly-muted uppercase font-bold">MATIC Balance</div>
              <div className="text-lg font-mono font-bold text-white">
                {isLoadingBalance ? '...' : balance.toFixed(4)}
              </div>
            </div>
            <div className="p-2 bg-poly-accent/10 rounded text-poly-accent"><Activity className="h-5 w-5" /></div>
          </div>
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-poly-muted uppercase font-bold font-mono text-poly-secondary">USDC (Live)</div>
              <div className="text-lg font-mono font-bold text-white">
                ${isLoadingBalance ? '...' : parseFloat(usdcBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="p-2 bg-poly-secondary/10 rounded text-poly-secondary"><DollarSign className="h-5 w-5" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Column - Main Controls & Chart */}
        <div className="lg:col-span-3 space-y-6">

          {/* Status & Control Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* ADVANCED BOT CONTROL BUTTON */}
            <div className="md:col-span-2 glass-panel rounded-2xl p-1 flex items-center gap-4 relative overflow-hidden group">
              {/* Background active pulse */}
              <div className={`absolute inset-0 bg-gradient-to-r from-poly-accent/20 via-transparent to-transparent transition-opacity duration-500 ${isBotRunning ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>

              <button
                onClick={() => setIsBotRunning(!isBotRunning)}
                disabled={followedTraders.length === 0}
                className={`relative z-10 flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 border border-transparent ${isBotRunning
                  ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-poly-accent/50 hover:shadow-[0_0_30px_rgba(0,229,153,0.1)]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isBotRunning ? (
                  <>
                    <div className="relative">
                      <span className="absolute -inset-2 rounded-full bg-red-500 opacity-20 animate-ping"></span>
                      <Pause className="h-5 w-5 fill-current" />
                    </div>
                    PAUSE COPYING
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 fill-current" />
                    START COPY TRADING
                  </>
                )}
              </button>
            </div>

            {/* Risk Management */}
            <div className="glass-panel rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden group hover:bg-white/5 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-poly-muted uppercase font-bold flex items-center gap-2">
                  <Settings className="h-3 w-3" /> Risk / Trade
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-poly-accent font-mono">$</span>
                <input
                  type="number"
                  value={riskPerTrade}
                  onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                  className="bg-transparent text-2xl font-mono font-bold text-white w-full focus:outline-none border-b border-dashed border-white/20 focus:border-poly-accent/50 transition-colors"
                />
              </div>
            </div>

            {/* Small Stat */}
            <div className="glass-panel rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden group hover:bg-white/5 transition-colors cursor-default">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500"><Zap className="h-12 w-12" /></div>
              <span className="text-xs text-poly-muted uppercase font-bold mb-1">Mirror ROI</span>
              <span className="text-2xl font-mono font-bold text-poly-accent drop-shadow-[0_0_10px_rgba(0,229,153,0.3)]">34.2%</span>
            </div>
          </div>

          {/* TRADER LEADERBOARD (Replaces generic chart focus) */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-poly-secondary" />
                Top Whales to Copy
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddingWallet(!isAddingWallet)}
                  className="text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10 flex items-center gap-1 transition-colors text-white border border-white/5 hover:border-white/20"
                >
                  <Plus className="h-3 w-3" /> Add Wallet
                </button>
                <button className="text-xs text-poly-muted hover:text-white transition-colors">View All ({traders.length}k)</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isAddingWallet && (
                <div className="col-span-1 md:col-span-2 p-4 rounded-xl border border-poly-accent/30 bg-poly-accent/5 animate-[fadeIn_0.2s_ease-out]">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-white text-sm">Add New Wallet to Watch</h4>
                    <button onClick={() => setIsAddingWallet(false)} className="text-poly-muted hover:text-white"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Wallet Name (e.g. Alpha Wolf)"
                      className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-poly-accent focus:outline-none"
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Wallet Address (0x...)"
                      className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-poly-accent focus:outline-none font-mono"
                      value={newWalletAddress}
                      onChange={(e) => setNewWalletAddress(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleAddWallet}
                    disabled={!newWalletName || !newWalletAddress}
                    className="w-full py-2 bg-poly-accent text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Create & Follow Wallet
                  </button>
                </div>
              )}

              {traders.map((trader) => {
                const isFollowing = followedTraders.includes(trader.id);
                return (
                  <div key={trader.id} className={`group p-4 rounded-xl border transition-all duration-300 ${isFollowing ? 'bg-poly-accent/10 border-poly-accent/30 shadow-[0_0_20px_rgba(0,229,153,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-white overflow-hidden ${trader.isHot ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'}`}>
                          <span className="relative z-10">{trader.name.substring(0, 2).toUpperCase()}</span>
                          {/* Inner shimmer for avatar */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-y-full group-hover:animate-shimmer-slide"></div>
                        </div>
                        <div>
                          <h4 className="font-bold text-white flex items-center gap-2">
                            {trader.name}
                            {trader.isHot && <span className="text-[10px] bg-red-500 text-white px-1.5 rounded animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">HOT</span>}
                          </h4>
                          <div className="text-xs text-poly-muted font-mono">{trader.address}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(trader.id)}
                        className={`p-2 rounded-lg transition-all duration-300 transform active:scale-95 ${isFollowing ? 'bg-poly-accent text-black hover:bg-emerald-400' : 'bg-white/10 text-white hover:bg-white/20 hover:text-poly-accent'}`}
                      >
                        {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                      <div>
                        <div className="text-[10px] text-poly-muted uppercase">PnL</div>
                        <div className="text-sm font-bold text-emerald-400">+{trader.pnl}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-poly-muted uppercase">Win Rate</div>
                        <div className="text-sm font-bold text-white">{trader.winRate}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-poly-muted uppercase">Volume</div>
                        <div className="text-sm font-bold text-white">{trader.volume}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Positions Table */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-poly-secondary" />
                <h3 className="font-bold text-white">Active Mirrored Positions</h3>
              </div>
              <span className="text-xs px-2 py-1 bg-poly-accent/10 text-poly-accent rounded border border-poly-accent/20">
                {positions.length} OPEN
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/40 text-poly-muted uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Copied From</th>
                    <th className="px-6 py-4">Market</th>
                    <th className="px-6 py-4">Side</th>
                    <th className="px-6 py-4 text-right">Shares</th>
                    <th className="px-6 py-4 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {positions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-poly-muted">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Lock className="h-5 w-5 opacity-30" />
                          </div>
                          <p>No active positions. Follow traders to start copying.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    positions.map((pos, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 font-bold text-poly-secondary">
                            <div className="w-2 h-2 bg-poly-secondary rounded-full"></div>
                            {pos.copiedFrom}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium max-w-[200px] truncate text-white">
                          {pos.question}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${pos.outcome === 'YES' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            {pos.outcome}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-poly-muted font-mono text-right">{Math.floor(pos.shares)}</td>
                        <td className="px-6 py-4 font-mono text-white text-right font-bold">${pos.currentValue.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column - Terminal/Logs */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-3xl h-[800px] flex flex-col border border-white/10 overflow-hidden relative">
            {/* Header */}
            <div className="p-4 bg-black/60 border-b border-white/10 flex justify-between items-center backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-poly-accent" />
                <span className="text-sm font-bold text-white tracking-wide">AI MONITOR</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs custom-scrollbar bg-black/40">
              {tradeLogs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-poly-muted opacity-30 text-center p-4">
                  <Bot className="h-12 w-12 mb-4" />
                  <p>COPY ENGINE ONLINE</p>
                  <p>WAITING FOR WHALE ACTIVITY...</p>
                </div>
              )}

              {tradeLogs.map((log) => (
                <div key={log.id} className="relative pl-4 animate-[slideIn_0.2s_ease-out]">
                  {/* Timeline Line */}
                  <div className="absolute left-0 top-2 bottom-[-16px] w-[1px] bg-white/10"></div>
                  <div className="absolute left-[-2px] top-2 w-[5px] h-[5px] rounded-full bg-poly-accent"></div>

                  <div className="text-[10px] text-poly-muted mb-1">{log.timestamp.toLocaleTimeString()}</div>
                  <div className="p-3 rounded-r-lg rounded-bl-lg bg-white/5 border border-white/5 hover:border-poly-accent/30 transition-colors">
                    <div className="flex justify-between items-start mb-2 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-white font-bold">{log.copiedTrader}</span>
                      </div>
                      <span className={`font-bold ${log.action.includes('BUY') ? 'text-emerald-400' : 'text-red-400'}`}>
                        {log.action.replace('COPY_', '')}
                      </span>
                    </div>
                    <div className="text-poly-muted mb-2 line-clamp-2 leading-relaxed">
                      {log.marketQuestion}
                    </div>
                    <div className="text-[10px] text-poly-secondary border-t border-white/5 pt-2 mt-2">
                      &gt; {log.reasoning}
                    </div>
                  </div>
                </div>
              ))}

              {analyzingMarketId && (
                <div className="pl-4 animate-pulse opacity-70">
                  <div className="text-[10px] text-poly-accent mb-1 flex items-center gap-2">
                    <Clock className="h-3 w-3 animate-spin" /> ANALYZING WHALE MOVE
                  </div>
                  <div className="p-3 rounded bg-white/5 border border-dashed border-white/10">
                    <div className="h-2 bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};