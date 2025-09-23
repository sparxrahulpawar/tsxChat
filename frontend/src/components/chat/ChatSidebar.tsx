import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { setActiveChat } from '@/store/slices/chatSlice';
import { updateUserStatus } from '@/store/slices/userSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Settings, 
  Users, 
  MessageCircle,
  Phone,
  Video,
  Archive
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface ChatSidebarProps {
  onSettingsClick?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSettingsClick }) => {
  const dispatch = useDispatch();
  const { chats, activeChat } = useTypedSelector((state) => state.chat);
  const { currentUser } = useTypedSelector((state) => state.user);

  const formatLastSeen = (date: Date | undefined) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-status-online';
      case 'away': return 'bg-status-away';
      case 'busy': return 'bg-status-busy';
      default: return 'bg-status-offline';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-chat-header border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <span className="text-lg">{currentUser.avatar}</span>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-chat-header ${getStatusColor(currentUser.status)}`} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{currentUser.name}</h2>
              <p className="text-xs text-muted-foreground capitalize">{currentUser.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-background-secondary">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onSettingsClick}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="w-4 h-4 mr-2" />
                  New Group
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="w-4 h-4 mr-2" />
                  Archived Chats
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-background-secondary border-border"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1 justify-start gap-2">
            <MessageCircle className="w-4 h-4" />
            All Chats
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 justify-start gap-2">
            <Users className="w-4 h-4" />
            Groups
          </Button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto chat-scroll">
        {chats.map((chat) => {
          const otherParticipant = chat.participants[0];
          const isActive = activeChat === chat.id;
          const isTyping = chat.participants.some(p => p.isTyping);

          return (
            <div
              key={chat.id}
              onClick={() => dispatch(setActiveChat(chat.id))}
              className={`
                p-4 cursor-pointer transition-colors duration-200 hover:bg-background-secondary border-b border-border/50
                ${isActive ? 'bg-background-secondary' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <span className="text-lg">
                      {chat.type === 'group' ? chat.avatar : otherParticipant?.avatar}
                    </span>
                  </Avatar>
                  {chat.type === 'individual' && (
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-chat-sidebar ${getStatusColor(otherParticipant?.status || 'offline')}`} />
                  )}
                  {chat.unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center rounded-full"
                    >
                      {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                    </Badge>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground truncate">
                      {chat.type === 'group' ? chat.name : otherParticipant?.name}
                    </h3>
                    {chat.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatLastSeen(chat.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    {isTyping ? (
                      <p className="text-sm text-primary italic">typing...</p>
                    ) : chat.lastMessage ? (
                      <>
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {chat.lastMessage.content}
                        </p>
                        {chat.lastMessage.senderId === currentUser.id && (
                          <div className="flex-shrink-0">
                            {/* Message status icons */}
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className={`w-2 h-2 rounded-full ${
                                chat.lastMessage ? 'bg-primary' : 'bg-muted-foreground'
                              }`} />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No messages yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Settings Button */}
      <div className="p-4 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={onSettingsClick}>
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};