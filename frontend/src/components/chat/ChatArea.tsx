import React, { useRef, useEffect } from 'react';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const ChatArea: React.FC = () => {
  const { activeChat, chats } = useTypedSelector((state) => state.chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(chat => chat.id === activeChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat]);

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-background">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to ChatApp</h2>
          <p className="text-muted-foreground">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-chat-background">
      {/* Chat Header */}
      <ChatHeader chat={currentChat} />

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList chatId={currentChat.id} />
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput chatId={currentChat.id} />
    </div>
  );
};