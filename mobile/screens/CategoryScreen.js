import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import APIEndPoints from '../middleware/APIEndPoints';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react-native';

const CategoryScreen = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(APIEndPoints.getCategories.url, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch categories',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Category name is required',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        APIEndPoints.createCategory.url,
        { name: categoryName },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      setCategoryName('');
      fetchCategories(); // Refresh the list
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Category created successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to create category',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
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
              await axios.delete(`${APIEndPoints.deleteCategory.url}/${categoryId}`, {
                headers: {
                  Authorization: `Bearer ${currentUser.token}`,
                },
              });
              fetchCategories(); // Refresh the list
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Category deleted successfully',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to delete category',
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

  return (
    <Layout>
      <View className="flex-1 p-4 bg-background-light dark:bg-background-dark">
        {/* Create Category Form */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-primary-light dark:text-primary-dark mb-2">
            Create New Category
          </Text>
          <View className="flex-row">
            <TextInput
              className="flex-1 border border-secondary-light dark:border-secondary-dark bg-white dark:bg-secondary-dark p-3 rounded-l-lg text-primary-light dark:text-white"
              placeholder="Enter category name"
              placeholderTextColor="#9694FF"
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <TouchableOpacity
              className={`bg-primary-light dark:bg-primary-dark p-3 rounded-r-lg ${loading ? 'opacity-70' : ''}`}
              onPress={handleCreateCategory}
              disabled={loading}
            >
              <Text className="text-white font-semibold">
                {loading ? 'Adding...' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories List */}
        <View className="flex-1">
          <Text className="text-xl font-bold text-primary-light dark:text-primary-dark mb-2">
            Your Categories
          </Text>
          {loading && categories.length === 0 ? (
            <Text className="text-center text-secondary-light dark:text-secondary-dark">
              Loading categories...
            </Text>
          ) : categories.length === 0 ? (
            <Text className="text-center text-secondary-light dark:text-secondary-dark">
              No categories found. Create one above!
            </Text>
          ) : (
            <ScrollView className="flex-1">
              {categories.map((category) => (
                <View
                  key={category._id}
                  className="flex-row justify-between items-center bg-white dark:bg-secondary-dark p-4 rounded-lg mb-2"
                >
                  <Text className="text-primary-light dark:text-white text-lg">
                    {category.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(category._id)}
                    disabled={loading}
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
      <Toast />
    </Layout>
  );
};

export default CategoryScreen;