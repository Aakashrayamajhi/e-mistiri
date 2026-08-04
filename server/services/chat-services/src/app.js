import express from "express";
import helmet from "helmet";
import cors from "cors";

import { sanitizeMiddleware } from "./middleware/sanitize.middleware.js";
import metricsMiddleware, { getMetrics } from "./middleware/metrics.middleware.js";
import logger from "./utils/logger.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(sanitizeMiddleware);
app.use(metricsMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/metrics", (req, res) => {
  res.status(200).json(getMetrics());
});

export default app;
