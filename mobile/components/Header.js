// components/Header.js
import { View, Text, Image } from 'react-native';
import { User } from 'lucide-react-native';
import ThemeToggle from './ThemeToggle.js';
import LogoMoneyMap from '../assets/logo/Logo.png';

export default function Header() {
  return (
    <View className="h-16 flex-row items-center justify-between px-4 bg-primary-light dark:bg-primary-dark">
      {/* Left: Logo + Title */}
      <View className="flex-row items-center">
        <Image
          source={LogoMoneyMap} // Put your logo in /assets/logo.png
          className="w-8 h-8 mr-2"
          resizeMode="contain"
        />
        <Text className="text-white font-bold text-xl">YourApp</Text>
      </View>

      {/* Right: Theme Toggle + Profile Icon */}
      <View className="flex-row items-center space-x-3">
        <ThemeToggle />
        <User size={24} color="white" />
      </View>
    </View>
  );
}
