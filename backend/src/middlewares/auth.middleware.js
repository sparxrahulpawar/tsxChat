import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import Session from "../modules/user/user.session.model.js";
import User from "../modules/user/user.model.js";

export const protect = async (req, res, next) => {
  try {
    // 1️⃣ Token check
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in! Please login", 401));
    }

    // 2️⃣ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "supeliuytyuiuoyuinrsec87956retkey"
      );
    } catch (err) {
      return next(new AppError("Invalid or expired token", 401));
    }

    // 3️⃣ Check session in DB
    const session = await Session.findOne({ token, user: decoded.id });
    if (!session) {
      return next(
        new AppError("Session is invalid or user has logged out", 401)
      );
    }

    // 4️⃣ Attach user info to request
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    req.user = {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
    };

    next(); // aage allow karo
  } catch (error) {
    next(error);
  }
};
