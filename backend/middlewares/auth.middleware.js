import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const isAuthenticatedUser = async(req, _, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header
        ("Authorization")?.replace("Bearer", "").trim()
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    
        const user = await User.findById(decodedToken?._id).
        select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, "invalid access Token");
        
    }
}

export const authorizeRole = (...roles)=>{
    return (req, _,next) =>{

        if (!req.user) {
            throw new ApiError(401, "Unauthorized request. User not authenticated.");
        }

        if(!roles.includes(req.user.role)){
            throw new ApiError(403,`Role: ${req.user.role} is not allowed to access this resource`)
        }
        next();
    }
}