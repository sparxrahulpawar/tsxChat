import * as authService from "./auth.service.js";
import AppError from "../../utils/appError.js";

export const signup = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const result = await authService.signup({ fullname, email, password });

    return res
      .status(201)
      .json({ 
        message: "User created successfully", 
        data: {
          user: result.user,
          token: result.token
        }
      });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    const result = await authService.login({ email, password });

    res.status(200).json({
      message: "Login successful",
      data: {
        user: result.user,
        token: result.token
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await authService.getCurrentUser(userId);
    
    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) {
      return next(new AppError("Token is required for logout", 400));
    }

    await authService.logout({ token });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
