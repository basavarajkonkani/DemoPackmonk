import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminUser } from '../types';
import { readValue, writeValue } from '../services/storage';

const SESSION_KEY = 'session';

interface StoredSession {
  user: AdminUser;
  token: string;
}

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  token?: string;
}

// Restore session from localStorage on load so refreshing the page doesn't
// force the admin to log in again. This was previously pure in-memory state.
const storedSession = readValue<StoredSession | null>(SESSION_KEY, null);

const initialState: AuthState = {
  user: storedSession?.user ?? null,
  isAuthenticated: !!storedSession,
  token: storedSession?.token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAdmin: (state, action: PayloadAction<AdminUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.token = `admin_token_${Date.now()}`;
      writeValue<StoredSession | null>(SESSION_KEY, { user: state.user, token: state.token });
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = undefined;
      writeValue<StoredSession | null>(SESSION_KEY, null);
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
