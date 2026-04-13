import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { ENV } from "./lib/env.js";
import { ConnectionRepository } from "./repositories/ConnectionRepository.js";
import { WebSocketService } from "./services/WebSocketService.js";
import { app, server, io } from "./lib/socket.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const port = ENV.PORT || 3000;
const __dirname = path.resolve();

// 1. Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: ENV.NODE_ENV === "production" ? undefined : false, // Disable CSP in dev for local testing if needed
}));

// 2. Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});

// Apply rate limiter to all API routes
app.use("/api", limiter);

app.use(express.json({ limit: "5mb" })); // Reduced from 10mb for better protection
app.use(cookieParser());
app.use(cors({
  origin: ENV.CLIENT_URL || "https://chatr.local",
  credentials: true
}));

// 3. Health Check (Crucial for Orchestration)
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

/**
 * AWS API Gateway WebSocket Webhooks (Prod Mode)
 */
app.post("/ws/connect", async (req, res) => {
  const { connectionId, userId } = req.body;
  if (connectionId && userId) {
    console.log(`User connected via API Gateway: ${userId} (Conn: ${connectionId})`);
    await ConnectionRepository.save(userId, connectionId);
    
    // Broadcast online users update
    const onlineUsers = await ConnectionRepository.getAllOnlineUsers();
    await WebSocketService.broadcast("getOnlineUsers", onlineUsers);
  }
  res.status(200).send("Connected");
});

app.post("/ws/disconnect", async (req, res) => {
  const { connectionId } = req.body;
  if (connectionId) {
    console.log(`User disconnected via API Gateway: ${connectionId}`);
    await ConnectionRepository.remove(connectionId);
    
    // Broadcast online users update
    const onlineUsers = await ConnectionRepository.getAllOnlineUsers();
    await WebSocketService.broadcast("getOnlineUsers", onlineUsers);
  }
  res.status(200).send("Disconnected");
});

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

// 4. Centralized Error Handling (Must be last)
app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`[Prod-Hardened] Server is running at http://localhost:${port}`);
  console.log("Hybrid WebSocket Layer: Active (Socket.io + AWS Support)");
});