import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MessageFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'location' | 'checklist';
  files?: MessageFile[];
  reactions?: { [emoji: string]: string[] }; // emoji -> userIds
  replyTo?: string;
  status: 'sending' | 'sent' | 'delivered' | 'seen';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  checklist?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

interface MessageState {
  messages: { [chatId: string]: Message[] };
  loading: boolean;
}

const initialState: MessageState = {
  messages: {
    '1': [
      {
        id: 'msg-1-1',
        chatId: '1',
        senderId: '2',
        senderName: 'Alice Johnson',
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 300000),
        type: 'text',
        status: 'delivered',
      },
      {
        id: 'msg-1-2',
        chatId: '1',
        senderId: '2',
        senderName: 'Alice Johnson',
        content: 'I wanted to discuss the new project with you',
        timestamp: new Date(Date.now() - 280000),
        type: 'text',
        status: 'delivered',
      },
      {
        id: 'msg-1-3',
        chatId: '1',
        senderId: '1', // Current user
        senderName: 'You',
        content: 'Hi Alice! I\'m doing great, thanks for asking.',
        timestamp: new Date(Date.now() - 120000),
        type: 'text',
        status: 'seen',
      },
      {
        id: 'msg-1-4',
        chatId: '1',
        senderId: '1',
        senderName: 'You',
        content: 'Sure, I\'d love to hear about the new project!',
        timestamp: new Date(Date.now() - 110000),
        type: 'text',
        status: 'seen',
      },
    ],
    '2': [
      {
        id: 'msg-2-1',
        chatId: '2',
        senderId: '3',
        senderName: 'Bob Smith',
        content: 'The new mockups look great!',
        timestamp: new Date(Date.now() - 900000),
        type: 'text',
        status: 'delivered',
      },
      {
        id: 'msg-2-2',
        chatId: '2',
        senderId: '4',
        senderName: 'Carol Wilson',
        content: 'Thanks! I spent a lot of time on the color scheme',
        timestamp: new Date(Date.now() - 800000),
        type: 'text',
        status: 'delivered',
      },
    ],
    '3': [
      {
        id: 'msg-3-1',
        chatId: '3',
        senderId: '5',
        senderName: 'David Brown',
        content: 'Can we schedule a meeting for tomorrow?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        status: 'delivered',
      },
    ],
  },
  loading: false,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const { chatId } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(action.payload);
    },
    updateMessageStatus: (state, action: PayloadAction<{ messageId: string; chatId: string; status: Message['status'] }>) => {
      const { messageId, chatId, status } = action.payload;
      const messages = state.messages[chatId];
      if (messages) {
        const message = messages.find(m => m.id === messageId);
        if (message) {
          message.status = status;
        }
      }
    },
    addReaction: (state, action: PayloadAction<{ messageId: string; chatId: string; emoji: string; userId: string }>) => {
      const { messageId, chatId, emoji, userId } = action.payload;
      const messages = state.messages[chatId];
      if (messages) {
        const message = messages.find(m => m.id === messageId);
        if (message) {
          if (!message.reactions) {
            message.reactions = {};
          }
          if (!message.reactions[emoji]) {
            message.reactions[emoji] = [];
          }
          if (!message.reactions[emoji].includes(userId)) {
            message.reactions[emoji].push(userId);
          }
        }
      }
    },
    removeReaction: (state, action: PayloadAction<{ messageId: string; chatId: string; emoji: string; userId: string }>) => {
      const { messageId, chatId, emoji, userId } = action.payload;
      const messages = state.messages[chatId];
      if (messages) {
        const message = messages.find(m => m.id === messageId);
        if (message?.reactions?.[emoji]) {
          message.reactions[emoji] = message.reactions[emoji].filter(id => id !== userId);
          if (message.reactions[emoji].length === 0) {
            delete message.reactions[emoji];
          }
        }
      }
    },
    markMessagesAsRead: (state, action: PayloadAction<{ chatId: string; userId: string }>) => {
      const { chatId, userId } = action.payload;
      const messages = state.messages[chatId];
      if (messages) {
        messages.forEach(message => {
          if (message.senderId !== userId && message.status !== 'seen') {
            message.status = 'seen';
          }
        });
      }
    },
  },
});

export const {
  addMessage,
  updateMessageStatus,
  addReaction,
  removeReaction,
  markMessagesAsRead,
} = messageSlice.actions;

export default messageSlice.reducer;