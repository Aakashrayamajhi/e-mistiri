import "dotenv/config";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";

import app from "./app.js";
import dbconnection from "./database/connection.js";

import { createTopic } from "./kafka/admin.js";
import { connectProducer, sendToKafka } from "./kafka/producer.js";
import { kafkaConsumer } from "./kafka/consumer.js";

import { saveUserSession, removeUserSession, redisSessionClient } from "./utils/redisSession.js";
import { checkMessageRateLimit, checkEventRateLimit, redisRateLimiterClient } from "./middleware/rateLimiter.middleware.js";
import { validateSocketEvent } from "./middleware/validation.middleware.js";
import { sendMessageSchema } from "./dtos/chat.dto.js";
import { retry } from "./utils/retry.js";
import { acquireLock, releaseLock, redisLockClient } from "./utils/lock.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const validateSendMessage = validateSocketEvent("sendingmessage", sendMessageSchema);

io.on("connection", (socket) => {
  logger.info("User Connected", { socketId: socket.id });

  socket.on("register", async ({ userId }) => {
    if (userId) {
      await saveUserSession(userId, socket.id);
      logger.info("Registered user", { userId, socketId: socket.id });
    }
  });

  socket.on("sendingmessage", async (data, callback) => {
    try {
      const userId = socket.handshake.query.userId;
      if (!userId) {
        return callback?.({ error: "Unauthorized" });
      }

      const allowed = await checkMessageRateLimit(userId);
      if (!allowed) {
        return callback?.({ error: "Rate limit exceeded" });
      }

      validateSendMessage(data, async (err, validated) => {
        if (err) {
          return callback?.({ error: err.message });
        }

        const lockKey = `msg:${validated.senderId}:${validated.to}`;
        const locked = await acquireLock(lockKey, 5);
        if (!locked) {
          return callback?.({ error: "Duplicate request" });
        }

        try {
          await sendToKafka(validated);
          callback?.({ success: true });
        } catch (err) {
          logger.error("Kafka send error", { error: err.message });
          callback?.({ error: "Failed to send message" });
        } finally {
          await releaseLock(lockKey);
        }
      });
    } catch (err) {
      logger.error("sendingmessage error", { error: err.message });
      callback?.({ error: "Internal server error" });
    }
  });

  socket.on("disconnect", async () => {
    const socketId = socket.id;
    await removeUserSession(socketId);
    logger.info("User Disconnected", { socketId });
  });
});

const start = async () => {
  try {
    await dbconnection();
    logger.info("DB connected");

    await createTopic();
    await connectProducer();
    await kafkaConsumer(io);

    server.listen(PORT, () => {
      logger.info("Server running", { port: PORT });
    });
  } catch (err) {
    logger.error("Startup error", { error: err.message });
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  logger.info("Graceful shutdown started");
  try {
    server.close(() => {
      logger.info("HTTP server closed");
    });
    await mongoose.disconnect();
    const { disconnectProducer } = await import("./kafka/producer.js");
    await disconnectProducer();
    await redisSessionClient.quit();
    await redisRateLimiterClient.quit();
    await redisLockClient.quit();
    logger.info("All connections closed");
  } catch (err) {
    logger.error("Error during shutdown", { error: err.message });
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

start();
