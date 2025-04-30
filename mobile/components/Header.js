// components/Header.js
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { User, Bell, Sun, Moon, LogOut } from 'lucide-react-native';
import LogoMoneyMap from '../assets/logo/Logo.png';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useColorScheme } from 'nativewind';
import { useDispatch } from 'react-redux';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/userSlice';
import axios from 'axios';
import Toast from 'react-native-toast-message';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import APIEndPoints from '../middleware/APIEndPoints';

export default function Header() {
  const navigation = useNavigation();
  const [showDropdown, setShowDropdown] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(signOutUserStart());
      
      await axios.post(APIEndPoints.logOutUser.url, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      // await AsyncStorage.removeItem('userToken');

      dispatch(signOutUserSuccess());

      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out',
      });

      navigation.replace('Login');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Logout failed';
      dispatch(signOutUserFailure(errorMessage));
      
      Toast.show({
        type: 'error',
        text1: 'Logout Error',
        text2: errorMessage,
      });
    } finally {
      setShowDropdown(false);
    }
  };

  return (
    <View className="relative">
      <View className="h-16 flex-row items-center justify-between px-4 bg-primary-light dark:bg-primary-dark">
        {/* Left: Logo + Title */}
        <View className="flex-row items-center">
          <Image
            source={LogoMoneyMap}
            className="w-8 h-8 mr-2 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-white font-bold text-xl">MoneyMap</Text>
        </View>

        {/* Right: Notification + Profile Icon */}
        <View className="flex-row items-center space-x-4">
          {/* Notification Icon */}
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Bell size={24} color="white" />
          </TouchableOpacity>

          {/* Profile Icon with Dropdown */}
          <View className="relative">
            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              className="p-1"
            >
              <User size={24} color="white" />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {showDropdown && (
              <View className="absolute right-0 top-10 bg-secondary-light dark:bg-secondary-dark rounded-md shadow-lg z-10 w-48">
                <TouchableOpacity
                  className="px-4 py-3 flex-row items-center border-b border-gray-200 dark:border-gray-700"
                  onPress={() => {
                    navigation.navigate('Profile');
                    setShowDropdown(false);
                  }}
                >
                  <User size={16} color={colorScheme === 'dark' ? 'white' : 'black'} className="mr-2" />
                  <Text className="text-gray-800 dark:text-white">Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="px-4 py-3 flex-row items-center border-b border-gray-200 dark:border-gray-700"
                  onPress={() => {
                    toggleColorScheme();
                    setShowDropdown(false);
                  }}
                >
                  {colorScheme === 'dark' ? (
                    <Moon size={16} color="white" className="mr-2" />
                  ) : (
                    <Sun size={16} color="black" className="mr-2" />
                  )}
                  <Text className="text-gray-800 dark:text-white">
                    {colorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="px-4 py-3 flex-row items-center"
                  onPress={handleLogout}
                >
                  <LogOut size={16} color="#ef4444" className="mr-2" />
                  <Text className="text-red-500">Log Out</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: Dimensions.get('window').height,
            backgroundColor: 'transparent',
            zIndex: 5,
          }}
          onPress={() => setShowDropdown(false)}
        />
      )}
    </View>
  );
}