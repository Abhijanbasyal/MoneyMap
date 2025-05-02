import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../userSlice.js';
import notificationReducer from '../notificationSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
  },
});