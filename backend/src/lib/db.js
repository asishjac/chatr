import mongoose from "mongoose";
import {ENV} from "./env.js";

export const connectDB = async () => {
    const {MONGO_URI} = ENV;
    if(!MONGO_URI){
        throw new error("MONGO_URI is not defined in environment variables"); 
    }
    try{
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");
    }catch(error){
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}