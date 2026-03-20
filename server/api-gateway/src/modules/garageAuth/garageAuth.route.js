import express from 'express'
import proxy from './garageAuth.proxy.js'

const router = express.Router()

router.use((req, res, next) => {
  console.log(' garageAuth route hit')
  next()
})

router.use(proxy)

export default router