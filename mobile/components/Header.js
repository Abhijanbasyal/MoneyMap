// components/Header.js
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User, Bell, Sun, Moon } from 'lucide-react-native';
import LogoMoneyMap from '../assets/logo/Logo.png';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useColorScheme } from 'nativewind';
import Layout from '../layout/Layout';

export default function Header() {
  const navigation = useNavigation();
  const [showDropdown, setShowDropdown] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (

      <View className="h-16 flex-row items-center justify-between px-4 bg-primary-light dark:bg-primary-dark relative">
        {/* Left: Logo + Title */}
        <View className="flex-row items-center">
          <Image
            source={LogoMoneyMap}
            className="w-8 h-8 mr-2"
            resizeMode="contain"
          />
          <Text className="text-white font-bold text-xl">YourApp</Text>
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
                  onPress={() => {
                    // Handle logout logic here
                    setShowDropdown(false);
                  }}
                >
                  <Text className="text-red-500">Log Out</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Overlay to close dropdown when clicking outside */}
        {showDropdown && (
          <TouchableOpacity
            className="absolute inset-0 bg-transparent"
            onPress={() => setShowDropdown(false)}
            style={{ zIndex: 1 }}
          />
        )}
      </View>
  );
}

