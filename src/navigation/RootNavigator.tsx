import React from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppSelector } from '../store';

// App Selection
import AppSelectionScreen from '../screens/AppSelectionScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminTabNavigator from './AdminTabNavigator';

// Buyer App Screens
import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AccountScreen from '../screens/AccountScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import DesignStudioScreen from '../screens/DesignStudioScreen';
import RequestQuoteScreen from '../screens/RequestQuoteScreen';
import AIRecommendationsScreen from '../screens/AIRecommendationsScreen';
import ShipmentTrackingScreen from '../screens/ShipmentTrackingScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import PreCheckoutInfoScreen from '../screens/PreCheckoutInfoScreen';
import MobileVerificationScreen from '../screens/MobileVerificationScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import StreamlinedPouchConfiguratorScreen from '../screens/StreamlinedPouchConfiguratorScreen';
import OrderPlacedScreen from '../screens/OrderPlacedScreen';
import CustomOrderFlowScreen from '../screens/CustomOrderFlowScreen';
import OrderProofApprovalScreen from '../screens/OrderProofApprovalScreen';
import ProductionTimelineScreen from '../screens/ProductionTimelineScreen';

// User Screens
import ManageAddressesScreen from '../screens/user/ManageAddressesScreen';
import ManageTeamScreen from '../screens/user/ManageTeamScreen';
import SupportTicketsScreen from '../screens/user/SupportTicketsScreen';

// User Dashboard Screens
import DashboardScreen from '../screens/user/DashboardScreen';
import WalletScreen from '../screens/user/WalletScreen';
import GSTDetailsScreen from '../screens/user/GSTDetailsScreen';

// Additional User Screens
import InvoicesScreen from '../screens/InvoicesScreen';
import SavedDesignsScreen from '../screens/SavedDesignsScreen';
import WishlistScreen from '../screens/WishlistScreen';

// Ready Stock Products
import ReadyStockProductsScreen from '../screens/ReadyStockProductsScreen';
import ReadyStockProductDetailScreen from '../screens/ReadyStockProductDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BuyerTabNavigator() {
  const cartCount = useAppSelector((state) => state.cart.items.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused }) => {
          const icons: Record<string, string> = {
            Home: 'home',
            Products: 'box',
            Account: 'user',
            Cart: 'shopping-cart',
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
          display: 'flex',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.select({ ios: 85, android: 65, web: 70, default: 70 }),
          paddingBottom: Platform.select({ ios: 24, android: 8, web: 8, default: 8 }),
          paddingTop: 4,
          paddingHorizontal: Platform.select({ web: 12, default: 8 }),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 10,
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
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          paddingHorizontal: 4,
        },
        tabBarHideOnKeyboard: true,
        // Force tab bar to always render
        unmountOnBlur: false,
        lazy: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Products" component={ReadyStockProductsScreen} options={{ tabBarLabel: 'Stock Pouches' }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ tabBarLabel: 'Account' }} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: { 
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: 9,
            fontWeight: '700',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 1.5,
            borderColor: '#FFFFFF',
            top: Platform.select({ web: 10, ios: 10, android: 10 }),
            right: Platform.select({ web: 8, ios: 8, android: 8 }),
          },
        }}
      />
    </Tab.Navigator>
  );
}

interface RootNavigatorProps {
  initialRoute?: 'AppSelection' | 'MainTabs' | 'AdminTabs';
}

export default function RootNavigator({ initialRoute = 'MainTabs' }: RootNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      {/* App Selection - Entry Point */}
      <Stack.Screen name="AppSelection" component={AppSelectionScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />

      {/* ============================================
          BUYER APP STACK
          ============================================ */}
      <Stack.Screen name="MainTabs" component={BuyerTabNavigator} options={{ animationEnabled: false }} />

      {/* ============================================
          ADMIN APP STACK
          ============================================ */}
      <Stack.Screen name="AdminTabs" component={AdminTabNavigator} options={{ animationEnabled: false }} />

      {/* Auth Screens - Only shown when checkout triggers login requirement */}
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      
      {/* Buyer Screens */}
      <Stack.Screen name="Products" component={ProductsScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="DesignStudio" component={DesignStudioScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="RequestQuote" component={RequestQuoteScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="AIRecommendations" component={AIRecommendationsScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="ShipmentTracking" component={ShipmentTrackingScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="MobileVerification" component={MobileVerificationScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="PreCheckoutInfo" component={PreCheckoutInfoScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="StreamlinedPouchConfigurator" component={StreamlinedPouchConfiguratorScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="ReadyStockProducts" component={ReadyStockProductsScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="ReadyStockProductDetail" component={ReadyStockProductDetailScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="CustomOrderFlow" component={CustomOrderFlowScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} options={{ presentation: 'card', gestureEnabled: false }} />
      
      {/* User Screens */}
      <Stack.Screen name="ManageAddresses" component={ManageAddressesScreen} />
      <Stack.Screen name="ManageTeam" component={ManageTeamScreen} />
      <Stack.Screen name="SupportTickets" component={SupportTicketsScreen} />
      
      {/* User Dashboard Screens */}
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="GSTDetails" component={GSTDetailsScreen} />
      <Stack.Screen name="Invoices" component={InvoicesScreen} />
      <Stack.Screen name="SavedDesigns" component={SavedDesignsScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      
      {/* Enhanced Order Flow */}
      <Stack.Screen name="OrderProofApproval" component={OrderProofApprovalScreen} />
      <Stack.Screen name="ProductionTimeline" component={ProductionTimelineScreen} />
    </Stack.Navigator>
  );
}
