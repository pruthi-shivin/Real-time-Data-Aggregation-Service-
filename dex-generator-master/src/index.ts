import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { initSocket } from "./socketserver.ts";
import tokensRoute from "./routes/tokens.ts";
import startScheduler from "./startScheduler.ts";

let __filename: string;
let __dirname: string;

if (typeof process.env.JEST_WORKER_ID === "undefined") {
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
} else {
  __filename = "";
  __dirname = "";
  dotenv.config();
}

const app = express();
const server = http.createServer(app);

(async () => {
  try {
    await initSocket(server);
    console.log("Socket.IO initialized");
    startScheduler(); 
  } catch (err) {
    console.error("Error initializing Socket.IO:", err);
  }
})();

app.use(express.json());
app.use("/api", tokensRoute);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
