import { io, Socket } from 'socket.io-client';
import type { Message } from '@/store/slices/messageSlice';
import type { Chat, User } from '@/store/slices/chatSlice';

class SocketService {
  private socket: Socket | null = null;
  private listeners: { [event: string]: Function[] } = {};

  connect(url: string = 'ws://localhost:3001') {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.setupEventListeners();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    // Message events
    this.socket.on('message:received', (message: Message) => {
      this.emit('messageReceived', message);
    });

    this.socket.on('message:status', (data: { messageId: string; status: Message['status'] }) => {
      this.emit('messageStatusUpdate', data);
    });

    // Typing events
    this.socket.on('typing:start', (data: { userId: string; chatId: string }) => {
      this.emit('typingStart', data);
    });

    this.socket.on('typing:stop', (data: { userId: string; chatId: string }) => {
      this.emit('typingStop', data);
    });

    // User status events
    this.socket.on('user:status', (data: { userId: string; status: User['status']; lastSeen?: Date }) => {
      this.emit('userStatusUpdate', data);
    });

    // Call events
    this.socket.on('call:incoming', (data: { callId: string; from: string; type: 'voice' | 'video' }) => {
      this.emit('incomingCall', data);
    });

    this.socket.on('call:accepted', (data: { callId: string }) => {
      this.emit('callAccepted', data);
    });

    this.socket.on('call:declined', (data: { callId: string }) => {
      this.emit('callDeclined', data);
    });

    this.socket.on('call:ended', (data: { callId: string }) => {
      this.emit('callEnded', data);
    });
  }

  // Event emitter methods
  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Message methods
  sendMessage(message: Omit<Message, 'timestamp' | 'status'>) {
    if (this.socket?.connected) {
      this.socket.emit('message:send', message);
    }
  }

  updateMessageStatus(messageId: string, status: Message['status']) {
    if (this.socket?.connected) {
      this.socket.emit('message:updateStatus', { messageId, status });
    }
  }

  // Typing indicators
  startTyping(chatId: string) {
    if (this.socket?.connected) {
      this.socket.emit('typing:start', { chatId });
    }
  }

  stopTyping(chatId: string) {
    if (this.socket?.connected) {
      this.socket.emit('typing:stop', { chatId });
    }
  }

  // User status
  updateUserStatus(status: User['status']) {
    if (this.socket?.connected) {
      this.socket.emit('user:updateStatus', { status });
    }
  }

  // Call methods
  initiateCall(chatId: string, type: 'voice' | 'video') {
    if (this.socket?.connected) {
      this.socket.emit('call:initiate', { chatId, type });
    }
  }

  acceptCall(callId: string) {
    if (this.socket?.connected) {
      this.socket.emit('call:accept', { callId });
    }
  }

  declineCall(callId: string) {
    if (this.socket?.connected) {
      this.socket.emit('call:decline', { callId });
    }
  }

  endCall(callId: string) {
    if (this.socket?.connected) {
      this.socket.emit('call:end', { callId });
    }
  }

  // Join chat room
  joinChat(chatId: string) {
    if (this.socket?.connected) {
      this.socket.emit('chat:join', { chatId });
    }
  }

  // Leave chat room
  leaveChat(chatId: string) {
    if (this.socket?.connected) {
      this.socket.emit('chat:leave', { chatId });
    }
  }
}

export const socketService = new SocketService();
export default socketService;