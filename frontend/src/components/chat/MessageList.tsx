import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { markMessagesAsRead } from '@/store/slices/messageSlice';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  chatId: string;
}

export const MessageList: React.FC<MessageListProps> = ({ chatId }) => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages } = useTypedSelector((state) => state.message);
  const { currentUser } = useTypedSelector((state) => state.user);

  const chatMessages = messages[chatId] || [];

  useEffect(() => {
    // Mark messages as read when chat is opened
    if (chatMessages.length > 0) {
      dispatch(markMessagesAsRead({ chatId, userId: currentUser.id }));
    }
  }, [chatId, dispatch, currentUser.id, chatMessages.length]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  if (chatMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">👋</div>
          <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-4 space-y-4">
      {chatMessages.map((message, index) => {
        const prevMessage = index > 0 ? chatMessages[index - 1] : null;
        const nextMessage = index < chatMessages.length - 1 ? chatMessages[index + 1] : null;
        
        const isFirstInGroup = !prevMessage || prevMessage.senderId !== message.senderId;
        const isLastInGroup = !nextMessage || nextMessage.senderId !== message.senderId;
        const isSameDay = prevMessage ? 
          new Date(message.timestamp).toDateString() === new Date(prevMessage.timestamp).toDateString() : 
          false;

        return (
          <div key={message.id}>
            {/* Date separator */}
            {!isSameDay && (
              <div className="flex justify-center my-6">
                <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                  {new Date(message.timestamp).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
            
            <MessageBubble
              message={message}
              isOwn={message.senderId === currentUser.id}
              showAvatar={isFirstInGroup}
              showTime={isLastInGroup}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};