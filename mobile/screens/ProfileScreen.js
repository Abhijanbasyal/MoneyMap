import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure
} from '../redux/userSlice'
import Icon from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import APIEndPoints from '../middleware/APIEndPoints.js'

const ProfileScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { currentUser, loading, error } = useSelector(state => state.user)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    expenses: currentUser.expenses || 0
  })
  const [isEditing, setIsEditing] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '', // Don't display actual password
        address: currentUser.address || '',
        expenses: currentUser.expenses || 0
      })
    }
  }, [currentUser])

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      visibilityTime: 3000,
    })
  }

  const handleUpdate = async () => {
    try {
      dispatch(updateUserStart())

      const updateData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
      }

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await axios.put(
        `${APIEndPoints.update_user.url}/${currentUser._id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      dispatch(updateUserSuccess(response.data))
      showToast('success', 'Success', 'Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile'
      dispatch(updateUserFailure(errorMessage))
      showToast('error', 'Error', errorMessage)
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())

      await axios.post(
        APIEndPoints.logOutUser.url,
        {},
        {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      dispatch(signOutUserSuccess())
      navigation.navigate('Login')
      showToast('success', 'Success', 'Logged out successfully')
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to sign out'
      dispatch(signOutUserFailure(errorMessage))
      showToast('error', 'Error', errorMessage)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart())

      await axios.delete(
        `${APIEndPoints.delete_user.url}/${currentUser._id}`,
        {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      dispatch(deleteUserSuccess())
      navigation.navigate('Login')
      showToast('success', 'Success', 'Account deleted successfully')
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete account'
      dispatch(deleteUserFailure(errorMessage))
      showToast('error', 'Error', errorMessage)
    } finally {
      setDeleteModalVisible(false)
    }
  }

  if (!currentUser) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <Text className="text-primary-light dark:text-primary-dark">Loading user data...</Text>
      </View>
    )
  }

  return (
    <>
      <ScrollView className="flex-1 bg-background-light dark:bg-background-dark p-4">
        {/* Delete Account Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white dark:bg-secondary-dark rounded-lg p-6 w-80">
              <Text className="text-lg font-bold text-primary-light dark:text-primary-dark mb-4">
                Delete Account
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </Text>
              <View className="flex-row justify-end space-x-3">
                <Pressable
                  className="px-4 py-2 rounded"
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Text className="text-gray-700 dark:text-gray-300">Cancel</Text>
                </Pressable>
                <Pressable
                  className="bg-red-500 px-4 py-2 rounded"
                  onPress={handleDeleteAccount}
                  disabled={loading}
                >
                  <Text className="text-white">Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <View className="items-center mb-6">
          <View className="bg-accent-light dark:bg-accent-dark rounded-full w-24 h-24 items-center justify-center mb-4">
            <Icon name="person" size={48} color="white" />
          </View>
          <Text className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            {formData.name}
          </Text>
        </View>

        <View className="bg-white dark:bg-secondary-dark rounded-lg p-6 mb-6 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-primary-light dark:text-primary-dark">
              Personal Information
            </Text>
            {!isEditing ? (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="bg-accent-light dark:bg-accent-dark p-2 rounded-full"
              >
                <Icon name="edit" size={20} color="white" />
              </TouchableOpacity>
            ) : (
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={handleUpdate}
                  className="bg-primary-light dark:bg-primary-dark p-2 rounded-full"
                  disabled={loading}
                >
                  <Icon name="check" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(false)
                    // Reset form to original values
                    setFormData({
                      ...formData,
                      name: currentUser.name,
                      email: currentUser.email,
                      address: currentUser.address,
                      password: ''
                    })
                  }}
                  className="bg-red-500 p-2 rounded-full"
                >
                  <Icon name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-300 mb-1">Name</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 dark:border-gray-600 rounded p-2 text-primary-light dark:text-white"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              ) : (
                <Text className="text-primary-light dark:text-white text-lg">{formData.name}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-300 mb-1">Email</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 dark:border-gray-600 rounded p-2 text-primary-light dark:text-white"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                />
              ) : (
                <Text className="text-primary-light dark:text-white text-lg">{formData.email}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-300 mb-1">Address</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 dark:border-gray-600 rounded p-2 text-primary-light dark:text-white"
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  multiline
                />
              ) : (
                <Text className="text-primary-light dark:text-white text-lg">
                  {formData.address || 'Not provided'}
                </Text>
              )}
            </View>

            {isEditing && (
              <View>
                <Text className="text-sm text-gray-500 dark:text-gray-300 mb-1">New Password</Text>
                <TextInput
                  className="border border-gray-300 dark:border-gray-600 rounded p-2 text-primary-light dark:text-white"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                  placeholder="Leave blank to keep current"
                />
              </View>
            )}
          </View>
        </View>

        <View className="bg-white dark:bg-secondary-dark rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-4">
            Expense Summary
          </Text>

          <View className="flex-row justify-between items-center p-4 bg-background-light dark:bg-background-dark rounded-lg">
            <View className="flex-row items-center">
              <Icon name="attach-money" size={24} color="#328E6E" />
              <Text className="ml-2 text-primary-light dark:text-primary-dark">Total Expenses</Text>
            </View>
            <Text className="text-xl font-bold text-primary-light dark:text-primary-dark">
              ${formData.expenses.toFixed(2)}
              {/* <div className='text-white'>
                {currentUser.expenses}
              </div> */}

            </Text>
          </View>
        </View>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-primary-light dark:bg-primary-dark rounded-lg p-4 items-center"
            disabled={loading}
          >
            <Text className="text-white font-bold">Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDeleteModalVisible(true)}
            className="bg-red-500 rounded-lg p-4 items-center"
            disabled={loading}
          >
            <Text className="text-white font-bold">Delete Account</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View className="mt-4 p-3 bg-red-100 rounded-lg">
            <Text className="text-red-600">{error}</Text>
          </View>
        )}
      </ScrollView>
      <Toast />
    </>
  )
}

export default ProfileScreen

