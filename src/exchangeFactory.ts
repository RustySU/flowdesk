// src/exchanges/ExchangeFactory.ts
import { Exchange } from './exchange';
import { Kucoin } from './kucoin';
// Import other exchange implementations here if needed

export enum ExchangeType {
  KUCOIN = 'kucoin',
  // Add more exchange types here if needed
}

export class ExchangeFactory {
  createExchange(type: ExchangeType): Exchange {
    switch (type) {
      case ExchangeType.KUCOIN:
        return new Kucoin();
      // Add cases for other exchange types here if needed
      default:
        throw new Error('Invalid exchange type');
    }
  }
}
