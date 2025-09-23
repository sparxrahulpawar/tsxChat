import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { socketService } from '@/services/socketService';
import { 
  updateUserStatus, 
  setUserTyping, 
  updateLastMessage, 
  incrementUnreadCount 
} from '@/store/slices/chatSlice';
import { 
  addMessage, 
  updateMessageStatus 
} from '@/store/slices/messageSlice';
import { 
  startCall, 
  endCall 
} from '@/store/slices/userSlice';
import type { Message } from '@/store/slices/messageSlice';
import type { User } from '@/store/slices/chatSlice';

export const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect to socket server
    // socketService.connect('ws://your-backend-url'); // Uncomment when backend is ready

    // Set up event listeners
    const handleMessageReceived = (message: Message) => {
      dispatch(addMessage(message));
      dispatch(updateLastMessage({
        chatId: message.chatId,
        message: {
          id: message.id,
          content: message.content,
          timestamp: message.timestamp,
          senderId: message.senderId,
        },
      }));
      dispatch(incrementUnreadCount(message.chatId));
    };

    const handleMessageStatusUpdate = (data: { messageId: string; status: Message['status'] }) => {
      // You'd need to find the chatId for this message
      // dispatch(updateMessageStatus({ ...data, chatId: 'foundChatId' }));
    };

    const handleTypingStart = (data: { userId: string; chatId: string }) => {
      dispatch(setUserTyping({ ...data, isTyping: true }));
    };

    const handleTypingStop = (data: { userId: string; chatId: string }) => {
      dispatch(setUserTyping({ ...data, isTyping: false }));
    };

    const handleUserStatusUpdate = (data: { userId: string; status: User['status']; lastSeen?: Date }) => {
      dispatch(updateUserStatus(data));
    };

    const handleIncomingCall = (data: { callId: string; from: string; type: 'voice' | 'video' }) => {
      dispatch(startCall({
        type: data.type,
        participants: [data.from],
      }));
    };

    const handleCallEnded = () => {
      dispatch(endCall());
    };

    // Register listeners
    socketService.on('messageReceived', handleMessageReceived);
    socketService.on('messageStatusUpdate', handleMessageStatusUpdate);
    socketService.on('typingStart', handleTypingStart);
    socketService.on('typingStop', handleTypingStop);
    socketService.on('userStatusUpdate', handleUserStatusUpdate);
    socketService.on('incomingCall', handleIncomingCall);
    socketService.on('callEnded', handleCallEnded);

    return () => {
      // Cleanup listeners
      socketService.off('messageReceived', handleMessageReceived);
      socketService.off('messageStatusUpdate', handleMessageStatusUpdate);
      socketService.off('typingStart', handleTypingStart);
      socketService.off('typingStop', handleTypingStop);
      socketService.off('userStatusUpdate', handleUserStatusUpdate);
      socketService.off('incomingCall', handleIncomingCall);
      socketService.off('callEnded', handleCallEnded);
      
      // socketService.disconnect(); // Uncomment if you want to disconnect on unmount
    };
  }, [dispatch]);

  return {
    sendMessage: socketService.sendMessage.bind(socketService),
    startTyping: socketService.startTyping.bind(socketService),
    stopTyping: socketService.stopTyping.bind(socketService),
    updateUserStatus: socketService.updateUserStatus.bind(socketService),
    initiateCall: socketService.initiateCall.bind(socketService),
    acceptCall: socketService.acceptCall.bind(socketService),
    declineCall: socketService.declineCall.bind(socketService),
    endCall: socketService.endCall.bind(socketService),
    joinChat: socketService.joinChat.bind(socketService),
    leaveChat: socketService.leaveChat.bind(socketService),
  };
};