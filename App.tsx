import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, RootState, useAppDispatch } from './src/store';
import { login } from './src/store/authSlice';
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
import theme from './src/theme';
import { ONBOARDING_KEY, AUTH_KEY } from './src/constants';

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
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'MainTabs' | null>(null);
  const [webFontsReady, setWebFontsReady] = useState(Platform.OS !== 'web');
  const [isReady, setIsReady] = useState(false);
  
  // Use the useFonts hook for proper font loading
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome5.font,
  });

  // Check initial route - Always start at Onboarding, do NOT auto-login
  useEffect(() => {
    async function checkInitialRoute() {
      try {
        // Always start with Onboarding screen
        // Users must authenticate via OTP each session
        setInitialRoute('Onboarding');
        
        console.log('App initialized - starting at Onboarding screen');
        
        setIsReady(true);
      } catch (error) {
        console.warn('Error checking initial route:', error);
        setInitialRoute('Onboarding');
        setIsReady(true);
      }
    }

    checkInitialRoute();
  }, [dispatch]);

  // React to Redux auth state changes ONLY after initial load
  // This prevents the immediate redirect on app start
  useEffect(() => {
    // Only react to auth changes after we've set the initial route
    if (!isReady) return;
    
    // Add a small delay to prevent race condition
    const timer = setTimeout(() => {
      if (!isAuthenticated && initialRoute === 'MainTabs') {
        console.log('Auth state changed to unauthenticated - switching to Onboarding');
        setInitialRoute('Onboarding');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isReady, initialRoute]);

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
      <NavigationContainer onReady={onLayoutRootView}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
        <RootNavigator key={initialRoute} initialRoute={initialRoute} />
      </NavigationContainer>
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
