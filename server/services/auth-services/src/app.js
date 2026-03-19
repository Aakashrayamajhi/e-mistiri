import express from 'express'
import userAuthRouter from './modules/userAuth/userAuth.router.js'
import garageAuthRouter from './modules/garageAuth/garageAuth.route.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/v1/userAuth', userAuthRouter)
app.use('/api/v1/garageAuth', garageAuthRouter)


export {app}
