# flowdesk

Using the Express framework to create the api application.

## Start the project
```
npm run build
npm run serve
```
Or
```
npx nodemon src/app.ts
```
Or run the test suites
```
npx jest src/app.test.ts
```

## API

```
GET /cumulative-delta/:exchange/:tradingPair

ex:
GET http://localhost:3000/cumulative-delta/kucoin/BTC-USDT
```

## Implement Factory design for adding new exchange in the future
Exchange is created as an interface. Kucoin implements the exchange interface. ExchangeFactory decides which exchange should be used.
By this way, we add new exchange mode easily in the future.