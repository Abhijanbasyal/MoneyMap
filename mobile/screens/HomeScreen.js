
// screens/home/HomeScreen.js
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import Layout from '../layout/Layout.js';

export default function HomeScreen() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Layout>
      <Text className="text-primary text-2xl font-bold mb-2 text-primary-light dark:text-primary-dark">
        Welcome, {currentUser ? currentUser.username : 'Guest'}!
      </Text>
      <Text className="text-2xl font-bold text-primary-light dark:text-primary-dark">Home Page</Text>
    </Layout>
  );
}
