import connectDB from "./db/index.js";
import dotenv from 'dotenv'
import {app} from './app.js'

dotenv.config({
  path: './env'
})

connectDB()
.then(()=>{
  app.on('error', (error)=>{
    console.error("ERROR: ", error)
    throw error
  })
  app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
  })
})
.catch((error)=>{
  console.error("Mongo DB connection failed: ", error)
  throw error
})

// import express from "express";
// const app = express()
// ( async ()=>{
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//     app.on('error', (error)=>{
//       console.error("ERROR: ", error)
//       throw error
//     })
//     app.listen(process.env.PORT, ()=>{
//       console.log(`Server running on port ${process.env.PORT}`)
//     })
//   } catch (error) {
//     console.error("ERROR: ", error)
//     throw error
//   }
// })()