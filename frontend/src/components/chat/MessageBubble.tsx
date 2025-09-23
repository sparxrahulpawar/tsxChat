import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReaction, removeReaction } from '@/store/slices/messageSlice';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, CheckCheck, Download, Play, Pause, Image as ImageIcon, FileText, Video, Headphones } from 'lucide-react';
import type { Message } from '@/store/slices/messageSlice';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  showTime: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar,
  showTime,
}) => {
  const dispatch = useDispatch();
  const { currentUser } = useTypedSelector((state) => state.user);
  const [showReactions, setShowReactions] = useState(false);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 bg-muted-foreground rounded-full animate-pulse" />;
      case 'sent':
        return <Check className="w-3 h-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
      case 'seen':
        return <CheckCheck className="w-3 h-3 text-primary" />;
      default:
        return null;
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <Headphones className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleReaction = (emoji: string) => {
    const userReacted = message.reactions?.[emoji]?.includes(currentUser.id);
    
    if (userReacted) {
      dispatch(removeReaction({
        messageId: message.id,
        chatId: message.chatId,
        emoji,
        userId: currentUser.id,
      }));
    } else {
      dispatch(addReaction({
        messageId: message.id,
        chatId: message.chatId,
        emoji,
        userId: currentUser.id,
      }));
    }
  };

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex gap-2 max-w-xs md:max-w-md lg:max-w-lg ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwn && showAvatar && (
          <Avatar className="w-8 h-8 mt-2">
            <span className="text-sm">{message.senderName?.[0] || '?'}</span>
          </Avatar>
        )}
        {!isOwn && !showAvatar && <div className="w-8" />}

        {/* Message Content */}
        <div
          className={`relative ${isOwn ? 'ml-auto' : 'mr-auto'}`}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {/* Sender name (for group chats) */}
          {!isOwn && showAvatar && (
            <p className="text-xs text-muted-foreground mb-1 px-1">{message.senderName}</p>
          )}

          {/* Message bubble */}
          <div
            className={`
              message-bubble
              ${isOwn ? 'message-sent' : 'message-received'}
              ${message.type !== 'text' ? 'p-2' : 'px-3 py-2'}
            `}
          >
            {/* Text content */}
            {message.type === 'text' && (
              <p className="text-sm leading-relaxed break-words">{message.content}</p>
            )}

            {/* File attachments */}
            {message.files && message.files.map((file, index) => (
              <div key={index} className="mb-2 last:mb-0">
                {file.type.startsWith('image/') ? (
                  <div className="relative">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="max-w-full h-auto rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-80"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                ) : file.type.startsWith('audio/') ? (
                  <div className="flex items-center gap-2 bg-background-secondary p-3 rounded-lg">
                    <Button size="sm" variant="ghost">
                      <Play className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{getFileSize(file.size)}</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ) : file.type.startsWith('video/') ? (
                  <div className="relative">
                    <video
                      className="max-w-full h-auto rounded-lg"
                      controls
                      preload="metadata"
                    >
                      <source src={file.url} type={file.type} />
                    </video>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-background-secondary p-3 rounded-lg">
                    {getFileIcon(file.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{getFileSize(file.size)}</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Caption for files */}
            {message.files && message.content && (
              <p className="text-sm mt-2">{message.content}</p>
            )}
          </div>

          {/* Reactions */}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 px-1">
              {Object.entries(message.reactions).map(([emoji, userIds]) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`
                    text-xs px-2 py-1 rounded-full border transition-colors
                    ${userIds.includes(currentUser.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background-secondary border-border hover:bg-accent'
                    }
                  `}
                >
                  {emoji} {userIds.length}
                </button>
              ))}
            </div>
          )}

          {/* Quick reaction picker */}
          {showReactions && (
            <div className={`
              absolute top-0 ${isOwn ? 'right-full mr-2' : 'left-full ml-2'}
              bg-popover border border-border rounded-lg p-2 shadow-lg z-10
              flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity
            `}>
              {quickReactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="p-1 hover:bg-accent rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Time and status */}
          {showTime && (
            <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <span className="text-xs text-muted-foreground">
                {formatTime(message.timestamp)}
              </span>
              {isOwn && (
                <div className="flex items-center">
                  {getStatusIcon(message.status)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};