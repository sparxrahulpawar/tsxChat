import express from "express";
import * as auth from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/sign-up", auth.signup);
router.post("/login", auth.login);
router.get("/me", protect, auth.getCurrentUser);
router.post("/logout", auth.logout);

export default router;