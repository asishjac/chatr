import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chatr.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (userId) => {
  // We'll manage this via our ConnectionRepository in DynamoDB for true persistence,
  // but for local Socket.io we can also track it in memory for performance.
  return userSocketMap[userId];
};

// used to store online users in-memory for Socket.io mode
const userSocketMap = {}; 

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`Socket connected: ${userId} (${socket.id})`);
  }

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log(`Socket disconnected: ${userId}`);
  });
});

export { io, app, server };
