import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { initializeAuth, loadUser } from '@/store/slices/authSlice';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
    
    // Load user data if token exists
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
