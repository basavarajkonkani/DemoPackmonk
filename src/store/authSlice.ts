import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: 'user' | 'admin' | null;
  adminToken?: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  role: null,
  adminToken: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = 'user';
      state.adminToken = undefined;
    },
    loginAsAdmin: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = 'admin';
      state.adminToken = `admin_token_${Date.now()}`;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.adminToken = undefined;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setRole: (state, action: PayloadAction<'user' | 'admin' | null>) => {
      state.role = action.payload;
    },
  },
});

export const { login, loginAsAdmin, logout, updateUser, setRole } = authSlice.actions;
export default authSlice.reducer;
