import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import {ENV} from "../lib/env.js";

export const signup = async (req,res) => {
    const {fullName,password,email} = req.body;
    try{
        if(!fullName || !password || !email){
            return res.status(400).json({message: "All fields are required"});
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email format"});
        }
        const name  = fullName.trim();
        const standardizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({standardizedEmail});
        if(user){
            return res.status(400).json({message: "Email is already registered"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName : name,
            email : standardizedEmail,
            password: hashedPassword,
          });
        if(newUser){
            const savedUser = await newUser.save();
            generateToken(savedUser._id,res);
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
              });
            try{
                await sendWelcomeEmail(newUser.email,newUser.fullName,ENV.CLIENT_URL);   
            }catch(emailError){
                console.error("Error sending welcome email:", emailError);
            }
        }else{
            res.status(400).json({message: "Invalid user data"}); 
        }   

    }catch(error){
        console.error("Error during signup:", error);
        res.status(500).json({message: "Server error"});
    }
};