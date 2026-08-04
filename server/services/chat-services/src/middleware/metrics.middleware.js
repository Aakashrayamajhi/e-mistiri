const metrics = {
  requestCount: 0,
  errorCount: 0,
  totalLatency: 0,
};

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  metrics.requestCount += 1;

  res.on("finish", () => {
    const latency = Date.now() - start;
    metrics.totalLatency += latency;
    if (res.statusCode >= 400) {
      metrics.errorCount += 1;
    }
  });

  next();
};

export const getMetrics = () => ({
  requestCount: metrics.requestCount,
  errorCount: metrics.errorCount,
  avgLatency: metrics.requestCount ? Math.round(metrics.totalLatency / metrics.requestCount) : 0,
});

export default metricsMiddleware;
