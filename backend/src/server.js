// src/server.js
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/connection.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDB();
});
