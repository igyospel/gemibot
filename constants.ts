import { Market, TraderProfile } from './types';

export const MOCK_TRADERS: TraderProfile[] = [
  {
    id: 't1',
    name: "GCR_Whale",
    address: "0x7a...99B2",
    pnl: 452.5,
    winRate: 88,
    volume: "$12.4M",
    followers: 1240,
    tags: ["Crypto", "Macro"],
    isHot: true
  },
  {
    id: 't2',
    name: "Polymarket_God",
    address: "0x3b...a12C",
    pnl: 124.0,
    winRate: 72,
    volume: "$4.1M",
    followers: 850,
    tags: ["Politics", "Election"],
    isHot: false
  },
  {
    id: 't3',
    name: "Vitalik_Watcher",
    address: "0xd8...44F1",
    pnl: 310.2,
    winRate: 65,
    volume: "$8.9M",
    followers: 2100,
    tags: ["Tech", "Crypto"],
    isHot: true
  },
  {
    id: 't4',
    name: "Election_Sniper",
    address: "0x1a...9988",
    pnl: 89.4,
    winRate: 91,
    volume: "$2.2M",
    followers: 430,
    tags: ["Politics"],
    isHot: false
  }
];

export const MOCK_MARKETS: Market[] = [
  {
    id: 'm1',
    question: "Who will win the 2024 US Presidential Election?",
    volume: "$452M",
    endDate: "Nov 5, 2024",
    category: 'POLITICS',
    oddsYes: 0.52,
    oddsNo: 0.48,
    image: "https://picsum.photos/400/200?random=1"
  },
  {
    id: 'm2',
    question: "Bitcoin to hit $100k before 2025?",
    volume: "$125M",
    endDate: "Dec 31, 2024",
    category: 'CRYPTO',
    oddsYes: 0.35,
    oddsNo: 0.65,
    image: "https://picsum.photos/400/200?random=2"
  },
  {
    id: 'm3',
    question: "Will Fed cut rates in September?",
    volume: "$89M",
    endDate: "Sep 30, 2024",
    category: 'BUSINESS',
    oddsYes: 0.75,
    oddsNo: 0.25,
    image: "https://picsum.photos/400/200?random=3"
  },
  {
    id: 'm4',
    question: "Real Madrid to win Champions League 24/25?",
    volume: "$42M",
    endDate: "May 31, 2025",
    category: 'SPORTS',
    oddsYes: 0.28,
    oddsNo: 0.72,
    image: "https://picsum.photos/400/200?random=4"
  },
  {
    id: 'm5',
    question: "Will TikTok be banned in US by EOY?",
    volume: "$67M",
    endDate: "Dec 31, 2024",
    category: 'POLITICS',
    oddsYes: 0.41,
    oddsNo: 0.59,
    image: "https://picsum.photos/400/200?random=5"
  },
  {
    id: 'm6',
    question: "Ethereum ETF approval in Q3?",
    volume: "$230M",
    endDate: "Sep 30, 2024",
    category: 'CRYPTO',
    oddsYes: 0.88,
    oddsNo: 0.12,
    image: "https://picsum.photos/400/200?random=6"
  }
];

export const MOCK_CHART_DATA = [
  { name: '00:00', value: 1000 },
  { name: '04:00', value: 1050 },
  { name: '08:00', value: 1020 },
  { name: '12:00', value: 1150 },
  { name: '16:00', value: 1280 },
  { name: '20:00', value: 1400 },
  { name: '24:00', value: 1380 },
];