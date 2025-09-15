import { Server } from "socket.io";
import http from "http";
import redis from "./rediConfig.ts";

let io: Server;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: "*", 
    },
  });

  io.on("connection", async (socket) => {
    console.log("Client connected:", socket.id);

    const cached = await redis.get("aggregated_tokens");
    if (cached) {
      console.log("Sending cached tokens to client");
      socket.emit("tokens_updated", JSON.parse(cached));
    }

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}
