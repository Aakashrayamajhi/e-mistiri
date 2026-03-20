import util from 'util'

if (typeof util._extend !== 'function' || util._extend === util._extend) {
  util._extend = Object.assign
}

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const userRouterModule = await import('./modules/user/user.route.js')
const userRouter = userRouterModule.default
const garageRouterModule = await import('./modules/garage/garage.route.js')
const garageRouter = garageRouterModule.default
const userAuthRouterModule = await import('./modules/userAuth/userAuth.route.js')
const userAuthRouter = userAuthRouterModule.default
const garageAuthRouterModule = await import('./modules/garageAuth/garageAuth.route.js')
const garageAuthRouter = garageAuthRouterModule.default


import { loggerMiddleware } from './middleware/logger.middleware.js'
import { errorMiddleware } from './middleware/error.middleware.js'
import  apilimiter from './middleware/ratelimiter.middleware.js'
import { authMiddleware } from './middleware/auth.middleware.js'

const app = express()

app.use(cors())
app.use(helmet())

app.use(authMiddleware)
app.use(loggerMiddleware)
app.use(apilimiter)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API Gateway is running' })
})


app.use('/api/user', userRouter)
app.use('/api/garage', garageRouter)
app.use('/api/userAuth', userAuthRouter)
app.use('/api/garageAuth', garageAuthRouter)


app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  })
})

app.use(errorMiddleware)

export { app }