import express from 'express'
import proxy from './mechanic.proxy.js'

 const router = express.Router()

router.use((req, res, next) => {
  console.log(' mechanic route hit')
  next()
})

router.use(proxy)

export default router
