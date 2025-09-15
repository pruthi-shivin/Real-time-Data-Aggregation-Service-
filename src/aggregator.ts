import {fetchDexScreener} from "./fetchData.ts";
import {fetchCoinGeckoSolanaTokens} from "./fetchData.ts";
import redis from "./rediConfig.ts";

const CACHE_KEY = "aggregated_tokens";
const CACHE_TTL = 30;  

function matchTokens(dsToken: any, cgToken: any) {
  return (
    dsToken.baseToken.symbol.toLowerCase() === cgToken.symbol.toLowerCase() &&
    dsToken.baseToken.name.toLowerCase() === cgToken.name.toLowerCase()
  );
}

export default function aggregateTokenData(dsToken: any, cgToken: any) {
  return {
    name: dsToken.baseToken.name,
    symbol: dsToken.baseToken.symbol,
    volume24h: dsToken.volume?.h24 || cgToken?.total_volume || null,
    high_24h: cgToken?.high_24h || null,
    low_24h: cgToken?.low_24h || null,
    price: dsToken.baseToken.price || cgToken?.current_price || null,
    priceChange24h: dsToken.priceChange?.h24 || cgToken?.price_change_24h || null,
    priceChangePercentage24h: cgToken?.price_change_percentage_24h || null,
    marketCap: dsToken.marketCap || cgToken?.market_cap || null,
    marketCapChange24h: cgToken?.market_cap_change_24h || null,
    marketCapChangePercentage24h: cgToken?.market_cap_change_percentage_24h || null,
    circulatingSupply: cgToken?.circulating_supply || null,
    totalSupply: cgToken?.total_supply || null,
    priceChange1h:  dsToken.priceChange?.h24  || null,
    priceChange6h:  dsToken.priceChange?.h6 ||  null,
    lastUpdated: dsToken.updatedAt || cgToken?.last_updated || null,
    roi: cgToken?.roi || null,
    atl: cgToken?.atl || null,
    atlChangePercentage: cgToken?.atl_change_percentage || null,
    atlDate: cgToken?.atl_date || null,
    ath: cgToken?.ath || null,
    athChangePercentage: cgToken?.ath_change_percentage || null,
    athDate: cgToken?.ath_date || null,
    dex: dsToken.dexId,
    image: dsToken.info?.imageUrl || cgToken?.image,
    dexUrl: dsToken.url,
    rank: cgToken?.market_cap_rank || null,
  };
}

export async function aggregateTokens() {
  const cachedData = await redis.get(CACHE_KEY);
  if(cachedData){
    console.log("cache hit");
    return JSON.parse(cachedData);
  }
  const [dsPairs, cgTokens] = await Promise.all([
    fetchDexScreener("solana"),
    fetchCoinGeckoSolanaTokens(),
  ]);

  const aggregated = [];

  for (const dsToken of dsPairs) {
    if(!dsToken || !dsToken?.baseToken || !dsToken?.baseToken?.name){
      console.log("Skipping invalid DexScreener token:", dsToken);
      continue;
    }
    const match = cgTokens.find((cgToken) => matchTokens(dsToken, cgToken));
    aggregated.push(aggregateTokenData(dsToken, match));
  }

  console.log("setting cache in redis");
  await redis.set(CACHE_KEY, JSON.stringify(aggregated), 'EX', CACHE_TTL);

  return aggregated;
}
