import express from 'express'
import proxy from './chat.proxy.js'

const router = express.Router()

router.use((req, res, next) => {
  console.log('Chat route hit')
  next()
})

router.use(proxy)

export default router