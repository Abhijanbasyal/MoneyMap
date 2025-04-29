import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { signUpStart, signUpSuccess, signUpFailure } from '../redux/userSlice';
import APIEndPoints from '../middleware/APIEndPoints';

export default function SignupScreen() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const signUpAPIPOINTS = APIEndPoints.sign_up.url;

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.email || !formData.password) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill all fields',
        });
        return;
      }

      if (formData.password.length < 6) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Password must be at least 6 characters',
        });
        return;
      }

      setLoading(true);
      dispatch(signUpStart());
      
      const response = await axios.post(signUpAPIPOINTS, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.data.success === false) {
        dispatch(signUpFailure(response.data.message));
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: response.data.message,
        });
        return;
      }

      dispatch(signUpSuccess(response.data));
      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: 'You can now login with your credentials',
      });
      navigation.goBack(); // Go back to login screen after successful signup
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Sign up failed';
      dispatch(signUpFailure(errMsg));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <Text className="text-3xl font-bold text-primary-light dark:text-primary-dark mb-6">
        Create Account
      </Text>
      
      <TextInput
        className="w-full border border-secondary-light dark:border-secondary-dark bg-white dark:bg-secondary-dark p-3 rounded-lg mb-4 text-primary-light dark:text-white"
        placeholder="Full Name"
        placeholderTextColor="#9694FF"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        autoCapitalize="words"
      />
      
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
        className="w-full border border-secondary-light dark:border-secondary-dark bg-white dark:bg-secondary-dark p-3 rounded-lg mb-6 text-primary-light dark:text-white"
        placeholder="Password (min 6 characters)"
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
          {loading ? 'Creating account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <View className="flex-row mt-4">
        <Text className="text-secondary-light dark:text-secondary-dark">
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-primary-light dark:text-primary-dark font-semibold">
            Login
          </Text>
        </TouchableOpacity>
      </View>
      
      <Toast />
    </View>
  );
}