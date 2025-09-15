import cron from "node-cron";
import { aggregateTokens } from "./aggregator.ts";
import redis from "./rediConfig.ts";
import { getIO } from "./socketserver.ts";

export default function startScheduler() {
  console.log("Refreshing aggregated tokens every 30 minutes");

  cron.schedule("*/30 * * * *", async () => {
    console.log("Scheduler running...");

    try {
      const tokens = await aggregateTokens(); 
      await redis.set("aggregated_tokens", JSON.stringify(tokens));
      console.log("Tokens cached in Redis");

      const io = getIO();
      io.emit("tokens_updated", tokens);
      console.log("Tokens sent to all clients");
    } catch (err) {
      console.error("Scheduler error:", err);
    }
  });
}
