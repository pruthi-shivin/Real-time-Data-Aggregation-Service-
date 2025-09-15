import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path : path.resolve(__dirname, "../.env")}   );

const redis = new Redis(process.env.REDIS_URL!);

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err: unknown) => {
  if(err instanceof Error){
    console.log("Redis error:", err.message);
  }
});

export default redis;