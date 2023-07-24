// src/app.ts
import express, { Request, Response } from 'express';
import { getTrades, KucoinTrade } from './kucoin';

const app = express();
const port = 3000;

// Endpoint to get the cumulative delta index
app.get('/cumulative-delta/:tradingPair', async (req: Request, res: Response) => {
  try {
    const tradingPair = req.params.tradingPair;
    const trades: KucoinTrade[] = await getTrades(tradingPair);
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