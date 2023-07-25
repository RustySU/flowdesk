// src/exchanges/Exchange.ts

export interface Trade {
    side: 'buy' | 'sell';
    size: number;
    price: number;
    time: number;
  }

export interface Exchange {
    getTrades: (tradingPair: string) => Promise<Trade[]>;
}

