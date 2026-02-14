export interface Market {
  id: string;
  question: string;
  volume: string;
  endDate: string;
  category: 'POLITICS' | 'CRYPTO' | 'SPORTS' | 'BUSINESS';
  oddsYes: number;
  oddsNo: number;
  image: string;
}

export interface TraderProfile {
  id: string;
  name: string;
  address: string;
  pnl: number;
  winRate: number;
  volume: string;
  followers: number;
  tags: string[];
  isHot: boolean;
}

export interface TradeLog {
  id: string;
  timestamp: Date;
  marketId: string;
  marketQuestion: string;
  action: 'COPY_BUY_YES' | 'COPY_BUY_NO' | 'COPY_SELL_YES' | 'COPY_SELL_NO';
  copiedTrader?: string; // Name of the trader we copied
  amount: number;
  price: number;
  status: 'PENDING' | 'EXECUTED' | 'FAILED';
  reasoning: string;
}

export interface PortfolioPosition {
  marketId: string;
  question: string;
  outcome: 'YES' | 'NO';
  shares: number;
  avgPrice: number;
  currentValue: number;
  pnl: number;
  copiedFrom: string;
}