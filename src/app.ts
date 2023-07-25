// src/app.ts
import express, { Request, Response } from 'express';
import { ExchangeType, ExchangeFactory } from './exchangeFactory';
import { Exchange, Trade } from './exchange';

const app = express();
const port = 3000;

const exchangeFactory = new ExchangeFactory();

// Endpoint to get the cumulative delta index for a specific trading pair and exchange
app.get('/cumulative-delta/:exchange/:tradingPair', async (req: Request, res: Response) => {
  try {
    const { exchange, tradingPair } = req.params;

    // Create the appropriate exchange instance using the factory
    const exchangeInstance: Exchange = exchangeFactory.createExchange(exchange as ExchangeType);

    const trades: Trade[] = await exchangeInstance.getTrades(tradingPair);
    // Calculate cumulative delta based on the trades
    let cumulativeDelta = 0;
    trades.forEach((trade) => {
      if (trade.side === 'buy') {
        cumulativeDelta += trade.size;
      } else {
        cumulativeDelta -= trade.size;
      }
    });

    res.json({ tradingPair, cumulativeDelta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
