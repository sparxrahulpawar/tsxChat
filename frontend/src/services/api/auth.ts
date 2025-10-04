import apiClient from "@/axios/interceptor";

export interface User {
  id: string;
  fullname: string;
  email: string;
  avatar?: string;
  role?: string;
  createdAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface SignupResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

class AuthService {
  private authToken: string | null = null;

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<{message: string, data: LoginResponse}>('/auth/login', {
      email,
      password,
    });
    return response.data.data;
  }

  async signup(fullname: string, email: string, password: string): Promise<SignupResponse> {
    const response = await apiClient.post<{message: string, data: SignupResponse}>('/auth/sign-up', {
      fullname,
      email,
      password,
    });
    return response.data.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, we should clear local data
      console.warn('Logout request failed:', error);
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{message: string, data: User}>('/auth/me');
    return response.data.data;
  }

  async refreshToken(): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/refresh');
    return response.data;
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/auth/profile', data);
    return response.data;
  }
}

export const authService = new AuthService();