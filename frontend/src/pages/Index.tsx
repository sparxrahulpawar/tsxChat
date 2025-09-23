import React, { useState, useEffect } from 'react';
import { ChatApp } from "@/components/chat/ChatApp";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";

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

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('chatapp-user', JSON.stringify(userData));
    
    // Show onboarding for new users
    const hasSeenOnboarding = localStorage.getItem('chatapp-onboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
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
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Show onboarding if user hasn't seen it
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Show main chat app
  return <ChatApp onLogout={handleLogout} />;
};

export default Index;
