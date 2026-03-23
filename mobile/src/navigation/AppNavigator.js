// mobile/src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { colors } from '../styles/theme';

import HomeScreen from '../screens/HomeScreen';
import PriestsScreen from '../screens/PriestsScreen';
import PriestDetailScreen from '../screens/PriestDetailScreen';
import VendorsScreen from '../screens/VendorsScreen';
import BookingsScreen from '../screens/BookingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AdminScreen from '../screens/AdminScreen';
import ChatbotScreen from '../screens/ChatbotScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PriestsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.white }, headerTintColor: colors.saffron, headerTitleStyle: { fontWeight: '700' } }}>
      <Stack.Screen name="PriestsList" component={PriestsScreen} options={{ title: 'Find a Priest' }} />
      <Stack.Screen name="PriestDetail" component={PriestDetailScreen} options={{ title: 'Priest Details' }} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} options={{ headerShown: true, title: '🙏 PoojaConnect Assistant' }} />
    </Stack.Navigator>
  );
}

function TabIcon({ emoji, focused }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function AppNavigator({ userRole }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.saffron,
        tabBarInactiveTintColor: colors.light,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.border, paddingBottom: 4, height: 56 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.saffron,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tab.Screen name="Home" component={HomeStack}
        options={{ headerShown: false, tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }} />
      <Tab.Screen name="Priests" component={PriestsStack}
        options={{ headerShown: false, tabBarIcon: ({ focused }) => <TabIcon emoji="🙏" focused={focused} /> }} />
      <Tab.Screen name="Vendors" component={VendorsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏪" focused={focused} /> }} />
      <Tab.Screen name="Bookings" component={BookingsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} /> }} />
      <Tab.Screen name="Alerts" component={NotificationsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔔" focused={focused} /> }} />
      {userRole === 'admin' && (
        <Tab.Screen name="Admin" component={AdminScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🛡️" focused={focused} /> }} />
      )}
    </Tab.Navigator>
  );
}
