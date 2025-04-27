import { View, Text, Pressable } from 'react-native';

export default function LoginScreen({ navigation }) {
  const handleLogin = () => {
    navigation.replace('Home'); 
  };

  return (
    <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
      <Text className="text-2xl font-bold text-primary-light dark:text-primary-dark mb-6">Login Page</Text>
      <Pressable onPress={handleLogin} className="px-6 py-3 bg-primary-light rounded-full">
        <Text className="text-white font-bold text-lg">Login</Text>
      </Pressable>
    </View>
  );
}
