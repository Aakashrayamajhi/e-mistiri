import express from 'express'
import userAuthRouter from './modules/userAuth/userAuth.router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/v1/auth', userAuthRouter)


export {app}
