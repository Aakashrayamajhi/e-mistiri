import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.config.js'

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    req.user = {
      id: decoded.id,
      role: decoded.role
    }

    next()

  } catch (error) {
    console.log("JWT Error:", error.message)

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }

    return res.status(403).json({ message: 'Invalid token' })
  }
}