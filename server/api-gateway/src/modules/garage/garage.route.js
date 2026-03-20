import express from 'express'
import proxy from './garage.proxy.js'

const router = express.Router()

router.use((req, res, next) => {
  console.log(' garage route hit')
  next()
})

router.use(proxy)

export default router