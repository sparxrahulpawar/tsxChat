import User from "../user/user.model.js";
import AppError from "../../utils/appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Session from "../user/user.session.model.js";

export const signup = async ({ fullname, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });

  // Generate token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "supeliuytyuiuoyuinrsec87956retkey",
    { expiresIn: process.env.JWT_SECRET_TOKEN_EXPIRES_IN || "7d" }
  );

  // Create session
  const session = await Session.create({
    user: user._id,
    token,
    ipAddress: null,
    userAgent: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // don't return password in response
  user.password = undefined;
  return { user, token };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "supeliuytyuiuoyuinrsec87956retkey",
    { expiresIn: process.env.JWT_SECRET_TOKEN_EXPIRES_IN || "7d" }
  );

  // Session create
  const session = await Session.create({
    user: user._id,
    token,
    ipAddress: null,
    userAgent: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // don't return password in response
  user.password = undefined;
  return { user, token };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const logout = async ({ token }) => {
  const session = await Session.findOneAndDelete({ token });
  if (!session) {
    throw new AppError("Invalid or expired session", 400);
  }
  return true;
};
