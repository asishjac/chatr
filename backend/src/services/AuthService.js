import { UserRepository } from "../repositories/UserRepository.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { EmailService } from "./EmailService.js";
import { StorageService } from "./StorageService.js";

export class AuthService {
  static async signup(userData, res) {
    const { fullName, password, email } = userData;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserRepository.create({
      fullName,
      email,
      password: hashedPassword,
    });

    generateToken(newUser.userId, res);

    try {
      await EmailService.sendWelcome(newUser.email, newUser.fullName);
    } catch (e) {
      console.error("Welcome email failed:", e);
    }

    return {
      userId: newUser.userId,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    };
  }

  static async login(credentials, res) {
    const { email, password } = credentials;

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    generateToken(user.userId, res);

    return {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    };
  }

  static async updateProfile(userId, profilePicBase64) {
    // 1. Upload to S3
    const profilePicUrl = await StorageService.uploadProfilePic(userId, profilePicBase64);

    // 2. Update DB
    const updatedUser = await UserRepository.updateProfilePic(userId, profilePicUrl);
    
    // Remove password from response
    delete updatedUser.password;
    return updatedUser;
  }
}
