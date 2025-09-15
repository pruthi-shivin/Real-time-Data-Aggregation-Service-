
import axios from "axios";
export async function fetchDexScreener(query: string) {
  const url = `https://api.dexscreener.com/latest/dex/search?q=${query}`;
  try {
    const response = await axios.get(url);
    return response.data.pairs; 
  } catch (err) {
    if(err instanceof Error){
        console.log("DexScreener fetch error:", err.message);
        return [];
    }
  }
}

export async function fetchCoinGeckoSolanaTokens(): Promise<any[]> {
  const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&platform=solana";
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("CoinGecko fetch error:", err.message);
      console.log(err);
    }
    return [];
  }
}

