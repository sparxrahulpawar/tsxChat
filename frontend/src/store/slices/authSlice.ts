import { authService, User } from "@/services/api/auth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  fullname: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials.email, credentials.password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/sign-up',
  async (userData: SignupData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData.fullname, userData.email, userData.password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load user');
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            authService.clearAuthToken();
        },
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (state, action: PayloadAction<{user:User; token: string}>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            authService.setAuthToken(action.payload.token);
        },
        initializeAuth: (state) => {
            const token = localStorage.getItem('token');
            if (token) {
                state.token = token;
                authService.setAuthToken(token);
            }
        }
    },
    extraReducers: (builder) => {
        builder
        // Login
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            authService.setAuthToken(action.payload.token);
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        })
        // Signup
        .addCase(signupUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(signupUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            authService.setAuthToken(action.payload.token);
        })
        .addCase(signupUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        })
        // Load User
        .addCase(loadUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(loadUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        })
        .addCase(loadUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    }
})

export const { logout, clearError, setCredentials, initializeAuth } = authSlice.actions;
export default authSlice.reducer;