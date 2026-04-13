import { AuthService } from "../services/AuthService.js";
import { signupSchema, loginSchema, updateProfileSchema } from "../lib/schemas/auth.schema.js";

export const signup = async (req, res, next) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const user = await AuthService.signup(validatedData, res);
    res.status(201).json(user);
  } catch (error) {
    next(error); // Pass to centralized error handler
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const user = await AuthService.login(validatedData, res);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    const userId = req.user.userId;
    const updatedUser = await AuthService.updateProfile(userId, validatedData.profilePic);
    
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};