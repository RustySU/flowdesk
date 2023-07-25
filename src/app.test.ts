// src/app.test.ts
import request from 'supertest';
import app from './app';
import {Kucoin} from './kucoin';
import {Trade} from './exchange';
import { ExchangeFactory } from './exchangeFactory';

describe('Cumulative Delta API', () => {
  it('should calculate the cumulative delta for a specific trading pair', async () => {
    const tradingPair = 'BTC-USDT';
    const response = await request(app).get(`/cumulative-delta/kucoin/${tradingPair}`);
    expect(response.body.tradingPair).toBe(tradingPair);
    expect(response.body.cumulativeDelta).toBeDefined();
  });

  it('should return [] if an invalid trading pair is provided', async () => {
    const invalidTradingPair = 'INVALID-PAIR';
    const response = await request(app).get(`/cumulative-delta/kucoin/${invalidTradingPair}`);
    expect(response.body.cumulativeDelta).toBe(0)
  });

  it('should calculate the cumulative delta for a specific trading pair', async () => {
    const mockKucoinTrades: Trade[] = [
        // Sample trade data with known values
        { side: 'buy', size: 2, price: 100, time: 1630000000000 }, // Cumulative delta: +2
        { side: 'sell', size: 5, price: 110, time: 1630001000000 }, // Cumulative delta: -3
        { side: 'buy', size: 3, price: 105, time: 1630002000000 }, // Cumulative delta: 0
    ];
      
    // Mock the getTrades function before running the tests
    const kucoinExchange = new Kucoin();
    // Spy on the createExchange method of ExchangeFactory
    const mockCreateExchange = jest.spyOn(ExchangeFactory.prototype, 'createExchange');
    mockCreateExchange.mockReturnValue(kucoinExchange);

    // Spy on the getTrades method of the kucoinExchange and mock the resolved value
    const mockGetTrades = jest.spyOn(kucoinExchange, 'getTrades');
    mockGetTrades.mockResolvedValue(mockKucoinTrades);
      
    const tradingPair = 'BTC-USDT';

    // Manually calculate the expected cumulative delta
    let expectedCumulativeDelta = 0;
    for (const trade of mockKucoinTrades) {
      if (trade.side === 'buy') {
        expectedCumulativeDelta += trade.size;
      } else {
        expectedCumulativeDelta -= trade.size;
      }
    }

    const response = await request(app).get(`/cumulative-delta/kucoin/${tradingPair}`);
    expect(response.status).toBe(200);
    expect(response.body.tradingPair).toBe(tradingPair);
    // Compare the result from the API to the manually calculated value
    expect(response.body.cumulativeDelta).toBe(expectedCumulativeDelta);

    // Restore the original implementations after the test
    jest.restoreAllMocks();
  });

 it('should return 500 with error message for network/API error', async () => {
    // Create a real instance of the Kucoin exchange
    const kucoinExchange = new Kucoin();

    // Spy on the createExchange method of ExchangeFactory to return the real Kucoin exchange
    const mockCreateExchange = jest.spyOn(ExchangeFactory.prototype, 'createExchange');
    mockCreateExchange.mockReturnValue(kucoinExchange);

    // Spy on the getTrades method of the Kucoin exchange to throw an error
    const mockGetTrades = jest.spyOn(kucoinExchange, 'getTrades');
    mockGetTrades.mockImplementation(() => {
      throw new Error('Mocked API error');
    });

    const tradingPair = 'BTC-USDT';
    const response = await request(app).get(`/cumulative-delta/kucoin/${tradingPair}`);
    console.log(response.body)
    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();

    // Restore the original implementation after the test
    jest.restoreAllMocks();
  });
});
