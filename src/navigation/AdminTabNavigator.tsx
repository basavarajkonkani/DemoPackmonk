import React from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminAnalyticsScreen from '../screens/admin/AdminAnalyticsScreen';
import AdminCustomersScreen from '../screens/admin/AdminCustomersScreen';

const Tab = createBottomTabNavigator();

export default function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused }) => {
          const icons: Record<string, string> = {
            AdminDashboard: 'home',
            AdminOrders: 'clipboard-list',
            AdminProducts: 'box',
            AdminAnalytics: 'chart-line',
            AdminCustomers: 'users',
          };
          const name = icons[route.name] || 'circle';

          return (
            <View 
              style={{
                alignItems: 'center', 
                justifyContent: 'center',
                paddingTop: 6,
              }}
            >
              <View
                style={{
                  width: 56, 
                  height: 32, 
                  borderRadius: 20,
                  backgroundColor: focused ? '#0F8A3C' : 'transparent',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  ...(Platform.OS === 'web' && focused && {
                    boxShadow: '0px 2px 8px rgba(15, 138, 60, 0.2)',
                  }),
                }}
              >
                <FontAwesome5 
                  name={name as any} 
                  size={18} 
                  color={focused ? '#FFFFFF' : color} 
                  solid={focused}
                />
              </View>
            </View>
          );
        },
        tabBarActiveTintColor: '#0F8A3C',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.select({ ios: 85, android: 65, default: 70 }),
          paddingBottom: Platform.select({ ios: 24, android: 8, default: 8 }),
          paddingTop: 4,
          paddingHorizontal: Platform.select({ web: 12, default: 8 }),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          paddingHorizontal: 4,
        },
        unmountOnBlur: false,
        lazy: false,
      })}
    >
      <Tab.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen} 
        options={{ tabBarLabel: 'Dashboard' }} 
      />
      <Tab.Screen 
        name="AdminOrders" 
        component={AdminOrdersScreen} 
        options={{ tabBarLabel: 'Orders' }} 
      />
      <Tab.Screen 
        name="AdminProducts" 
        component={AdminProductsScreen} 
        options={{ tabBarLabel: 'Products' }} 
      />
      <Tab.Screen 
        name="AdminAnalytics" 
        component={AdminAnalyticsScreen} 
        options={{ tabBarLabel: 'Analytics' }} 
      />
      <Tab.Screen 
        name="AdminCustomers" 
        component={AdminCustomersScreen} 
        options={{ tabBarLabel: 'Customers' }} 
      />
    </Tab.Navigator>
  );
}
