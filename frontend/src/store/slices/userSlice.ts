import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  currentUser: {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'away' | 'busy' | 'offline';
  };
  isCallActive: boolean;
  callType: 'voice' | 'video' | null;
  callParticipants: string[];
}

const initialState: UserState = {
  currentUser: {
    id: '1',
    name: 'John Doe',
    avatar: '👤',
    status: 'online',
  },
  isCallActive: false,
  callType: null,
  callParticipants: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserStatus: (state, action: PayloadAction<UserState['currentUser']['status']>) => {
      state.currentUser.status = action.payload;
    },
    startCall: (state, action: PayloadAction<{ type: 'voice' | 'video'; participants: string[] }>) => {
      state.isCallActive = true;
      state.callType = action.payload.type;
      state.callParticipants = action.payload.participants;
    },
    endCall: (state) => {
      state.isCallActive = false;
      state.callType = null;
      state.callParticipants = [];
    },
    updateProfile: (state, action: PayloadAction<Partial<UserState['currentUser']>>) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
  },
});

export const { updateUserStatus, startCall, endCall, updateProfile } = userSlice.actions;
export default userSlice.reducer;