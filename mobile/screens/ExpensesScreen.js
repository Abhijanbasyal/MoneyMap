import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import APIEndPoints from '../middleware/APIEndPoints';
import { useSelector } from 'react-redux';
import { Trash2, Edit2 } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

const ExpensesScreen = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(APIEndPoints.getCategories.url, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setCategories(response.data);
      if (response.data.length > 0) {
        setCategory(response.data[0]._id);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch categories',
      });
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${APIEndPoints.getUserExpenses.url}/${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setExpenses(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch expenses',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  const handleCreateOrUpdateExpense = async () => {
    if (!amount || !category) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Amount and category are required',
      });
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Amount must be a positive number',
      });
      return;
    }

    try {
      setLoading(true);
      let response;
      if (editingExpense) {
        // Update existing expense
        response = await axios.put(
          `${APIEndPoints.updateExpense.url}/${editingExpense._id}`,
          { 
            amount: Number(amount), 
            category, 
            description 
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
      } else {
        // Create new expense
        response = await axios.post(
          APIEndPoints.createExpense.url,
          { 
            amount: Number(amount), 
            category, 
            description,
            user: currentUser._id 
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
      }

      setAmount('');
      setDescription('');
      setCategory(categories.length > 0 ? categories[0]._id : '');
      setEditingExpense(null);
      fetchExpenses();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: editingExpense ? 'Expense updated successfully' : 'Expense created successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || `Failed to ${editingExpense ? 'update' : 'create'} expense`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount.toString());
    setDescription(expense.description || '');
    setCategory(expense.category._id);
  };

  const handleDeleteExpense = (expenseId) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to move this expense to recycle bin?',
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
              await axios.delete(`${APIEndPoints.deleteExpense.url}/${expenseId}`, {
                headers: {
                  Authorization: `Bearer ${currentUser.token}`,
                },
              });
              fetchExpenses();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Expense moved to recycle bin',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to delete expense',
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
        {/* Create/Update Expense Form */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-primary-light dark:text-primary-dark mb-2">
            {editingExpense ? 'Edit Expense' : 'Create New Expense'}
          </Text>
          <View className="space-y-3">
            <TextInput
              className="border border-secondary-light dark:border-secondary-dark bg-white dark:bg-secondary-dark p-3 rounded-lg text-primary-light dark:text-white"
              placeholder="Enter amount"
              placeholderTextColor="#9694FF"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <View className="border border-secondary-light dark:border-secondary-dark bg-white dark:bg-secondary-dark rounded-lg">
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={{ color: '#fff' }}
                class='text-black'
              >
                {categories.map((cat) => (
                  <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
                ))}
              </Picker>
            </View>
            <TextInput
              className="border border-secondary-light dark:border-secondary-dark bg-white dark:bg-secondary-dark p-3 rounded-lg text-primary-light dark:text-white"
              placeholder="Enter description (optional)"
              placeholderTextColor="#9694FF"
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity
              className={`bg-primary-light dark:bg-primary-dark p-3 rounded-lg ${loading ? 'opacity-70' : ''}`}
              onPress={handleCreateOrUpdateExpense}
              disabled={loading}
            >
              <Text className="text-white font-semibold text-center">
                {loading ? 'Processing...' : editingExpense ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
            {editingExpense && (
              <TouchableOpacity
                className="mt-2 text-black"
                onPress={() => {
                  setEditingExpense(null);
                  setAmount('');
                  setDescription('');
                  setCategory(categories.length > 0 ? categories[0]._id : '');
                }}
              >
                <Text className="text-red-500 text-center">Cancel Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Expenses List */}
        <View className="flex-1">
          <Text className="text-xl font-bold text-primary-light dark:text-primary-dark mb-2">
            Your Expenses
          </Text>
          {loading && expenses.length === 0 ? (
            <Text className="text-center text-secondary-light dark:text-secondary-dark">
              Loading expenses...
            </Text>
          ) : expenses.length === 0 ? (
            <Text className="text-center text-secondary-light dark:text-secondary-dark">
              No expenses found. Create one above!
            </Text>
          ) : (
            <ScrollView className="flex-1">
              {expenses.map((expense) => (
                <View
                  key={expense._id}
                  className="flex-row justify-between items-center bg-white dark:bg-secondary-dark p-4 rounded-lg mb-2"
                >
                  <View className="flex-1">
                    <Text className="text-primary-light dark:text-white text-lg">
                      ${expense.amount} - {expense.category.name}
                    </Text>
                    <Text className="text-secondary-light dark:text-secondary-dark">
                      {expense.description || 'No description'}
                    </Text>
                    <Text className="text-secondary-light dark:text-secondary-dark text-sm">
                      {new Date(expense.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleEditExpense(expense)}
                      disabled={loading}
                    >
                      <Edit2 size={20} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteExpense(expense._id)}
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

export default ExpensesScreen;