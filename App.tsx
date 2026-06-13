import React, { useState, useCallback, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/SplashScreen';
import theme from './src/theme';
import { ONBOARDING_KEY } from './src/constants';

// On web the root needs a fixed height so ScrollView has a bounded container
const rootStyle = Platform.OS === 'web'
  ? { flex: 1, height: '100vh' as any, overflow: 'hidden' as any }
  : { flex: 1 };

const App: React.FC = () => {
  const [splashDone, setSplashDone] = useState(false);
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'MainTabs' | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setInitialRoute(value === 'true' ? 'MainTabs' : 'Onboarding');
    }).catch(() => {
      setInitialRoute('Onboarding');
    });
  }, []);

  const handleSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  if (!splashDone || initialRoute === null) {
    return (
      <GestureHandlerRootView style={rootStyle}>
        <StatusBar style="light" backgroundColor="#0F8A3C" />
        <SplashScreen onFinish={handleSplashFinish} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={rootStyle}>
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
  );};

export default App;
