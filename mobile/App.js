import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen.js';
import HomeScreen from './screens/HomeScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import NotificationScreen from './screens/Notification.js';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { store } from './redux/store/store.js';
import CategoryScreen from './screens/CategoryScreen.js';
import ExpensesScreen from './screens/ExpensesScreen.js';
import RecycleBinScreen from './screens/RecycleBinScreen.js';
import SignupScreen from './screens/SignupScreen.js';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider >
      <Provider store={store}>
        <NavigationContainer>
          <SafeAreaView className="flex-1 " >
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Notification" component={NotificationScreen} />
              <Stack.Screen name="Category" component={CategoryScreen} />
              <Stack.Screen name="Expenses" component={ExpensesScreen} />
              <Stack.Screen name="RecycleBin" component={RecycleBinScreen} />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </SafeAreaView>
          <Toast />
        </NavigationContainer>
      </Provider>

    </SafeAreaProvider>
  );
}
