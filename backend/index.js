import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/connection.js";

const app = express();

//config
dotenv.config({
    path: "./.env"
});

//middlewares
app.use(express.json({limit:"16mb"}));
app.use(express.urlencoded({
    extended:true
}));
app.use(cookieParser());
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

//connection
connectDB()
.then(()=>{
    app.on("error",()=>{
        console.log("Error:", error);
        throw error;
    })
    app.listen(process.env.PORT||8000,()=>{
    console.log(`Server running at port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(err,"MongoDB Connection is failed");  
})

//routes declaration