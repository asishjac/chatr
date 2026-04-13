import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid token" });

    const user = await UserRepository.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove password from request object
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};