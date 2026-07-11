import React from 'react';
import { View, Platform } from 'react-native';
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
import PreCheckoutInfoScreen from '../screens/PreCheckoutInfoScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PouchConfiguratorScreen from '../screens/PouchConfiguratorScreen';
import StreamlinedPouchConfiguratorScreen from '../screens/StreamlinedPouchConfiguratorScreen';
import OrderPlacedScreen from '../screens/OrderPlacedScreen';
import CustomOrderFlowScreen from '../screens/CustomOrderFlowScreen';
import OrderProofApprovalScreen from '../screens/OrderProofApprovalScreen';
import ProductionTimelineScreen from '../screens/ProductionTimelineScreen';

// Admin Screens
import AdminTabNavigator from '../navigation/AdminTabNavigator';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminArtworkScreen from '../screens/admin/AdminArtworkScreen';
import AdminPromotionsScreen from '../screens/admin/AdminPromotionsScreen';
import AdminSupportScreen from '../screens/admin/AdminSupportScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';

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

// Additional Admin Screens
import AdminInventoryScreen from '../screens/admin/AdminInventoryScreen';
import AdminPricingScreen from '../screens/admin/AdminPricingScreen';
import AdminAnalyticsScreen from '../screens/admin/AdminAnalyticsScreen';
import AdminCustomersScreen from '../screens/admin/AdminCustomersScreen';
import AdminBannersScreen from '../screens/admin/AdminBannersScreen';

// Ready Stock Products
import ReadyStockProductsScreen from '../screens/ReadyStockProductsScreen';

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
            <View 
              style={{
                width: focused ? 56 : 48, 
                height: focused ? 56 : 48, 
                borderRadius: focused ? 18 : 16,
                backgroundColor: focused ? '#0F8A3C' : '#F3F4F6',
                alignItems: 'center', 
                justifyContent: 'center',
                shadowColor: focused ? '#0F8A3C' : '#000',
                shadowOffset: { width: 0, height: focused ? 4 : 2 },
                shadowOpacity: focused ? 0.3 : 0.1,
                shadowRadius: focused ? 8 : 4,
                elevation: focused ? 8 : 4,
                transform: [{ translateY: focused ? -8 : 0 }],
              }}
            >
              <FontAwesome5 
                name={name as any} 
                size={focused ? 24 : 20} 
                color={focused ? '#FFFFFF' : color} 
                solid={focused}
              />
            </View>
          );
        },
        tabBarActiveTintColor: '#0F8A3C',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: Platform.select({
          web: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderTopWidth: 0,
            height: 88,
            paddingBottom: 12,
            paddingTop: 12,
            paddingHorizontal: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 20,
            position: 'fixed' as any,
            bottom: 16,
            left: 16,
            right: 16,
            marginLeft: 'auto' as any,
            marginRight: 'auto' as any,
            borderRadius: 24,
            zIndex: 1000,
          } as any,
          default: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderTopWidth: 0,
            height: 88,
            paddingBottom: 12,
            paddingTop: 12,
            paddingHorizontal: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 20,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 6,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        // Force tab bar to always render
        unmountOnBlur: false,
        lazy: false,
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
          tabBarBadgeStyle: { 
            backgroundColor: '#EF4444',
            fontSize: 11,
            fontWeight: '700',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            top: 4,
            right: -4,
          },
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
      <Stack.Screen name="PreCheckoutInfo" component={PreCheckoutInfoScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="PouchConfigurator" component={PouchConfiguratorScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="StreamlinedPouchConfigurator" component={StreamlinedPouchConfiguratorScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="ReadyStockProducts" component={ReadyStockProductsScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="CustomOrderFlow" component={CustomOrderFlowScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} options={{ presentation: 'card', gestureEnabled: false }} />
      
      {/* Admin Tab Navigator - Main Admin Panel */}
      <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
      
      {/* Individual Admin Screens (accessed from Dashboard) */}
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
      <Stack.Screen name="AdminArtwork" component={AdminArtworkScreen} />
      <Stack.Screen name="AdminPromotions" component={AdminPromotionsScreen} />
      <Stack.Screen name="AdminSupport" component={AdminSupportScreen} />
      <Stack.Screen name="AdminInventory" component={AdminInventoryScreen} />
      <Stack.Screen name="AdminPricing" component={AdminPricingScreen} />
      <Stack.Screen name="AdminBanners" component={AdminBannersScreen} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
      
      {/* User Screens */}
      <Stack.Screen name="ManageAddresses" component={ManageAddressesScreen} />
      <Stack.Screen name="ManageTeam" component={ManageTeamScreen} />
      <Stack.Screen name="SupportTickets" component={SupportTicketsScreen} />
      
      {/* User Dashboard Screens */}
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
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
