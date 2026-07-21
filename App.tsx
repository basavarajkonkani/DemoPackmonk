import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, RootState, useAppDispatch } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';
import RootNavigator from './src/navigation/RootNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import theme from './src/theme';
import { AUTH_KEY } from './src/constants';

// Keep splash screen visible while loading fonts
if (Platform.OS !== 'web') {
  ExpoSplashScreen.preventAutoHideAsync();
}

const rootStyle = Platform.OS === 'web'
  ? { flex: 1, minHeight: '100vh' as any, height: '100%' as any, display: 'flex' as any, flexDirection: 'column' as any }
  : { flex: 1 };

// Inner component that has access to Redux store
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRole = useSelector((state: RootState) => state.auth.role);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [initialRoute, setInitialRoute] = useState<'AppSelection' | 'MainTabs' | 'AdminTabs' | null>(null);
  const [webFontsReady, setWebFontsReady] = useState(Platform.OS !== 'web');
  const [isReady, setIsReady] = useState(false);
  const navigationRef = useRef<any>(null);
  
  // Use the useFonts hook for proper font loading
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome5.font,
  });

  // Check initial route - Always start at MainTabs (customer home, no login required)
  useEffect(() => {
    async function checkInitialRoute() {
      try {
        // Clear any previous auth state from AsyncStorage to start fresh
        // This ensures users land on customer home without being logged in
        console.log('App initializing - clearing AsyncStorage...');
        await AsyncStorage.removeItem(AUTH_KEY);
        console.log('AsyncStorage cleared - starting fresh');
        
        // Always start with MainTabs (customer home dashboard)
        // Users can browse, search, configure pouches, and add to cart without login
        setInitialRoute('MainTabs');
        
        console.log('App initialized - starting at MainTabs (customer home)');
        
        setIsReady(true);
      } catch (error) {
        console.warn('Error checking initial route:', error);
        setInitialRoute('MainTabs');
        setIsReady(true);
      }
    }

    checkInitialRoute();
  }, [dispatch]);

  // React to auth state changes - handle logout and admin login
  useEffect(() => {
    if (!isReady || !navigationRef.current) return;
    
    console.log('useEffect: Auth state changed:', { isAuthenticated, userRole });
    
    // If admin is logged in, navigate to AdminTabs
    if (isAuthenticated && userRole === 'admin') {
      console.log('useEffect: Admin authenticated - navigating to AdminTabs');
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'AdminTabs' }],
      });
    } 
    // If user logged out (isAuthenticated is false), return to MainTabs (customer home)
    else if (!isAuthenticated) {
      console.log('useEffect: User logged out - navigating back to MainTabs');
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  }, [isAuthenticated, userRole, isReady]);

  // For web, wait for FontAwesome to load from CDN
  useEffect(() => {
    if (Platform.OS === 'web' && fontsLoaded) {
      const timer = setTimeout(() => {
        setWebFontsReady(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      if (Platform.OS !== 'web') {
        await ExpoSplashScreen.hideAsync();
      }
    }
  }, [fontsLoaded, fontError]);

  // Show loading while fonts are loading
  if (Platform.OS === 'web' && (!fontsLoaded || !webFontsReady) && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0F8A3C" />
      </View>
    );
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!isReady || initialRoute === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0F8A3C" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <NavigationContainer ref={navigationRef} onReady={onLayoutRootView}>
          <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
          <RootNavigator initialRoute={initialRoute} />
        </NavigationContainer>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={rootStyle}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AppContent />
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
