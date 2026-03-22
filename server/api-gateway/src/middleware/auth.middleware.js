import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.config.js'
import { logger } from '../utils/logger.js'

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    console.log("auth-header:", authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or invalid authorization header', { path: req.path })
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized - Missing or invalid token' 
      })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, JWT_SECRET)

      req.user = {
        id: decoded.id,
        role: decoded.role
      }
      console.log("docodded user:", req.user)

      next()

    } catch (error) {
      logger.warn(`JWT verification failed: ${error.message}`, { path: req.path })

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Token expired - Please login again' 
        })
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(403).json({ 
          success: false,
          message: 'Invalid token' 
        })
      }

      return res.status(403).json({ 
        success: false,
        message: 'Authentication failed' 
      })
    }
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message })
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    })
  }
}