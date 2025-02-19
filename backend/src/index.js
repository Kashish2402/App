import dotenv from "dotenv"
import { connectDB } from "./db/db.js"
import { app } from "./app.js"
import { server } from "./server.js"

dotenv.config({
    path:"./.env"
})

const PORT=process.env.PORT

connectDB()
.then(()=>{
    server.on("error",(err)=>{
        console.log(`ERROR ::: ${err}`)
    })

    server.listen(PORT,()=>{
        console.log(`Server Running on PORT : ${PORT}`)
    })
})