import Onboarding from "./onboarding.model.js";
import AppError from "../../utils/appError.js";

export const getOnboardingStatus = async (userId) => {
  let onboarding = await Onboarding.findOne({ user: userId });
  
  if (!onboarding) {
    // Create onboarding record if it doesn't exist
    onboarding = await Onboarding.create({ user: userId });
  }
  
  return onboarding;
};

export const updateOnboardingStep = async (userId, step, data) => {
  const onboarding = await Onboarding.findOne({ user: userId });
  
  if (!onboarding) {
    throw new AppError("Onboarding record not found", 404);
  }

  // Update the specific step
  switch (step) {
    case 'welcome':
      onboarding.steps.welcome = true;
      break;
    case 'profile':
      onboarding.steps.profile = true;
      if (data) {
        onboarding.profileData = { ...onboarding.profileData, ...data };
      }
      break;
    case 'preferences':
      onboarding.steps.preferences = true;
      if (data) {
        onboarding.preferences = { ...onboarding.preferences, ...data };
      }
      break;
    default:
      throw new AppError("Invalid step provided", 400);
  }

  await onboarding.save();
  return onboarding;
};

export const completeOnboarding = async (userId) => {
  const onboarding = await Onboarding.findOne({ user: userId });
  
  if (!onboarding) {
    throw new AppError("Onboarding record not found", 404);
  }

  // Check if all steps are completed
  const allStepsCompleted = Object.values(onboarding.steps).every(step => step === true);
  
  if (!allStepsCompleted) {
    throw new AppError("All onboarding steps must be completed before marking as complete", 400);
  }

  onboarding.isCompleted = true;
  onboarding.completedAt = new Date();
  
  await onboarding.save();
  return onboarding;
};

export const resetOnboarding = async (userId) => {
  const onboarding = await Onboarding.findOne({ user: userId });
  
  if (!onboarding) {
    throw new AppError("Onboarding record not found", 404);
  }

  // Reset all steps
  onboarding.isCompleted = false;
  onboarding.steps = {
    welcome: false,
    profile: false,
    preferences: false,
  };
  onboarding.completedAt = null;
  
  await onboarding.save();
  return onboarding;
};
