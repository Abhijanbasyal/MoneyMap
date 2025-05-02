import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    fetchNotificationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
      state.loading = false;
      state.error = null;
    },
    fetchNotificationsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n._id === action.payload);
      if (notification) {
        notification.isRead = true;
        state.unreadCount = state.notifications.filter(n => !n.isRead).length;
      }
    },
    deleteNotificationSuccess: (state, action) => {
      state.notifications = state.notifications.filter(n => n._id !== action.payload);
      state.unreadCount = state.notifications.filter(n => !n.isRead).length;
    },
    deleteAllNotificationsSuccess: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount = state.notifications.filter(n => !n.isRead).length;
    },
  },
});

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  markNotificationRead,
  deleteNotificationSuccess,
  deleteAllNotificationsSuccess,
  addNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;