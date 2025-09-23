import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { addMessage } from '@/store/slices/messageSlice';
import { updateLastMessage } from '@/store/slices/chatSlice';
import { Send, Paperclip, Smile, Mic, Image as ImageIcon, FileText, MapPin, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDropzone } from 'react-dropzone';
import EmojiPicker from 'emoji-picker-react';
import { AttachmentMenu } from './AttachmentMenu';
import type { Message, MessageFile } from '@/store/slices/messageSlice';

interface MessageInputProps {
  chatId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  const dispatch = useDispatch();
  const { currentUser } = useTypedSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    },
    noClick: true,
    multiple: true,
  });

  const handleSendMessage = () => {
    if (!message.trim() && files.length === 0) return;

    const messageFiles: MessageFile[] = files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file), // In real app, this would be uploaded to server
    }));

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: message.trim(),
      timestamp: new Date(),
      type: files.length > 0 ? (files[0].type.startsWith('image/') ? 'image' : 'file') : 'text',
      files: messageFiles.length > 0 ? messageFiles : undefined,
      status: 'sending',
    };

    dispatch(addMessage(newMessage));
    
    // Update last message in chat list
    dispatch(updateLastMessage({
      chatId,
      message: {
        id: newMessage.id,
        content: newMessage.content || `${files.length} file(s)`,
        timestamp: newMessage.timestamp,
        senderId: newMessage.senderId,
      },
    }));

    // Simulate message status updates
    setTimeout(() => {
      dispatch({ type: 'message/updateMessageStatus', payload: { messageId: newMessage.id, chatId, status: 'sent' } });
    }, 500);
    setTimeout(() => {
      dispatch({ type: 'message/updateMessageStatus', payload: { messageId: newMessage.id, chatId, status: 'delivered' } });
    }, 1000);
    setTimeout(() => {
      dispatch({ type: 'message/updateMessageStatus', payload: { messageId: newMessage.id, chatId, status: 'seen' } });
    }, 2000);

    // Reset form
    setMessage('');
    setFiles([]);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleAttachmentSelect = (files: File[], type: string) => {
    setFiles(prev => [...prev, ...files]);
  };

  const handleLocationShare = (location: { lat: number; lng: number; address: string }) => {
    const locationMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: `📍 ${location.address}`,
      timestamp: new Date(),
      type: 'location',
      location,
      status: 'sending',
    };

    dispatch(addMessage(locationMessage));
    dispatch(updateLastMessage({
      chatId,
      message: {
        id: locationMessage.id,
        content: `📍 Location shared`,
        timestamp: locationMessage.timestamp,
        senderId: locationMessage.senderId,
      },
    }));
  };

  const handleChecklistCreate = (checklist: any[]) => {
    const checklistMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: `✅ Checklist (${checklist.length} items)`,
      timestamp: new Date(),
      type: 'checklist',
      checklist,
      status: 'sending',
    };

    dispatch(addMessage(checklistMessage));
    dispatch(updateLastMessage({
      chatId,
      message: {
        id: checklistMessage.id,
        content: `✅ Checklist shared`,
        timestamp: checklistMessage.timestamp,
        senderId: checklistMessage.senderId,
      },
    }));
  };

  return (
    <div 
      {...getRootProps()}
      className={`
        border-t border-border bg-chat-header p-4 relative
        ${isDragActive ? 'bg-primary/10 border-primary' : ''}
      `}
    >
      {/* Drag overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <Paperclip className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-primary font-medium">Drop files to attach</p>
          </div>
        </div>
      )}

      {/* File previews */}
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-background-secondary p-2 rounded-lg border"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{getFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-destructive p-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-4 mb-2 z-20">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          className="hover:bg-background-secondary flex-shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Hidden file input */}
        <input
          {...getInputProps()}
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />

        {/* Message input */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="bg-background-secondary border-border pr-10 resize-none min-h-[40px] py-2"
          />
          
          {/* Emoji button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-background-tertiary"
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        {/* Voice/Send button */}
        {message.trim() || files.length > 0 ? (
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="flex-shrink-0 bg-primary hover:bg-primary-hover"
          >
            <Send className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => setIsRecording(false)}
            onMouseLeave={() => setIsRecording(false)}
            className={`
              flex-shrink-0 hover:bg-background-secondary
              ${isRecording ? 'bg-destructive text-destructive-foreground' : ''}
            `}
          >
            <Mic className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm">
          🔴 Recording... (Release to stop)
        </div>
      )}

      {/* Attachment Menu */}
      <AttachmentMenu
        isOpen={showAttachmentMenu}
        onClose={() => setShowAttachmentMenu(false)}
        onFileSelect={handleAttachmentSelect}
        onLocationShare={handleLocationShare}
        onChecklistCreate={handleChecklistCreate}
      />
    </div>
  );
};