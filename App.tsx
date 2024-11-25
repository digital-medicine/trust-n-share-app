import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthContext, { AuthProvider } from './app/contexts/AuthContext.js';
import LoginScreen from './app/screens/Login.tsx';
import {LoginContext, useIsLoggedIn, useIsLoggedOut} from './app/contexts/LoginContext.js';
import HomeScreen from './app/screens/Home.tsx';
import RegisterScreen from './app/screens/Register.tsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './app/screens/Profile.tsx';

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}

const MainTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const RootStack = createNativeStackNavigator({
  groups: {
    Main: {
      if: useIsLoggedIn,
      screens: {
        MainTabs: {
          screen: MainTabs,
          options: {
            headerShown: false,
          },
        },
      },
    },
    Auth: {
      if: useIsLoggedOut,
      screens: {
        Login: {
          screen: LoginScreen,
          options: {
            headerShown: false,
          },
        },
        Register: RegisterScreen,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

function AppContent() {
  const { isLoading, isLoggedIn } = useContext(AuthContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <LoginContext.Provider value={isLoggedIn}>
      <Navigation />
    </LoginContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
