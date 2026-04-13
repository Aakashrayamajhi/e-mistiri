# E-Mistiri Platform - Setup & Installation Guide

## Overview
This is a scalable microservices architecture with:
- **API Gateway** - Central entry point (Port 2002)
- **Auth Service** - User and Garage authentication (Port 4002)
- **User Service** - User management with MongoDB (Port 3002)

## Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 5.0
- Redis >= 6.0
- npm or yarn

## Installation Steps

### 1. Install MongoDB
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

### 2. Install Redis
- Download from: https://redis.io/download
- Or use: `choco install redis` (Windows)
- Start Redis: `redis-server`

### 3. Setup Environment Variables

#### API Gateway
```bash
cd server/api-gateway
cp .env.example .env
# Edit .env and set:
# - JWT_SECRET (use a strong secret key!)
# - MONGO_URI
```

#### Auth Service
```bash
cd server/services/auth-services
cp .env.example .env
# Edit .env and set:
# - JWT_SECRET (must match API Gateway)
# - MONGO_URI
```

#### User Service
```bash
cd server/services/user-services
cp .env.example .env
# Edit .env with your Cloudinary credentials
```

### 4. Install Dependencies

```bash
# API Gateway
cd server/api-gateway
npm install

# Auth Service
cd server/services/auth-services
npm install

# User Service
cd server/services/user-services
npm install
```

### 5. Start the Services

#### Option A: Start All Services Manually
```bash
# Terminal 1 - API Gateway
cd server/api-gateway
npm run dev

# Terminal 2 - Auth Service
cd server/services/auth-services
npm run dev

# Terminal 3 - User Service
cd server/services/user-services
npm run dev
```

#### Option B: Using PM2 (Recommended for Production)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 logs
```

## System Architecture Improvements

### Security Enhancements
- JWT_SECRET validation (no weak defaults)
- Helmet.js for security headers
- CORS configuration
- Input validation with Joi
- Rate limiting (100 requests per 15 minutes)
- Error message sanitization

### Scalability Features
- Graceful shutdown with connection cleanup
- Connection pooling for MongoDB (min: 2, max: 10)
- Redis for caching and rate limiting
- Structured logging with Winston
- Environment-based configuration
- Process error handlers for uncaught exceptions

### Reliability Improvements
- Comprehensive error handling middleware
- Proper error logging to files and console
- Database connection retry logic
- Request/Response timeouts
- Health check endpoints
- Global error handlers

### Monitoring & Logging
- File-based logging (logs/all.log, logs/error.log)
- Health endpoints at `GET /health`
- Request duration tracking
- Error stack traces (dev environment only)
- Rate limit information in response headers

## API Endpoints

### Health Checks
```
GET /health - API Gateway health
GET /api/v1/user/health - User Service health  
GET /api/v1/garage/health - Garage Service health (in User Service)
```

### Public Routes (No Auth Required)
```
POST /api/userAuth/register
POST /api/userAuth/login
POST /api/garageAuth/register
POST /api/garageAuth/login
```

### Protected Routes (Auth Required)
```
GET /api/user/profile
POST /api/user/update
GET /api/garage/list
POST /api/garage/register
```

## Testing the System

### 1. Health Check
```bash
curl http://localhost:2002/health
```

Expected response:
```json
{
  "status": "API Gateway is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### 2. Rate Limiting Test
```bash
# Run this 101 times in quick succession
for i in {1..101}; do curl http://localhost:2002/health; done
```

Expected: 100 successful responses, then 429 (Too Many Requests)

### 3. Auth Test
```bash
# Login
curl -X POST http://localhost:2002/api/userAuth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get the token from response
# Use it in subsequent requests:
curl http://localhost:2002/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Error Handling
```bash
# Request without token (should fail)
curl http://localhost:2002/api/user/profile

# Invalid token (should fail)
curl http://localhost:2002/api/user/profile \
  -H "Authorization: Bearer invalid_token"
```

## Environment Variables Reference

### API Gateway (.env)
- `PORT` - Server port (default: 2002)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - JWT signing secret (REQUIRED)
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `ALLOWED_ORIGINS` - CORS allowed origins

### Auth Service (.env)
- `PORT` - Server port (default: 4002)
- `JWT_SECRET` - JWT signing secret (REQUIRED, must match API Gateway)
- `MONGO_URI` - MongoDB connection string (REQUIRED)
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)

### User Service (.env)
- `PORT` - Server port (default: 3002)
- `MONGO_URI` - MongoDB connection string (REQUIRED)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Troubleshooting

### MongoDB Connection Error
```
Error: MONGO_URI is not configured
```
→ Ensure MongoDB is running and MONGO_URI is set in .env

### Redis Connection Error
```
Error: Redis connection failed
```
→ Ensure Redis is running on localhost:6379 or update REDIS_HOST/REDIS_PORT

### JWT_SECRET Error
```
Error: JWT_SECRET environment variable is required
```
→ Set JWT_SECRET in .env file for all services

### Port Already in Use
```
Error: listen EADDRINUSE :::2002
```
→ Kill the process using the port or change PORT in .env

## Performance Optimization Tips

1. **MongoDB Connection Pooling**: Already configured with min: 2, max: 10
2. **Redis Caching**: Use for session storage and rate limiting
3. **Compression**: Enable gzip compression in production
4. **Load Balancing**: Use nginx or similar for distributing traffic
5. **Monitoring**: Use PM2 Plus or similar for real-time monitoring

## Production Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Configure proper MONGO_URI with authentication
- [ ] Set up Redis with authentication
- [ ] Enable HTTPS/TLS
- [ ] Configure ALLOWED_ORIGINS for CORS
- [ ] Set up log rotation for log files
- [ ] Use PM2 or Docker for process management
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy for MongoDB
- [ ] Test graceful shutdown under load
- [ ] Load test the system before going live

## Key Fixes Implemented

1. Fixed JWT_SECRET security issue (removed weak default)
2. Fixed database connection typo (dbconenction → dbConnection)
3. Added graceful shutdown handlers
4. Added global error handlers for uncaught exceptions
5. Added Helmet.js to all services
6. Added comprehensive error middleware
7. Added structured logging with Winston
8. Added environment variable validation
9. Improved rate limiting (100 req/15min)
10. Added connection pooling configuration
11. Added health check endpoints
12. Added request duration tracking
13. Improved error messages and logging

## Support & Documentation

For more information:
- Express.js: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- Redis: https://redis.io/documentation
- Winston Logger: https://github.com/winstonjs/winston
- Helmet.js: https://helmetjs.github.io

---

**Last Updated**: January 2024
**System Status**: Production Ready
