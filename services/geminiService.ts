import { GoogleGenAI, Type } from "@google/genai";
import { Market, TraderProfile } from "../types";

// Helper to get simulated analysis if no API key is present or for faster demos
const SIMULATED_ANALYSIS = [
  { decision: 'COPY_BUY_YES', reasoning: "Whale wallet accumulation detected. High confidence follow." },
  { decision: 'COPY_BUY_NO', reasoning: "Contrarian signal: Top trader selling into strength. Mirroring short." },
  { decision: 'COPY_SELL_YES', reasoning: "Trader taking profit after 20% gain. Executing exit." },
  { decision: 'COPY_BUY_YES', reasoning: "Insider wallet active on this market. Following flow." },
];

export const analyzeMarketWithGemini = async (market: Market, trader?: TraderProfile): Promise<{ decision: string; reasoning: string; amount: number }> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    const random = SIMULATED_ANALYSIS[Math.floor(Math.random() * SIMULATED_ANALYSIS.length)];
    return {
      decision: random.decision,
      reasoning: `(Simulated) ${random.reasoning}`,
      amount: Math.floor(Math.random() * 50) + 10
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Context: We are a bot deciding whether to copy a specific trader's move
    const traderName = trader ? trader.name : "Unknown Whale";
    const traderWinRate = trader ? trader.winRate : "Unknown";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Copy Trading AI. A top trader named "${traderName}" (Win Rate: ${traderWinRate}%) just made a move on this market.
      
      Market: "${market.question}"
      Current Odds for YES: ${market.oddsYes}
      
      Should we COPY this trade? 
      
      Decide: COPY_BUY_YES, COPY_BUY_NO, COPY_SELL_YES, or COPY_SELL_NO.
      Reasoning: Explain why we are mirroring this specific trader (max 10 words).
      Amount: Suggest trade size ($10-$100).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            decision: { type: Type.STRING, enum: ["COPY_BUY_YES", "COPY_BUY_NO", "COPY_SELL_YES", "COPY_SELL_NO"] },
            reasoning: { type: Type.STRING },
            amount: { type: Type.NUMBER },
          },
          required: ["decision", "reasoning", "amount"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      decision: result.decision || "HOLD",
      reasoning: result.reasoning || "Insufficient data.",
      amount: result.amount || 0
    };

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    const random = SIMULATED_ANALYSIS[Math.floor(Math.random() * SIMULATED_ANALYSIS.length)];
    return {
      decision: random.decision,
      reasoning: "Fallback: Analysis service temporarily unavailable.",
      amount: 25
    };
  }
};