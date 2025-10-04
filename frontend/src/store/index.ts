import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import messageReducer from './slices/messageSlice';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import onboardingReducer from './slices/onboardingSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    message: messageReducer,
    user: userReducer,
    auth: authReducer,
    onboarding: onboardingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;