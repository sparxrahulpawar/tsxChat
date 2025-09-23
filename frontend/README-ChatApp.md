# Modern Chat App - Frontend

A feature-rich, modern chat application built with React.js, TypeScript, and Redux Toolkit. This is the frontend UI that integrates with a Socket.IO backend for real-time messaging.

## ✨ Features

### Core Chat Features
- **Real-time Messaging** - Instant message delivery with Socket.IO
- **One-on-One Chat** - Private conversations between users
- **Group Chat** - Multi-participant conversations
- **Message Status** - Sent, delivered, seen indicators
- **Typing Indicators** - Real-time typing status
- **Online/Offline Status** - User presence indicators
- **Last Seen** - When users were last active

### Rich Media Support
- **File Sharing** - Upload and share any file type
- **Image Sharing** - Image preview and display
- **Video Sharing** - Video file support with controls
- **Audio Messages** - Voice message recording and playback
- **Drag & Drop** - Easy file attachment via drag and drop
- **Emoji Picker** - Rich emoji support for messages

### Communication
- **Video Calls** - HD video calling interface
- **Voice Calls** - Crystal clear audio calls
- **Screen Sharing** - Share your screen during video calls
- **Call Controls** - Mute, video toggle, end call controls
- **Call Notifications** - Incoming call handling

### User Experience
- **Dark/Light Theme** - Modern design system
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Message Reactions** - React to messages with emojis
- **Search** - Find conversations and messages
- **Smooth Animations** - Polished user interactions
- **Keyboard Shortcuts** - Efficient navigation

## 🛠️ Tech Stack

- **React.js** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling and design system
- **Lucide React** - Icons
- **Socket.IO Client** - Real-time communication
- **React Dropzone** - File uploads
- **Emoji Picker React** - Emoji support
- **Vite** - Build tool

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Your Socket.IO backend server

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Socket.IO connection**
   Update the socket connection in `src/hooks/useSocket.ts`:
   ```typescript
   // Uncomment and update with your backend URL
   socketService.connect('ws://your-backend-url');
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/
│   └── chat/
│       ├── ChatApp.tsx           # Main chat container
│       ├── ChatSidebar.tsx       # Conversation list
│       ├── ChatArea.tsx          # Main chat area
│       ├── ChatHeader.tsx        # Chat header with controls
│       ├── MessageList.tsx       # Messages display
│       ├── MessageBubble.tsx     # Individual message component
│       ├── MessageInput.tsx      # Message composition
│       └── CallInterface.tsx     # Video/voice call UI
├── store/
│   ├── index.ts                  # Redux store configuration
│   └── slices/
│       ├── chatSlice.ts          # Chat and user management
│       ├── messageSlice.ts       # Message handling
│       └── userSlice.ts          # Current user state
├── services/
│   └── socketService.ts          # Socket.IO integration
├── hooks/
│   ├── useSocket.ts              # Socket event handling
│   └── useTypedSelector.ts       # Typed Redux selector
└── types/                        # TypeScript definitions
```

## 🔌 Backend Integration

This frontend is designed to work with a Socket.IO backend. Here are the expected socket events:

### Outgoing Events (Frontend → Backend)
- `message:send` - Send a new message
- `message:updateStatus` - Update message status
- `typing:start` / `typing:stop` - Typing indicators
- `user:updateStatus` - Update user online status
- `call:initiate` - Start a call
- `call:accept` / `call:decline` / `call:end` - Call controls
- `chat:join` / `chat:leave` - Chat room management

### Incoming Events (Backend → Frontend)
- `message:received` - New message received
- `message:status` - Message status update
- `typing:start` / `typing:stop` - User typing status
- `user:status` - User online/offline status
- `call:incoming` / `call:accepted` / `call:ended` - Call events

## 🎨 Customization

### Design System
The app uses a comprehensive design system defined in:
- `src/index.css` - CSS variables and base styles
- `tailwind.config.ts` - Tailwind configuration

### Color Scheme
Easily customize the chat app colors by updating CSS variables:
```css
:root {
  --chat-background: /* Main background */
  --message-sent: /* Your message bubble color */
  --message-received: /* Others' message bubble color */
  --status-online: /* Online indicator color */
  /* ... more variables */
}
```

### Adding Features
1. **New Message Types**: Extend the `Message` interface in `messageSlice.ts`
2. **Custom Components**: Add new components in `components/chat/`
3. **Socket Events**: Add handlers in `socketService.ts` and `useSocket.ts`

## 🔧 Configuration

### Environment Variables
Create a `.env` file for configuration:
```
VITE_SOCKET_URL=ws://localhost:3001
VITE_API_URL=http://localhost:3001/api
```

### Socket.IO Setup
Update the socket connection in `useSocket.ts`:
```typescript
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3001';
socketService.connect(SOCKET_URL);
```

## 📱 Mobile Support

The app is fully responsive and supports:
- Touch interactions
- Mobile-optimized layouts
- Swipe gestures (can be added)
- Mobile file uploads
- Mobile camera integration (can be added)

## 🚀 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions and support:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy Chatting! 💬**