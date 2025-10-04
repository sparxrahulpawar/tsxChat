import React, { useState, useEffect } from 'react';
import { ChatApp } from "@/components/chat/ChatApp";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { authService } from '@/services/api/auth';

const Index = () => {
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user is logged in and if they've seen onboarding
    const savedUser = localStorage.getItem('chatapp-user');
    const hasSeenOnboarding = localStorage.getItem('chatapp-onboarding');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      console.log(response)
      setUser(response.token);
      localStorage.setItem("chatapp-user", JSON.stringify(response.token));
      if (!localStorage.getItem("chatapp-onboarding")) setShowOnboarding(true);
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (fullname: string, email: string, password: string) => {
    try {
      const response = await authService.signup(fullname, email, password);
      setUser(response.user);
      localStorage.setItem("chatapp-user", JSON.stringify(response.user));
      if (!localStorage.getItem("chatapp-onboarding")) setShowOnboarding(true);
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chatapp-user');
    localStorage.removeItem('chatapp-onboarding');
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('chatapp-onboarding', 'true');
  };

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister}  />;
  }

  // Show onboarding if user hasn't seen it
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Show main chat app
  return <ChatApp onLogout={handleLogout} />;
};

export default Index;
