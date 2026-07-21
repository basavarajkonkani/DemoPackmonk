import React from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome5 } from '@expo/vector-icons';

// Core (tab bar) admin screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminAnalyticsScreen from '../screens/admin/AdminAnalyticsScreen';
import AdminCustomersScreen from '../screens/admin/AdminCustomersScreen';

// Secondary admin screens (reachable via Dashboard quick actions / stack push)
import AdminArtworkScreen from '../screens/admin/AdminArtworkScreen';
import AdminBannersScreen from '../screens/admin/AdminBannersScreen';
import AdminInventoryScreen from '../screens/admin/AdminInventoryScreen';
import AdminPricingScreen from '../screens/admin/AdminPricingScreen';
import AdminPromotionsScreen from '../screens/admin/AdminPromotionsScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';
import AdminSupportScreen from '../screens/admin/AdminSupportScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AdminTabs() {
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
                paddingTop: 0,
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: focused ? '#0F8A3C' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...(Platform.OS === 'web' && focused && {
                    boxShadow: '0px 2px 8px rgba(15, 138, 60, 0.2)',
                  }),
                  shadowColor: focused ? '#0F8A3C' : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: focused ? 0.15 : 0,
                  shadowRadius: 4,
                  elevation: focused ? 4 : 0,
                }}
              >
                <FontAwesome5
                  name={name as any}
                  size={20}
                  color={focused ? '#FFFFFF' : color}
                  solid={focused}
                />
              </View>
            </View>
          );
        },
        tabBarActiveTintColor: '#0F8A3C',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.select({ ios: 80, android: 62, web: 68, default: 68 }),
          paddingBottom: Platform.select({ ios: 18, android: 6, web: 6, default: 6 }),
          paddingTop: 8,
          paddingHorizontal: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 12,
          ...(Platform.OS === 'web' && {
            position: 'fixed' as any,
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 9999,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 0,
          letterSpacing: 0.2,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          paddingHorizontal: 0,
        },
        tabBarHideOnKeyboard: true,
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

/**
 * AdminTabNavigator is a Stack whose first screen is the 5-tab bar above.
 * The remaining 8 admin screens (Artwork, Banners, Inventory, Pricing,
 * Promotions, Settings, Support, Users) are pushed on top of the tab bar
 * as regular stack screens — reachable from the Dashboard's "Quick Actions"
 * grid via `navigation.navigate('AdminArtwork')` etc. This keeps the tab
 * bar to a manageable 5 items while making every admin screen reachable.
 */
export default function AdminTabNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabsHome" component={AdminTabs} />
      <Stack.Screen name="AdminArtwork" component={AdminArtworkScreen} />
      <Stack.Screen name="AdminBanners" component={AdminBannersScreen} />
      <Stack.Screen name="AdminInventory" component={AdminInventoryScreen} />
      <Stack.Screen name="AdminPricing" component={AdminPricingScreen} />
      <Stack.Screen name="AdminPromotions" component={AdminPromotionsScreen} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
      <Stack.Screen name="AdminSupport" component={AdminSupportScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
    </Stack.Navigator>
  );
}
