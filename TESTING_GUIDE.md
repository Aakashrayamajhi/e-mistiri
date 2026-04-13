# E-Mistiri Platform - Testing Guide

## Quick Start Testing

### Prerequisites
Ensure all services are running:
```bash
# Terminal 1 - API Gateway (Port 2002)
cd server/api-gateway
npm run dev

# Terminal 2 - Auth Service (Port 4002)  
cd server/services/auth-services
npm run dev

# Terminal 3 - User Service (Port 3002)
cd server/services/user-services
npm run dev
```

---

## 1. Health Check Tests

### Test API Gateway Health
```bash
curl http://localhost:2002/health
```

Expected Response (200 OK):
```json
{
  "status": "API Gateway is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### Test User Service Health
```bash
curl http://localhost:3002/health
```

Expected Response (200 OK):
```json
{
  "status": "User Service OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test Auth Service Health
```bash
curl http://localhost:4002/health
```

Expected Response (200 OK):
```json
{
  "status": "Auth Service OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 2. Authentication Tests

### Test Missing Authorization Header
```bash
curl http://localhost:2002/api/user/profile
```

Expected Response (401 Unauthorized):
```json
{
  "success": false,
  "message": "Unauthorized - Missing or invalid token",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test with Invalid Token
```bash
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:2002/api/user/profile
```

Expected Response (403 Forbidden):
```json
{
  "success": false,
  "message": "Invalid token",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 3. Error Handling Tests

### Test 404 Not Found
```bash
curl http://localhost:2002/api/nonexistent
```

Expected Response (404 Not Found):
```json
{
  "success": false,
  "message": "Route not found",
  "path": "/api/nonexistent",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test Invalid JSON
```bash
curl -X POST http://localhost:2002/api/userAuth/login \
  -H "Content-Type: application/json" \
  -d "invalid json"
```

Expected Response (400 Bad Request):
```json
{
  "success": false,
  "message": "SyntaxError: Unexpected token i in JSON at position 0",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 4. Rate Limiting Tests

### Test Individual Rate Limit Headers
```bash
curl -i http://localhost:2002/health
```

Check response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 2024-01-15T10:45:00.000Z
```

### Test Rate Limit Threshold
```bash
# Send 101 requests rapidly
for i in {1..101}; do 
  curl -o /dev/null -s -w "Response %{http_code}\n" http://localhost:2002/health
done
```

Expected: First 100 requests return 200, 101st returns 429

### Verify Rate Limit Throttling (429 Response)
```bash
# Keep sending requests after hitting limit
curl http://localhost:2002/health
```

Until the window resets (15 minutes), you should get:
Expected Response (429 Too Many Requests):
```json
{
  "success": false,
  "message": "Too many requests, please try again later",
  "retryAfter": 900,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 5. Middleware Tests

### Test CORS Headers
```bash
curl -i -X OPTIONS http://localhost:2002/health \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
```

Should include CORS headers in response

### Test Security Headers (Helmet.js)
```bash
curl -i http://localhost:2002/health
```

Response headers should include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 0`
- `Strict-Transport-Security: max-age=...`

---

## 6. Logging Tests

### Check Console Logs
All services output logs in the format:
```
TIMESTAMP [LEVEL] SERVICE: MESSAGE METADATA
```

Example:
```
2024-01-15 10:30:00 [INFO] API-GATEWAY: GET /health - 200 {"duration":"2ms"}
2024-01-15 10:30:01 [WARN] API-GATEWAY: Rate limit exceeded for IP: 127.0.0.1
```

### Check Log Files
```bash
# API Gateway logs
cat logs/api-gateway-all.log
cat logs/api-gateway-error.log

# User Service logs
cat logs/all.log
cat logs/error.log

# Auth Service logs
cat logs/all.log
cat logs/error.log
```

---

## 7. Graceful Shutdown Tests

### Start a service and stop it gracefully
```bash
# Terminal with running service
# Press Ctrl+C to trigger graceful shutdown
```

Expected output:
```
Shutting down gracefully...
HTTP server closed
Database connection closed
```

### Verify no "Forced shutdown" message appears
If the system shuts down properly, you should see `HTTP server closed` and `Database connection closed`

---

## 8. Error Handling & Stack Traces

### Check Development Error Messages
When NODE_ENV=development, errors include stack traces:

```bash
curl http://localhost:2002/api/user/profile
```

Response will include:
```json
{
  "success": false,
  "message": "...",
  "stack": "Error: ...\n    at ..."
}
```

### Check Production Error Messages
When NODE_ENV=production, stack traces are hidden:

```json
{
  "success": false,
  "message": "..."
}
```

---

## 9. Connection Testing

### Test Database Connection
Check logs for:
```
Database connected successfully
```

If MongoDB is not running:
```
✗ Failed to connect to database: connect ECONNREFUSED
```

### Test Redis Connection
Check logs for:
```
Redis connected
```

If Redis is not running:
```
✗ Redis connection error: connect ECONNREFUSED
```

---

## 10. Automated Testing

### Run Windows Batch Test Script
```bash
test-system.bat
```

### Run Bash Test Script (Linux/macOS)
```bash
chmod +x test-system.sh
./test-system.sh
```

---

## Performance Testing

### Measure Response Times
```bash
curl -w "\nTime: %{time_total}s\n" http://localhost:2002/health
```

Expected: < 50ms for local requests

### Load Testing Example
```bash
# Install Apache Bench (ab command)
ab -n 1000 -c 10 http://localhost:2002/health/
```

Expected: Handle 1000 requests with 10 concurrent connections

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 2002
netstat -ano | findstr :2002
# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Services Not Responding
1. Check all services are started
2. Verify ports are correct (2002, 4002, 3002)
3. Check console for error messages
4. Verify MongoDB and Redis are running

### High Rate Limiting
If you're hitting the 429 limit frequently:
- Modify `limit` and `window` in `api-gateway/src/middleware/ratelimiter.middleware.js`
- Default: 100 requests per 900 seconds (15 minutes)

### Memory Leaks
Monitor service memory usage:
```bash
# Check memory (Windows)
tasklist | findstr node

# Check memory (Linux/macOS)
ps aux | grep node
```

---

## Security Testing

### Test JWT Validation
1. Generate a valid token using the auth service
2. Modify the token slightly
3. Try to access protected route
4. Verify you get `403 Invalid token`

### Test SQL Injection Protection
```bash
curl -X POST http://localhost:2002/api/userAuth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin'\'' OR '\''1'\''='\''1","password":"anything"}'
```

Should not allow injection attacks

### Test XSS Protection
Check Helmet.js headers are set properly:
```bash
curl -i http://localhost:2002/health | grep "X-XSS"
```

---

## Test Checklist

- [ ] All health endpoints return 200
- [ ] Authentication returns 401 when token is missing
- [ ] Invalid tokens return 403
- [ ] 404 errors appear for non-existent routes
- [ ] Rate limiting kicks in after 100 requests
- [ ] Security headers are present
- [ ] Logs are created in `logs/` directory
- [ ] Graceful shutdown works without errors
- [ ] Error messages are sanitized in production
- [ ] Database connection shows success message
- [ ] Redis connection shows success message

---

## Performance Baselines

These are expected performance metrics for a healthy system:

| Metric | Expected | Acceptable | Warning |
|--------|----------|-----------|---------|
| Health check response | < 10ms | < 50ms | > 100ms |
| Auth endpoint | < 100ms | < 200ms | > 500ms |
| Requests per second | > 1000 | > 500 | < 200 |
| Error rate | 0% | < 1% | > 5% |
| Memory per service | < 50MB | < 100MB | > 200MB |

---

## Next Steps

1. Complete all tests in the checklist
2. Review logs for any warnings or errors
3. Monitor performance baselines
4. Set up production monitoring
5. Configure backup and disaster recovery

For more information, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
