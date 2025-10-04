import axios, { AxiosResponse, AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common error responses
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('auth_user');
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
          toast({
            title: 'Session Expired',
            description: 'Please log in again.',
            variant: 'destructive',
          });
          break;
          
        case 403:
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to perform this action.',
            variant: 'destructive',
          });
          break;
          
        case 404:
          toast({
            title: 'Not Found',
            description: 'The requested resource was not found.',
            variant: 'destructive',
          });
          break;
          
        case 422:
          // Validation errors
          const message = (data as any)?.message || 'Validation failed';
          toast({
            title: 'Validation Error',
            description: message,
            variant: 'destructive',
          });
          break;
          
        case 500:
          toast({
            title: 'Server Error',
            description: 'Something went wrong on our end. Please try again later.',
            variant: 'destructive',
          });
          break;
          
        default:
          const errorMessage = (data as any)?.message || 'An unexpected error occurred';
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
      }
    } else if (error.request) {
      // Network error
      toast({
        title: 'Network Error',
        description: 'Please check your internet connection and try again.',
        variant: 'destructive',
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;