import 'dotenv/config';
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath){
            console.error("No file path provided for upload.");
            return null;
        };
        //upload the file on clodinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"image",
            folder:"Job_Portal/Profile_Photos"
        })

        // console.log("File uploaded successfully:", response.url);

        // File uploaded, now delete it from the server
        try {
            fs.unlinkSync(localFilePath);
        } catch (unlinkError) {
            console.error(`Error deleting file from local server: ${unlinkError.message}`);
        }

        return response;
    } catch (error) {
        //if upload fails remove the locally saved file from the server
        console.error("Error uploading file to Cloudinary:", error.message);

        // Attempt to delete the local file if it exists
        try {
            fs.unlinkSync(localFilePath);
        } catch (unlinkError) {
            console.error(`Error deleting file after failed upload: ${unlinkError.message}`);
        }

        return null;
    }
}

const deleteFromCloudinary = async(public_id)=>{
    try {
        if(!public_id) return null;
        const response = await cloudinary.uploader.destroy(public_id,{
            resource_type:"image"
        })
        return response;
    } catch (error) {
        return null;        
    }
}

export {uploadOnCloudinary,deleteFromCloudinary}