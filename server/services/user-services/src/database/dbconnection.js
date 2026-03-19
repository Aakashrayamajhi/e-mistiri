import mongoose from "mongoose"
import dotenv from "dotenv"

    dotenv.config()

    const dbconenction = async ()=>{
        await mongoose.connect(process.env.MONGO_URI)
        .then(()=>{ console.log("db connected")})
        .catch((error)=>{ console.log("db error:" , error)})

    }

    export default dbconenction