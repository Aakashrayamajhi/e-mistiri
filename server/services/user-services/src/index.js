import {app} from "./app.js"
import { env } from "./config/dotenv.config.js"
import dbconenction from "./database/dbconnection.js"

const PORT = env.PORT


const StartServer =()=>{
  try{
    dbconenction()
    app.listen(PORT,()=>{
      console.log(`server is running at port:${PORT}`)
    })
  } catch(error){
    console.log('error:', error)

  }
}

StartServer()