import express from 'express'
import userRouter from './modules/user/user.route.js'
import garageRouter from './modules/garage/garage.route.js'


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/garage', garageRouter)


export {app}
