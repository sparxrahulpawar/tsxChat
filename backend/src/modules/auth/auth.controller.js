import * as authService from "./auth.service.js";

export const signup = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await authService.signup({ fullname, email, password });

    return res
      .status(201)
      .json({ message: "User created successfully", data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    // Service ko call karo
    const token = await authService.login({ email, password });

    res.status(200).json({
      message: "Login successful",
      data: token,
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
