import React, { useEffect, useState, useCallback } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
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
  ? { flex: 1, height: '100vh' as any, overflow: 'hidden' as any }
  : { flex: 1 };

const App: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'MainTabs' | null>(null);
  const [webFontsReady, setWebFontsReady] = useState(Platform.OS !== 'web');
  
  // Use the useFonts hook for proper font loading
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome5.font,
  });

  useEffect(() => {
    async function checkInitialRoute() {
      try {
        const [auth, onboarding] = await Promise.all([
          AsyncStorage.getItem(AUTH_KEY),
          AsyncStorage.getItem(ONBOARDING_KEY),
        ]);
        setInitialRoute(auth && onboarding === 'true' ? 'MainTabs' : 'Onboarding');
      } catch (error) {
        console.warn('Error checking initial route:', error);
        setInitialRoute('Onboarding');
      }
    }

    checkInitialRoute();
  }, []);

  // For web, wait for FontAwesome to load from CDN
  useEffect(() => {
    if (Platform.OS === 'web' && fontsLoaded) {
      // Add a delay to ensure web fonts are fully loaded and cached
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

  // For web, show loading until both fonts and web fonts are ready
  if (Platform.OS === 'web' && (!fontsLoaded || !webFontsReady) && !fontError) {
    return (
      <GestureHandlerRootView style={rootStyle}>
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0F8A3C" />
        </View>
      </GestureHandlerRootView>
    );
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (initialRoute === null) {
    return (
      <GestureHandlerRootView style={rootStyle}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0F8A3C" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={rootStyle} onLayout={onLayoutRootView}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
              <RootNavigator initialRoute={initialRoute} />
            </NavigationContainer>
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
