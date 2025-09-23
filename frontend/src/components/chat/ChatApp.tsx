import React, { useState } from 'react';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { CallInterface } from './CallInterface';
import { SettingsScreen } from '../settings/SettingsScreen';

interface ChatAppProps {
  onLogout: () => void;
}

export const ChatApp: React.FC<ChatAppProps> = ({ onLogout }) => {
  const { isCallActive } = useTypedSelector((state) => state.user);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex h-screen bg-chat-background">
      {/* Chat Sidebar */}
      <div className="w-80 bg-chat-sidebar border-r border-border flex-shrink-0">
        <ChatSidebar onSettingsClick={() => setShowSettings(true)} />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatArea />
      </div>
      
      {/* Call Interface Overlay */}
      {isCallActive && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <CallInterface />
        </div>
      )}
      
      {/* Settings Screen */}
      {showSettings && (
        <SettingsScreen 
          onClose={() => setShowSettings(false)}
          onLogout={onLogout}
        />
      )}
    </div>
  );
};