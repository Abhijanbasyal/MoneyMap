import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen.js';
import HomeScreen from './screens/HomeScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import NotificationScreen from './screens/Notification.js';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { store } from './redux/store/store.js';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider >
      <Provider store={store}>
        <NavigationContainer>
          <SafeAreaView className="flex-1" >
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Notification" component={NotificationScreen} />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </SafeAreaView>
          <Toast />
        </NavigationContainer>
      </Provider>

    </SafeAreaProvider>
  );
}
