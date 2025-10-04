import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ChatApp } from '@/components/chat/ChatApp';
import { RootState, AppDispatch } from '@/store';
import { getOnboardingStatus } from '@/store/slices/onboardingSlice';
import { logout } from '@/store/slices/authSlice';
import { toast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { data: onboardingData, isLoading: onboardingLoading } = useSelector((state: RootState) => state.onboarding);

  useEffect(() => {
    // Check if user is authenticated
    if (!user || !token) {
      navigate('/login');
      return;
    }

    // Check onboarding status
    dispatch(getOnboardingStatus());
  }, [user, token, navigate, dispatch]);

  useEffect(() => {
    // If onboarding is not completed, redirect to onboarding
    if (!onboardingLoading && onboardingData && !onboardingData.isCompleted) {
      navigate('/onboarding');
    }
  }, [onboardingData, onboardingLoading, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Show loading while checking onboarding status
  if (onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If onboarding is not completed, don't render anything (will redirect)
  if (!onboardingData?.isCompleted) {
    return null;
  }

  return <ChatApp onLogout={handleLogout} />;
};

export default Home;
