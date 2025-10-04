import { onboardingService, OnboardingData, UpdateStepData } from "@/services/api/onboarding";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnboardingState {
  data: OnboardingData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OnboardingState = {
  data: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getOnboardingStatus = createAsyncThunk(
  'onboarding/getStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await onboardingService.getOnboardingStatus();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get onboarding status');
    }
  }
);

export const updateOnboardingStep = createAsyncThunk(
  'onboarding/updateStep',
  async ({ step, data }: UpdateStepData, { rejectWithValue }) => {
    try {
      const response = await onboardingService.updateOnboardingStep(step, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update onboarding step');
    }
  }
);

export const completeOnboarding = createAsyncThunk(
  'onboarding/complete',
  async (_, { rejectWithValue }) => {
    try {
      const response = await onboardingService.completeOnboarding();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete onboarding');
    }
  }
);

export const resetOnboarding = createAsyncThunk(
  'onboarding/reset',
  async (_, { rejectWithValue }) => {
    try {
      const response = await onboardingService.resetOnboarding();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset onboarding');
    }
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setOnboardingData: (state, action: PayloadAction<OnboardingData>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get onboarding status
      .addCase(getOnboardingStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOnboardingStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getOnboardingStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update step
      .addCase(updateOnboardingStep.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOnboardingStep.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(updateOnboardingStep.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Complete onboarding
      .addCase(completeOnboarding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reset onboarding
      .addCase(resetOnboarding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetOnboarding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(resetOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, setOnboardingData } = onboardingSlice.actions;
export default onboardingSlice.reducer;
