import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import APIEndPoints from '../middleware/APIEndPoints';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Edit2 } from 'lucide-react-native';
import { addNotification } from '../redux/notificationSlice';

const CategoryScreen = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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


  const createNotification = async (description, redirectUrl = '/Category') => {
    try {
      const response = await axios.post(
        APIEndPoints.createNotification.url,
        {
          userId: currentUser._id,
          description,
          redirectUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(addNotification(response.data.data));
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  const handleCreateOrUpdateCategory = async () => {
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
      let response;
      if (editingCategory) {
        // Update existing category
        response = await axios.put(
          `${APIEndPoints.updateCategory.url}/${editingCategory._id}`,
          { name: categoryName },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        await createNotification(`Category "${categoryName}" updated successfully`);
      } else {
        // Create new category
        response = await axios.post(
          APIEndPoints.createCategory.url,
          { name: categoryName },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        await createNotification(`Category "${categoryName}" created successfully`);
      }

      setCategoryName('');
      setEditingCategory(null);
      fetchCategories();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: editingCategory ? 'Category updated successfully' : 'Category created successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || `Failed to ${editingCategory ? 'update' : 'create'} category`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  const handleDeleteCategory = (categoryId) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to move this category to recycle bin?',
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
              fetchCategories();
              await createNotification('Category deleted successfully');
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Category moved to recycle bin',
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
        {/* Create/Update Category Form */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-primary-light dark:text-primary-dark mb-2">
            {editingCategory ? 'Edit Category' : 'Create New Category'}
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
              onPress={handleCreateOrUpdateCategory}
              disabled={loading}
            >
              <Text className="text-white font-semibold">
                {loading ? 'Processing...' : editingCategory ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
          {editingCategory && (
            <TouchableOpacity
              className="mt-2"
              onPress={() => {
                setEditingCategory(null);
                setCategoryName('');
              }}
            >
              <Text className="text-red-500">Cancel Edit</Text>
            </TouchableOpacity>
          )}
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
                  <Text className="text-primary-light dark:text-white text-lg flex-1">
                    {category.name}
                  </Text>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleEditCategory(category)}
                      disabled={loading}
                    >
                      <Edit2 size={20} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteCategory(category._id)}
                      disabled={loading}
                    >
                      <Trash2 size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
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