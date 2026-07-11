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
                width: 38, 
                height: 38, 
                borderRadius: 12,
                backgroundColor: focused ? '#DCFCE7' : 'transparent',
                alignItems: 'center', 
                justifyContent: 'center',
              }}
            >
              <FontAwesome5 
                name={name as any} 
                size={18} 
                color={color} 
                solid={focused}
              />
            </View>
          );
        },
        tabBarActiveTintColor: '#0F8A3C',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: Platform.select({
          web: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            height: 72,
            paddingBottom: 10,
            paddingTop: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 10,
            position: 'fixed' as any,
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 1000,
          },
          default: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            height: 72,
            paddingBottom: 10,
            paddingTop: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 10,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 0,
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
