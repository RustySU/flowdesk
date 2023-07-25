// src/exchanges/Kucoin.ts
import axios from 'axios';
import { Trade, Exchange } from './exchange';


export class Kucoin implements Exchange {
  async getTrades(tradingPair: string): Promise<Trade[]> {
    try {
      const response = await axios.get(
        `https://api.kucoin.com/api/v1/market/histories?symbol=${tradingPair}`
      );

      if (!response.data || !Array.isArray(response.data.data)) {
        return [];
      }

      const trades: Trade[] = response.data.data.map((trade: any) => ({
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
}
