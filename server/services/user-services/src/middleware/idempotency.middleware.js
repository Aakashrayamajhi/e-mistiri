import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379
});

export const idempotencyMiddleware = async (req, res, next) => {
  if (!['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }

  const key = req.headers['idempotency-key'];
  if (!key) {
    return next();
  }

  const cached = await redis.get(`idempotency:${key}`);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    await redis.setEx(`idempotency:${key}`, 86400, JSON.stringify(body));
    return originalJson(body);
  };

  next();
};
