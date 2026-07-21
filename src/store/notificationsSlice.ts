import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as notificationsRepo from '../services/repositories/notificationsRepository';
import type { AppNotification } from '../services/repositories/notificationsRepository';

export type { AppNotification } from '../services/repositories/notificationsRepository';

interface NotificationsState {
  items: AppNotification[];
  loading: boolean;
}

const initialState: NotificationsState = { items: [], loading: false };

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async () =>
  notificationsRepo.listNotifications()
);

export const markNotificationReadThunk = createAsyncThunk('notifications/markRead', async (id: string) => {
  await notificationsRepo.markNotificationRead(id);
  return id;
});

export const markAllNotificationsReadThunk = createAsyncThunk('notifications/markAllRead', async () => {
  await notificationsRepo.markAllNotificationsRead();
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        const n = state.items.find((i) => i.id === action.payload);
        if (n) n.read = true;
      })
      .addCase(markAllNotificationsReadThunk.fulfilled, (state) => {
        state.items.forEach((n) => (n.read = true));
      });
  },
});

export default notificationsSlice.reducer;
export const selectNotifications = (state: { notifications: NotificationsState }) => state.notifications.items;
export const selectUnreadCount = (state: { notifications: NotificationsState }) =>
  state.notifications.items.filter((n) => !n.read).length;
