import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/dotenv.config.js';
import userAuthRouter from './modules/userAuth/userAuth.router.js';
import garageAuthRouter from './modules/garageAuth/garageAuth.route.js';
import mechanicAuthRouter from './modules/mechanicAuth/mechanicAuth.route.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { logger } from './utils/logger.js';
import { sanitizeMiddleware } from './middleware/sanitize.middleware.js';

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config.js";

const app = express();

app.use(helmet());

app.use(cors({
  origin: env.ALLOWED_ORIGINS || '*',
  credentials: true
}));

app.use(sanitizeMiddleware);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use((req, res, next) => {
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  req.id = requestId;

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`, {
      requestId,
      userId: req.user?.id,
      ip: req.ip,
      method: req.method,
      path: req.url,
      statusCode: res.statusCode,
      duration
    });
  });
  next();
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'Auth Service OK', timestamp: new Date().toISOString() });
});

app.get('/metrics', (req, res) => {
  res.json({
    service: 'auth-service',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/userAuth', userAuthRouter);
app.use('/api/v1/garageAuth', garageAuthRouter);
app.use('/api/v1/mechanicAuth', mechanicAuthRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

app.use(errorMiddleware);

export { app };
