import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minLength:[4,"Name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password: {
        type: String,
        // required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    avatar: {
        type:String,
    },
    role: {
        type: String,
        enum:["Seller","Buyer"],
        default: "Buyer",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    refreshToken: {
        type:String,
        select:false
    },
    googleId:String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},{
    timestamps: true,
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
    
}

userSchema.methods.getResetPasswordToken = async function(){
    // Generating Token
    const resetToken = crypto.randomBytes(6).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
};


//generating access and refresh token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this.id,
            name:this.name,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
          _id:this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
       {
         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
       }
    )
}

export const User = mongoose.model("User",userSchema)

