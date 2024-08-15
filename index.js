const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const PORT = 3000
const DB = require("mongoose")
const userRoute = require("./routes/UserRoute")
const DBURL = process.env.DBURL
app.use(cors())
app.use(express.json())
async function DBConnect(){
    await DB.connect(DBURL)
}
DBConnect().then((res)=>{
    console.log("DB Connected")
}).catch((err)=>{
    console.log(err)
})
app.use("/api/users",userRoute)
app.get("/",(req,res)=>{
    res.send("Hello World!")
})
app.listen(PORT,()=>{
    console.log(`app is listening on port ${PORT}`)
})