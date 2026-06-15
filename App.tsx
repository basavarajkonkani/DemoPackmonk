import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoSplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';
import theme from './src/theme';
import { ONBOARDING_KEY, AUTH_KEY } from './src/constants';

const rootStyle = Platform.OS === 'web'
  ? { flex: 1, height: '100vh' as any, overflow: 'hidden' as any }
  : { flex: 1 };

const App: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'MainTabs' | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      ExpoSplashScreen.hideAsync().catch(() => {});
    }

    Promise.all([
      AsyncStorage.getItem(AUTH_KEY),
      AsyncStorage.getItem(ONBOARDING_KEY),
    ])
      .then(([auth, onboarding]) => {
        setInitialRoute(auth && onboarding === 'true' ? 'MainTabs' : 'Onboarding');
      })
      .catch(() => {
        setInitialRoute('Onboarding');
      });
  }, []);

  if (initialRoute === null) {
    return (
      <GestureHandlerRootView style={rootStyle}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
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
  );
};

export default App;
