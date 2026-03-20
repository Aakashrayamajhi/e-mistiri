import express from 'express'
import proxy from './userAuth.proxy.js'

const router = express.Router()

router.use((req, res, next) => {
  console.log(' userAuth route hit')
  next()
})

router.use(proxy)

export default router