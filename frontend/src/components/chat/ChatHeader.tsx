import React from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { startCall } from '@/store/slices/userSlice';
import { Phone, Video, MoreVertical, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import type { Chat } from '@/store/slices/chatSlice';

interface ChatHeaderProps {
  chat: Chat;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const dispatch = useDispatch();
  const { currentUser } = useTypedSelector((state) => state.user);

  const otherParticipant = chat.participants[0];
  const isTyping = chat.participants.some(p => p.isTyping);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-status-online';
      case 'away': return 'bg-status-away';
      case 'busy': return 'bg-status-busy';
      default: return 'bg-status-offline';
    }
  };

  const formatLastSeen = (date: Date | undefined) => {
    if (!date) return 'never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const handleVoiceCall = () => {
    dispatch(startCall({
      type: 'voice',
      participants: chat.participants.map(p => p.id),
    }));
  };

  const handleVideoCall = () => {
    dispatch(startCall({
      type: 'video',
      participants: chat.participants.map(p => p.id),
    }));
  };

  const getStatusText = () => {
    if (isTyping) return 'typing...';
    if (chat.type === 'group') {
      return `${chat.participants.length} members`;
    }
    if (otherParticipant?.status === 'online') return 'online';
    return `last seen ${formatLastSeen(otherParticipant?.lastSeen)}`;
  };

  return (
    <div className="bg-chat-header border-b border-border p-4">
      <div className="flex items-center justify-between">
        {/* Chat Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <span className="text-lg">
                {chat.type === 'group' ? chat.avatar : otherParticipant?.avatar}
              </span>
            </Avatar>
            {chat.type === 'individual' && (
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-chat-header ${getStatusColor(otherParticipant?.status || 'offline')}`} />
            )}
          </div>
          
          <div>
            <h2 className="font-semibold text-foreground">
              {chat.type === 'group' ? chat.name : otherParticipant?.name}
            </h2>
            <p className={`text-sm ${isTyping ? 'text-primary italic' : 'text-muted-foreground'}`}>
              {getStatusText()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoiceCall}
            className="hover:bg-background-secondary"
          >
            <Phone className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVideoCall}
            className="hover:bg-background-secondary"
          >
            <Video className="w-5 h-5" />
          </Button>
          
          {chat.type === 'group' && (
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-background-secondary"
            >
              <Users className="w-5 h-5" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-background-secondary"
          >
            <Search className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-background-secondary"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};