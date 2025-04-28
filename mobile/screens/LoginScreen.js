import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { signInStart, signInSuccess, signInFailure } from '../redux/userSlice.js';
import APIEndPoints from '../middleware/APIEndPoints.js';

export default function LoginScreen() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const signInAPIPOINTS = APIEndPoints.sign_in.url;

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      dispatch(signInStart());
      const response = await axios.post(signInAPIPOINTS, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.data.success === false) {
        dispatch(signInFailure(response.data.message));
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: response.data.message,
        });
        return;
      }

      dispatch(signInSuccess(response.data));
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });
      navigation.replace('Home');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Sign in failed';
      dispatch(signInFailure(errMsg));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errMsg,
      });
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <Text className="text-3xl font-bold text-primary-light dark:text-primary-dark mb-6">
        Sign In
      </Text>
      
      <TextInput
        className="w-full border border-secondary-light dark:border-secondary-dark bg-white dark:bg-secondary-dark p-3 rounded-lg mb-4 text-primary-light dark:text-white"
        placeholder="Email"
        placeholderTextColor="#9694FF"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        className="w-full border border-secondary-light dark:border-secondary-dark bg-white dark:bg-secondary-dark p-3 rounded-lg mb-4 text-primary-light dark:text-white"
        placeholder="Password"
        placeholderTextColor="#9694FF"
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />
      
      <TouchableOpacity
        className={`w-full bg-primary-light dark:bg-primary-dark p-3 rounded-lg ${loading ? 'opacity-80' : ''}`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? 'Signing in...' : 'Sign In'}
        </Text>
      </TouchableOpacity>
      
      <Toast />
    </View>
  );
}