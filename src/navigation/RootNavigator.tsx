import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppSelector } from '../store';

import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import DesignStudioScreen from '../screens/DesignStudioScreen';
import AccountScreen from '../screens/AccountScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import RequestQuoteScreen from '../screens/RequestQuoteScreen';
import AIRecommendationsScreen from '../screens/AIRecommendationsScreen';
import ShipmentTrackingScreen from '../screens/ShipmentTrackingScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PouchConfiguratorScreen from '../screens/PouchConfiguratorScreen';
import OrderPlacedScreen from '../screens/OrderPlacedScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const cartCount = useAppSelector((state) => state.cart.items.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused }) => {
          const icons: Record<string, string> = {
            Home: 'home',
            Products: 'box-open',
            Orders: 'clipboard-list',
            DesignStudio: 'palette',
            Account: 'user',
            Cart: 'shopping-cart',
          };
          const name = icons[route.name] || 'circle';

          return (
            <View style={{
              width: 38, height: 38, borderRadius: 12,
              backgroundColor: focused ? '#DCFCE7' : 'transparent',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <FontAwesome5 name={name as any} size={18} color={color} solid={focused} />
            </View>
          );
        },
        tabBarActiveTintColor: '#0F8A3C',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
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
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Products" component={ProductsScreen} options={{ tabBarLabel: 'Products' }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarLabel: 'Orders' }} />
      <Tab.Screen name="DesignStudio" component={DesignStudioScreen} options={{ tabBarLabel: 'Studio' }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ tabBarLabel: 'Account' }} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#EF4444', fontSize: 10, minWidth: 16, height: 16 },
        }}
      />
    </Tab.Navigator>
  );
}

interface RootNavigatorProps {
  initialRoute?: 'Onboarding' | 'MainTabs';
}

export default function RootNavigator({ initialRoute = 'Onboarding' }: RootNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="RequestQuote" component={RequestQuoteScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="AIRecommendations" component={AIRecommendationsScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="ShipmentTracking" component={ShipmentTrackingScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="PouchConfigurator" component={PouchConfiguratorScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} options={{ presentation: 'card', gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
