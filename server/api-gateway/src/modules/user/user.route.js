import express from 'express'
import proxy from './user.proxy.js'

const router = express.Router()

router.use((req, res, next) => {
  console.log('🔥 User route hit')
  next()
})

router.use(proxy)

export default router