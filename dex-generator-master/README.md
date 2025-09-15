# 🧠 Dex Generator – Real-Time Solana Token Aggregator

This project aggregates real-time Solana token data from **DexScreener** and **CoinGecko**, caches it with Redis, and provides a REST API endpoint for clients to access token metadata with support for **filtering**, **sorting**, **pagination**, and **WebSocket-based live updates**.

---

## 🔧 Features

- 🔄 Aggregates tokens from DexScreener and CoinGecko
- 🧠 Smart matching of tokens across APIs
- 📊 Real-time live price updates via WebSockets
- ⚡️ Redis caching with 30s TTL for performance
- 🔎 Filtering by timeframes (1h, 6h, 24h)
- ↕️ Sorting by price, market cap, and volume
- ➡️ Cursor-based pagination
- 🧪 Rate-limited `/api/tokens` endpoint
- 🚀 Deployed on Render for public access

---

## 🛠️ How to Run Locally

### 1. Clone this repo

### git clone https://github.com/Shubh-234/dex-generator.git

### 2. go in the folder cd dex-generator

### 3. npm install

### 4. Create an env file
### PORT=3000
### REDIS_URL=redis://localhost:6379

### 5. Start the server using command npx tsx src/index.ts### Live render project (data fetched): https://dex-generator.onrender.com/api/tokens

## Live render project (data fetched): https://dex-generator.onrender.com/api/tokens




