import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Users, Video, Phone, Files, MapPin, CheckSquare, Palette, Bell, Shield, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to ChatConnect',
    description: 'Your all-in-one communication platform',
    icon: MessageCircle,
    content: (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
          <MessageCircle className="w-12 h-12 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3">Let's get you started!</h3>
          <p className="text-muted-foreground text-lg">
            ChatConnect brings together all your communication needs in one beautiful, intuitive interface.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'messaging',
    title: 'Rich Messaging Experience',
    description: 'Text, voice, files, and more',
    icon: MessageCircle,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/5 p-4 rounded-2xl text-center">
            <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">Instant Messages</h4>
            <p className="text-sm text-muted-foreground">Real-time chat</p>
          </div>
          <div className="bg-primary/5 p-4 rounded-2xl text-center">
            <Files className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">File Sharing</h4>
            <p className="text-sm text-muted-foreground">Any file type</p>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Express Yourself</h3>
          <p className="text-muted-foreground">
            Send messages, emojis, files, images, videos, and even your location. 
            Everything you need to communicate effectively.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'calls',
    title: 'Voice & Video Calls',
    description: 'High-quality communication',
    icon: Video,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/5 p-4 rounded-2xl text-center">
            <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">Voice Calls</h4>
            <p className="text-sm text-muted-foreground">Crystal clear audio</p>
          </div>
          <div className="bg-primary/5 p-4 rounded-2xl text-center">
            <Video className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">Video Calls</h4>
            <p className="text-sm text-muted-foreground">Face-to-face conversations</p>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Stay Connected</h3>
          <p className="text-muted-foreground">
            Make voice and video calls with individuals or groups. 
            Perfect for meetings, catch-ups, or just saying hello.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'features',
    title: 'Smart Features',
    description: 'Productivity tools built-in',
    icon: CheckSquare,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/5 p-4 rounded-2xl text-center">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">Location</h4>
            <p className="text-sm text-muted-foreground">Share where you are</p>
          </div>
          <div className="bg-primary/5 p-4 rounded-2xl text-center">
            <CheckSquare className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">Checklists</h4>
            <p className="text-sm text-muted-foreground">Organize tasks</p>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">More Than Just Chat</h3>
          <p className="text-muted-foreground">
            Create checklists, share your location, and use productivity features 
            that make collaboration effortless.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'customization',
    title: 'Make It Yours',
    description: 'Customize your experience',
    icon: Palette,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-primary/5 p-4 rounded-2xl text-center">
            <Palette className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold text-sm">Themes</h4>
          </div>
          <div className="bg-primary/5 p-4 rounded-2xl text-center">
            <Bell className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold text-sm">Notifications</h4>
          </div>
          <div className="bg-primary/5 p-4 rounded-2xl text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold text-sm">Privacy</h4>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Your Way</h3>
          <p className="text-muted-foreground">
            Switch between light and dark themes, customize notifications, 
            and control your privacy settings to make ChatConnect truly yours.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'ready',
    title: 'You\'re All Set!',
    description: 'Start chatting now',
    icon: Check,
    content: (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
          <Check className="w-12 h-12 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3">Ready to Connect!</h3>
          <p className="text-muted-foreground text-lg">
            You're all set to start using ChatConnect. Begin by sending your first message 
            or starting a conversation with friends and colleagues.
          </p>
        </div>
        <div className="bg-primary/5 p-4 rounded-2xl">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Pro tip:</strong> You can always access settings to customize your experience further.
          </p>
        </div>
      </div>
    )
  }
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2lg">
        <Card className="border-border/50 backdrop-blur-sm bg-card/90 overflow-hidden">
          <CardContent className="p-0">
            {/* Progress Header */}
            <div className="bg-primary/5 p-6 border-b border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {onboardingSteps.length}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={skipOnboarding}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip
                </Button>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <currentStepData.icon className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </div>
              
              <div className="mb-8">
                {currentStepData.content}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-6 bg-primary/5 border-t border-border/50">
              <Button 
                variant="ghost" 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              
              <Button onClick={nextStep} className="flex items-center gap-2">
                {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep !== onboardingSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};