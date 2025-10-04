import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, User, Settings, Check } from 'lucide-react';
import { getOnboardingStatus, updateOnboardingStep, completeOnboarding } from '@/store/slices/onboardingSlice';
import { AppDispatch, RootState } from '@/store';
import { toast } from '@/hooks/use-toast';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { data: onboardingData, isLoading } = useSelector((state: RootState) => state.onboarding);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    bio: '',
    interests: [] as string[],
  });
  const [preferences, setPreferences] = useState({
    theme: 'system' as 'light' | 'dark' | 'system',
    notifications: {
      email: true,
      push: true,
      sound: true,
    },
    privacy: {
      showOnlineStatus: true,
      showLastSeen: true,
      allowDirectMessages: true,
    },
  });

  const steps = [
    {
      title: 'Welcome to ChatConnect!',
      description: 'Let\'s get you set up',
      icon: MessageCircle,
    },
    {
      title: 'Complete Your Profile',
      description: 'Tell us a bit about yourself',
      icon: User,
    },
    {
      title: 'Set Your Preferences',
      description: 'Customize your experience',
      icon: Settings,
    },
  ];

  useEffect(() => {
    dispatch(getOnboardingStatus());
  }, [dispatch]);

  useEffect(() => {
    if (onboardingData?.isCompleted) {
      navigate('/');
    }
  }, [onboardingData, navigate]);

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await dispatch(updateOnboardingStep({ step: 'welcome' }));
        setCurrentStep(1);
      } else if (currentStep === 1) {
        await dispatch(updateOnboardingStep({ 
          step: 'profile', 
          data: profileData 
        }));
        setCurrentStep(2);
      } else if (currentStep === 2) {
        await dispatch(updateOnboardingStep({ 
          step: 'preferences', 
          data: preferences 
        }));
        await dispatch(completeOnboarding());
        toast({
          title: 'Welcome to ChatConnect!',
          description: 'Your profile has been set up successfully.',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update onboarding step',
        variant: 'destructive',
      });
    }
  };

  const handleInterestToggle = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const availableInterests = [
    'Technology', 'Gaming', 'Music', 'Sports', 'Travel', 'Food', 'Art', 'Books', 'Movies', 'Fitness'
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to ChatConnect!</h2>
              <p className="text-muted-foreground">
                You're about to join thousands of users who are already connecting, chatting, and collaborating.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Instant messaging</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Video calls</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Group chats</span>
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
              <p className="text-muted-foreground">
                Help others get to know you better
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  maxLength={500}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Interests (Select all that apply)</Label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={profileData.interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Set Your Preferences</h2>
              <p className="text-muted-foreground">
                Customize your ChatConnect experience
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value: 'light' | 'dark' | 'system') => 
                    setPreferences(prev => ({ ...prev, theme: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Notifications</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Email notifications</span>
                    <Switch
                      checked={preferences.notifications.email}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Push notifications</span>
                    <Switch
                      checked={preferences.notifications.push}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sound notifications</span>
                    <Switch
                      checked={preferences.notifications.sound}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sound: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Privacy</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Show online status</span>
                    <Switch
                      checked={preferences.privacy.showOnlineStatus}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, showOnlineStatus: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show last seen</span>
                    <Switch
                      checked={preferences.privacy.showLastSeen}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, showLastSeen: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Allow direct messages</span>
                    <Switch
                      checked={preferences.privacy.allowDirectMessages}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, allowDirectMessages: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-border/50 backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
              ))}
            </div>
            <CardTitle className="flex items-center justify-center space-x-2">
              {React.createElement(steps[currentStep].icon, { className: "w-6 h-6" })}
              <span>{steps[currentStep].title}</span>
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between pt-6">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={isLoading}
                >
                  Previous
                </Button>
              )}
              
              <div className="flex-1" />
              
              <Button
                onClick={handleNext}
                disabled={isLoading}
              >
                {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
