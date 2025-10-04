import * as onboardingService from "./onboarding.service.js";

export const getOnboardingStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const onboarding = await onboardingService.getOnboardingStatus(userId);
    
    return res.status(200).json({
      message: "Onboarding status retrieved successfully",
      data: onboarding,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOnboardingStep = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { step, data } = req.body;

    if (!step) {
      return res.status(400).json({ message: "Step is required" });
    }

    const onboarding = await onboardingService.updateOnboardingStep(userId, step, data);
    
    return res.status(200).json({
      message: "Onboarding step updated successfully",
      data: onboarding,
    });
  } catch (error) {
    next(error);
  }
};

export const completeOnboarding = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const onboarding = await onboardingService.completeOnboarding(userId);
    
    return res.status(200).json({
      message: "Onboarding completed successfully",
      data: onboarding,
    });
  } catch (error) {
    next(error);
  }
};

export const resetOnboarding = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const onboarding = await onboardingService.resetOnboarding(userId);
    
    return res.status(200).json({
      message: "Onboarding reset successfully",
      data: onboarding,
    });
  } catch (error) {
    next(error);
  }
};
