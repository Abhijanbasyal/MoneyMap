import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useEffect } from 'react';
import Layout from '../layout/Layout';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import APIEndPoints from '../middleware/APIEndPoints';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  deleteNotificationSuccess,
  deleteAllNotificationsSuccess,
  markNotificationRead,
} from '../redux/notificationSlice.js';

const Notification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { notifications, unreadCount, loading } = useSelector((state) => state.notification);
  const { currentUser } = useSelector((state) => state.user);

  const fetchNotifications = async () => {
    try {
      dispatch(fetchNotificationsStart());
      const response = await axios.get(APIEndPoints.getNotifications.url, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      dispatch(fetchNotificationsSuccess(response.data.data));
    } catch (error) {
      dispatch(fetchNotificationsFailure(error.response?.data?.message || 'Failed to fetch notifications'));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch notifications',
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      const response = await axios.get(`${APIEndPoints.getNotifications.url}/${notification._id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      dispatch(markNotificationRead(notification._id));
      if (notification.redirectUrl) {
        navigation.navigate(notification.redirectUrl.split('/')[1]); // Adjust based on your routing
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to load notification',
      });
    }
  };

  const handleDeleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await axios.delete(`${APIEndPoints.deleteNotification.url}/${notificationId}`, {
                headers: {
                  Authorization: `Bearer ${currentUser.token}`,
                },
              });
              dispatch(deleteNotificationSuccess(notificationId));
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Notification deleted successfully',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to delete notification',
              });
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDeleteAllNotifications = () => {
    Alert.alert(
      'Delete All Notifications',
      'Are you sure you want to delete all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          onPress: async () => {
            try {
              await axios.delete(APIEndPoints.deleteAllNotifications.url, {
                headers: {
                  Authorization: `Bearer ${currentUser.token}`,
                },
              });
              dispatch(deleteAllNotificationsSuccess());
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'All notifications deleted successfully',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to delete notifications',
              });
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <Layout>
      <View className="flex-1 p-4 bg-background-light dark:bg-background-dark">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-primary-light dark:text-primary-dark">
            Notifications ({unreadCount} unread)
          </Text>
          {notifications.length > 0 && (
            <TouchableOpacity
              onPress={handleDeleteAllNotifications}
              className="bg-red-500 p-2 rounded"
            >
              <Text className="text-white">Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <Text className="text-center text-secondary-light dark:text-secondary-dark">
            Loading notifications...
          </Text>
        ) : notifications.length === 0 ? (
          <Text className="text-center text-secondary-light dark:text-secondary-dark">
            No notifications found
          </Text>
        ) : (
          <ScrollView className="flex-1">
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification._id}
                onPress={() => handleNotificationClick(notification)}
                className={`flex-row justify-between items-center p-4 rounded-lg mb-2 ${
                  notification.isRead ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-secondary-dark'
                }`}
              >
                <View className="flex-1">
                  <Text className={`text-lg ${notification.isRead ? 'text-gray-600 dark:text-gray-300' : 'text-primary-light dark:text-white font-semibold'}`}>
                    {notification.description}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteNotification(notification._id)}
                  disabled={loading}
                >
                  <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      <Toast />
    </Layout>
  );
};

export default Notification;