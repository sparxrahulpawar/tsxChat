import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { endCall } from '@/store/slices/userSlice';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Settings,
  MessageSquare,
  Users,
  Minimize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

export const CallInterface: React.FC = () => {
  const dispatch = useDispatch();
  const { callType, callParticipants } = useTypedSelector((state) => state.user);
  const { chats } = useTypedSelector((state) => state.chat);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Find the current call participants from chats
  const currentChat = chats.find(chat => 
    chat.participants.some(p => callParticipants.includes(p.id))
  );
  
  const otherParticipants = currentChat?.participants || [];

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    dispatch(endCall());
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In real app, this would control actual microphone
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // In real app, this would control actual camera
  };

  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-background border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-status-online rounded-full animate-pulse" />
          <span className="text-sm font-medium">{formatDuration(callDuration)}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(false)}
            className="p-1 h-auto"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEndCall}
            className="p-1 h-auto text-destructive hover:text-destructive"
          >
            <PhoneOff className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-status-online rounded-full animate-pulse" />
          <div>
            <h2 className="font-semibold text-foreground">
              {callType === 'video' ? 'Video Call' : 'Voice Call'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {formatDuration(callDuration)} • {otherParticipants.length} participant(s)
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main call area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {callType === 'video' ? (
          <div className="relative w-full max-w-4xl aspect-video bg-background-secondary rounded-2xl overflow-hidden">
            {/* Video placeholder - in real app this would show actual video streams */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                {isVideoEnabled ? (
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-16 h-16 text-primary" />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <VideoOff className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                <p className="text-lg font-medium text-foreground">
                  {otherParticipants[0]?.name || 'Participant'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isVideoEnabled ? 'Video enabled' : 'Video disabled'}
                </p>
              </div>
            </div>

            {/* Self video (small overlay) */}
            <div className="absolute top-4 right-4 w-40 h-28 bg-background-tertiary rounded-lg border border-border flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-primary-foreground font-medium">You</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isVideoEnabled ? 'Your video' : 'Video off'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Voice call UI
          <div className="text-center">
            <div className="flex justify-center gap-8 mb-8">
              {otherParticipants.map((participant, index) => (
                <div key={participant.id} className="text-center">
                  <Avatar className="w-32 h-32 mb-4 mx-auto">
                    <span className="text-4xl">{participant.avatar}</span>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {participant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-4 h-4 bg-status-online rounded-full animate-pulse" />
              <span className="text-lg font-medium text-foreground">
                Call in progress
              </span>
            </div>
            
            <div className="flex justify-center">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-primary rounded-full animate-pulse`}
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call controls */}
      <div className="p-6 border-t border-border">
        <div className="flex justify-center gap-4">
          {/* Mute button */}
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleMute}
            className="w-14 h-14 rounded-full"
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          {/* Video toggle (only for video calls) */}
          {callType === 'video' && (
            <Button
              variant={isVideoEnabled ? "secondary" : "destructive"}
              size="lg"
              onClick={toggleVideo}
              className="w-14 h-14 rounded-full"
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
          )}

          {/* Screen share (video calls only) */}
          {callType === 'video' && (
            <Button
              variant="secondary"
              size="lg"
              className="w-14 h-14 rounded-full"
            >
              <Monitor className="w-6 h-6" />
            </Button>
          )}

          {/* Participants */}
          <Button
            variant="secondary"
            size="lg"
            className="w-14 h-14 rounded-full"
          >
            <Users className="w-6 h-6" />
          </Button>

          {/* End call */}
          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-destructive hover:bg-destructive/90"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Call duration: {formatDuration(callDuration)}
          </p>
        </div>
      </div>
    </div>
  );
};