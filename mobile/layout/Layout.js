import { View } from 'react-native';
import Header from '../components/Header.js';
import Navbar from '../components/Navbar.js';

export default function Layout({ children }) {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <Header />
      <View className="flex-1">
        {children}
      </View>
      <Navbar />
    </View>
  );
}

