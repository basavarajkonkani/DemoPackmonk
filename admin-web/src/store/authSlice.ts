import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminUser } from '../types';

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  token?: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAdmin: (state, action: PayloadAction<AdminUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.token = `admin_token_${Date.now()}`;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = undefined;
    },
    restoreSession: (state, action: PayloadAction<{ user: AdminUser; token: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
  },
});

export const { loginAdmin, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
