import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: Date;
  isTyping?: boolean;
}

export interface Chat {
  id: string;
  type: 'individual' | 'group';
  name?: string;
  participants: User[];
  lastMessage?: {
    id: string;
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  avatar?: string;
}

interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  loading: boolean;
}

const initialState: ChatState = {
  chats: [
    {
      id: '1',
      type: 'individual',
      participants: [
        {
          id: '2',
          name: 'Alice Johnson',
          avatar: '👩‍💼',
          status: 'online',
          lastSeen: new Date(),
        }
      ],
      lastMessage: {
        id: 'msg-1',
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 300000),
        senderId: '2',
      },
      unreadCount: 2,
    },
    {
      id: '2',
      type: 'group',
      name: 'Design Team',
      participants: [
        {
          id: '3',
          name: 'Bob Smith',
          avatar: '👨‍💻',
          status: 'away',
          lastSeen: new Date(Date.now() - 600000),
        },
        {
          id: '4',
          name: 'Carol Wilson',
          avatar: '👩‍🎨',
          status: 'online',
          lastSeen: new Date(),
        }
      ],
      lastMessage: {
        id: 'msg-2',
        content: 'The new mockups look great!',
        timestamp: new Date(Date.now() - 900000),
        senderId: '3',
      },
      unreadCount: 0,
      avatar: '🎨',
    },
    {
      id: '3',
      type: 'individual',
      participants: [
        {
          id: '5',
          name: 'David Brown',
          avatar: '👨‍🔬',
          status: 'busy',
          lastSeen: new Date(Date.now() - 1800000),
        }
      ],
      lastMessage: {
        id: 'msg-3',
        content: 'Can we schedule a meeting for tomorrow?',
        timestamp: new Date(Date.now() - 3600000),
        senderId: '5',
      },
      unreadCount: 1,
    },
  ],
  activeChat: '1',
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChat = action.payload;
      // Mark chat as read when opened
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) {
        chat.unreadCount = 0;
      }
    },
    updateUserStatus: (state, action: PayloadAction<{ userId: string; status: User['status']; lastSeen?: Date }>) => {
      state.chats.forEach(chat => {
        chat.participants.forEach(user => {
          if (user.id === action.payload.userId) {
            user.status = action.payload.status;
            if (action.payload.lastSeen) {
              user.lastSeen = action.payload.lastSeen;
            }
          }
        });
      });
    },
    setUserTyping: (state, action: PayloadAction<{ userId: string; chatId: string; isTyping: boolean }>) => {
      const chat = state.chats.find(c => c.id === action.payload.chatId);
      if (chat) {
        const user = chat.participants.find(u => u.id === action.payload.userId);
        if (user) {
          user.isTyping = action.payload.isTyping;
        }
      }
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.unshift(action.payload);
    },
    updateLastMessage: (state, action: PayloadAction<{ chatId: string; message: Chat['lastMessage'] }>) => {
      const chat = state.chats.find(c => c.id === action.payload.chatId);
      if (chat) {
        chat.lastMessage = action.payload.message;
        // Move chat to top
        const chatIndex = state.chats.findIndex(c => c.id === action.payload.chatId);
        if (chatIndex > 0) {
          const [chatToMove] = state.chats.splice(chatIndex, 1);
          state.chats.unshift(chatToMove);
        }
      }
    },
    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat && state.activeChat !== action.payload) {
        chat.unreadCount++;
      }
    },
  },
});

export const {
  setActiveChat,
  updateUserStatus,
  setUserTyping,
  addChat,
  updateLastMessage,
  incrementUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;