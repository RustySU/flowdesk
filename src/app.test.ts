// src/app.test.ts
import request from 'supertest';
import app from './app';
import * as kucoin from './kucoin';

describe('Cumulative Delta API', () => {
  it('should calculate the cumulative delta for a specific trading pair', async () => {
    const tradingPair = 'BTC-USDT';
    const response = await request(app).get(`/cumulative-delta/${tradingPair}`);
    expect(response.body.tradingPair).toBe(tradingPair);
    expect(response.body.cumulativeDelta).toBeDefined();
  });

  it('should return [] if an invalid trading pair is provided', async () => {
    const invalidTradingPair = 'INVALID-PAIR';
    const response = await request(app).get(`/cumulative-delta/${invalidTradingPair}`);
    expect(response.body.cumulativeDelta).toBe(0)
  });

  it('should calculate the cumulative delta for a specific trading pair', async () => {
    const mockKucoinTrades: kucoin.KucoinTrade[] = [
        // Sample trade data with known values
        { side: 'buy', size: 2, price: 100, time: 1630000000000 }, // Cumulative delta: +2
        { side: 'sell', size: 5, price: 110, time: 1630001000000 }, // Cumulative delta: -3
        { side: 'buy', size: 3, price: 105, time: 1630002000000 }, // Cumulative delta: 0
      ];
      
      // Mock the getTrades function before running the tests
    jest.spyOn(kucoin, 'getTrades').mockResolvedValue(mockKucoinTrades);
      
    const tradingPair = 'BTC-USDT';

    const response = await request(app).get(`/cumulative-delta/${tradingPair}`);
    expect(response.status).toBe(200);
    expect(response.body.tradingPair).toBe(tradingPair);

    // Manually calculate the expected cumulative delta
    let expectedCumulativeDelta = 0;
    for (const trade of mockKucoinTrades) {
      if (trade.side === 'buy') {
        expectedCumulativeDelta += trade.size;
      } else {
        expectedCumulativeDelta -= trade.size;
      }
    }

    // Compare the result from the API to the manually calculated value
    expect(response.body.cumulativeDelta).toBe(expectedCumulativeDelta);
    jest.restoreAllMocks();
  });

  it('should return 500 with error message for network/API error', async () => {
    // Mocking the getTrades function to throw an error
    jest.spyOn(kucoin, 'getTrades').mockImplementation(() => {
        throw new Error('Mocked API error');
    });

    const tradingPair = 'BTC-USDT';
    const response = await request(app).get(`/cumulative-delta/${tradingPair}`);
    console.log(response.body)
    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();

    // Restore the original implementation after the test
    jest.restoreAllMocks();
  });
});
