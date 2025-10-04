import apiClient from "@/axios/interceptor";

export interface OnboardingData {
  isCompleted: boolean;
  steps: {
    welcome: boolean;
    profile: boolean;
    preferences: boolean;
  };
  profileData?: {
    avatar?: string;
    bio?: string;
    interests?: string[];
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: {
      email: boolean;
      push: boolean;
      sound: boolean;
    };
    privacy?: {
      showOnlineStatus: boolean;
      showLastSeen: boolean;
      allowDirectMessages: boolean;
    };
  };
  completedAt?: string;
}

export interface UpdateStepData {
  step: 'welcome' | 'profile' | 'preferences';
  data?: any;
}

class OnboardingService {
  async getOnboardingStatus(): Promise<OnboardingData> {
    const response = await apiClient.get<{message: string, data: OnboardingData}>('/onboarding/status');
    return response.data.data;
  }

  async updateOnboardingStep(step: 'welcome' | 'profile' | 'preferences', data?: any): Promise<OnboardingData> {
    const response = await apiClient.patch<{message: string, data: OnboardingData}>('/onboarding/step', {
      step,
      data,
    });
    return response.data.data;
  }

  async completeOnboarding(): Promise<OnboardingData> {
    const response = await apiClient.post<{message: string, data: OnboardingData}>('/onboarding/complete');
    return response.data.data;
  }

  async resetOnboarding(): Promise<OnboardingData> {
    const response = await apiClient.post<{message: string, data: OnboardingData}>('/onboarding/reset');
    return response.data.data;
  }
}

export const onboardingService = new OnboardingService();
