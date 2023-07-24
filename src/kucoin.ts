// src/kucoin.ts
import axios from 'axios';

export interface KucoinTrade {
  side: 'buy' | 'sell';
  size: number;
  price: number;
  time: number;
}

export async function getTrades(pair: string): Promise<KucoinTrade[]> {
  try {
    const response = await axios.get(
      `https://api.kucoin.com/api/v1/market/histories?symbol=${pair}`
    );
    const trades: KucoinTrade[] = response.data.data.map((trade: any) => ({
      side: trade.side,
      size: parseFloat(trade.size),
      price: parseFloat(trade.price),
      time: parseInt(trade.time),
    }));
    return trades;
  } catch (error) {
    throw new Error('Failed to fetch trades from Kucoin API');
  }
}
