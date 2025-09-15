import redis from "./rediConfig.ts"; 

async function checkTokens() {
  const cached = await redis.get("aggregated_tokens");
  if (cached) {
    console.log("Tokens in Redis:", JSON.parse(cached));
  } else {
    console.log("No tokens found in Redis yet.");
  }
  process.exit(0);
}

checkTokens();
