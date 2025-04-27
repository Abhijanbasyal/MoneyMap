import Layout from '../layout/Layout';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <Layout>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-primary-light dark:text-primary-dark">Home Page</Text>
      </View>
    </Layout>
  );
}
