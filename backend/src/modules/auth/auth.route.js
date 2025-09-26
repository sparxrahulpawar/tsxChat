import express from "express";
import * as auth from "./auth.controller.js";

const router = express.Router();

router.post("/sign-up", auth.signup)

router.post("/login", auth.login)

router.post("/logout", auth.logout);

export default router;