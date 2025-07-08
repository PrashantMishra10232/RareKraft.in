import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/connection.js";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20"
import { googleCallback } from "./controllers/user.controller.js";

const app = express();

//config
dotenv.config({
    path: "./.env"
});

//config passport js
app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    googleCallback
  )
);

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
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";
import productRouter from "./routes/product.routes.js";
import paymentRouter from "./routes/payment.routes.js"

app.use("/api/v1/user",userRouter)
app.use("/api/v1/order",orderRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/payment",paymentRouter)