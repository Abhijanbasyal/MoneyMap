// components/ThemeToggle.js
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';
import { Sun, Moon } from 'lucide-react-native'; 
export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable onPress={toggleColorScheme}>
      <View className="w-12 h-6 bg-gray-400 rounded-full flex-row items-center p-1" style={{ justifyContent: colorScheme === 'dark' ? 'flex-end' : 'flex-start' }}>
        {colorScheme === 'dark' ? (
          <Moon size={16} color="white" />
        ) : (
          <Sun size={16} color="yellow" />
        )}
      </View>
    </Pressable>
  );
}
