import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

export default function Navbar() {
  const navigation = useNavigation();
  
  const navItems = [
    { name: 'Home', icon: 'home' },
    { name: 'Category', icon: 'grid' },
    { name: 'Expenses', icon: 'dollar-sign' },
    { name: 'RecycleBin', icon: 'trash-2' }
  ];

  return (
    <View className="flex-row justify-around items-center bg-primary-light dark:bg-primary-dark pt-3 pb-5 px-2">
      {navItems.map((item, index) => (
        <TouchableOpacity 
          key={index}
          className="items-center"
          onPress={() => navigation.navigate(item.name)}
        >
          <View className="p-3 rounded-full">
            <Icon 
              name={item.icon} 
              size={20} 
              color="#E1EEBC" 
              className="dark:text-background-dark"
            />
          </View>
          <Text className="text-background-light dark:text-background-dark text-xs mt-1">
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}