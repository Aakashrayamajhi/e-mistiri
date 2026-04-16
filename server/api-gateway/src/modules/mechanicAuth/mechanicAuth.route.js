import express from 'express'
import proxy from './mechanicAuth.proxy.js'

const router = express.Router()

router.use((req, res, next) => {
  console.log(' mechanicAuth route hit')
  next()
})

router.use(proxy)

export default router