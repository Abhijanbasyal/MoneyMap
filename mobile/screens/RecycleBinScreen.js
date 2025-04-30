import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import APIEndPoints from '../middleware/APIEndPoints';
import { useSelector } from 'react-redux';
import { Trash2, RotateCcw } from 'lucide-react-native';

const RecycleBinScreen = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [deletedExpenses, setDeletedExpenses] = useState([]); 
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const fetchDeletedCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(APIEndPoints.getDeletedCategories.url, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setDeletedCategories(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch deleted categories',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreCategory = (categoryId) => {
    Alert.alert(
      'Restore Category',
      'Are you sure you want to restore this category?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Restore',
          onPress: async () => {
            try {
              setLoading(true);
              await axios.patch(`${APIEndPoints.restoreCategory.url}/${categoryId}`, {}, {
                headers: {
                  Authorization: `Bearer ${currentUser.token}`,
                },
              });
              fetchDeletedCategories();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Category restored successfully',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to restore category',
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handlePermanentDeleteCategory = (categoryId) => {
    Alert.alert(
      'Permanent Delete',
      'Are you sure you want to permanently delete this category? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setLoading(true);
              await axios.delete(`${APIEndPoints.permanentDeleteCategory.url}/${categoryId}`, {
                headers: {
                  Authorization: `Bearer ${currentUser.token}`,
                },
              });
              fetchDeletedCategories();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Category permanently deleted',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to permanently delete category',
              });
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleRestoreAllCategories = () => {
    Alert.alert(
      'Restore All Categories',
      'Are you sure you want to restore all deleted categories?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Restore All',
          onPress: async () => {
            try {
              setLoading(true);
              await axios.patch(APIEndPoints.restoreAllCategories.url, {}, {
                headers: {
                  Authorization: `Bearer ${currentUser.token}`,
                },
              });
              fetchDeletedCategories();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'All categories restored successfully',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to restore categories',
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (activeTab === 'categories') {
      fetchDeletedCategories();
    }
    // Add logic for fetching deleted expenses when implemented
  }, [activeTab]);

  return (
    <Layout>
      <View className="flex-1 p-4 bg-background-light dark:bg-background-dark">
        {/* Tabs */}
        <View className="flex-row mb-4">
          <TouchableOpacity
            className={`flex-1 p-3 rounded-l-lg ${
              activeTab === 'categories' ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onPress={() => setActiveTab('categories')}
          >
            <Text className={`text-center font-semibold ${
              activeTab === 'categories' ? 'text-white' : 'text-primary-light dark:text-primary-dark'
            }`}>
              Categories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-3 rounded-r-lg ${
              activeTab === 'expenses' ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onPress={() => setActiveTab('expenses')}
          >
            <Text className={`text-center font-semibold ${
              activeTab === 'expenses' ? 'text-white' : 'text-primary-light dark:text-primary-dark'
            }`}>
              Expenses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Restore All Button */}
        {activeTab === 'categories' && deletedCategories.length > 0 && (
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-lg mb-4"
            onPress={handleRestoreAllCategories}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold">
              {loading ? 'Processing...' : 'Restore All Categories'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Content */}
        <View className="flex-1">
          <Text className="text-xl font-bold text-primary-light dark:text-primary-dark mb-2">
            {activeTab === 'categories' ? 'Deleted Categories' : 'Deleted Expenses'}
          </Text>
          {loading ? (
            <Text className="text-center text-secondary-light dark:text-secondary-dark">
              Loading...
            </Text>
          ) : activeTab === 'categories' ? (
            deletedCategories.length === 0 ? (
              <Text className="text-center text-secondary-light dark:text-secondary-dark">
                No deleted categories found
              </Text>
            ) : (
              <ScrollView className="flex-1">
                {deletedCategories.map((category) => (
                  <View
                    key={category._id}
                    className="flex-row justify-between items-center bg-white dark:bg-secondary-dark p-4 rounded-lg mb-2"
                  >
                    <Text className="text-primary-light dark:text-white text-lg flex-1">
                      {category.name}
                    </Text>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleRestoreCategory(category._id)}
                        disabled={loading}
                      >
                        <RotateCcw size={20} color="#22c55e" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handlePermanentDeleteCategory(category._id)}
                        disabled={loading}
                      >
                        <Trash2 size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )
          ) : (
            <Text className="text-center text-secondary-light dark:text-secondary-dark">
              Expense deletion not implemented yet
            </Text>
          )}
        </View>
      </View>
      <Toast />
    </Layout>
  );
};

export default RecycleBinScreen;