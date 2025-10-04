import express from "express";
import * as onboarding from "./onboarding.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get("/status", onboarding.getOnboardingStatus);
router.patch("/step", onboarding.updateOnboardingStep);
router.post("/complete", onboarding.completeOnboarding);
router.post("/reset", onboarding.resetOnboarding);

export default router;
