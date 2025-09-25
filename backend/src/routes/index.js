import express from "express";
import authRoutes from "../modules/auth/auth.route.js";
// import userRoutes from "../modules/user/user.route.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.send("Hello World!");
});

router.get("/error", (req, res, next) => {
  next(new Error("This route is not allowed"));
});

// Moduler routes
router.use("/auth", authRoutes);
// router.use("/user", userRoutes);

export default router;
