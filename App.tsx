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
import Ionicons from 'react-native-vector-icons/Ionicons';
import DataSelection from './app/screens/Share/DataSelection.tsx';

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}

const ShareStack = createNativeStackNavigator({
  screens: {
    DataSelection: {
      screen: DataSelection,
      options: {
        title: 'Data Selection',
      },
    },
    Purpose: {
      screen: () => <Text>Purpose</Text>,
      options: {
        title: 'Purpose',
      },
    },
    Institutions: {
      screen: () => <Text>Institutions</Text>,
      options: {
        title: 'Institutions',
      },
    },
    Duration: {
      screen: () => <Text>Duration</Text>,
      options: {
        title: 'Duration',
      },
    },
    Information: {
      screen: () => <Text>Information</Text>,
      options: {
        title: 'Information',
      },
    },
    PrivacyLevel: {
      screen: () => <Text>Privacy Level</Text>,
      options: {
        title: 'Privacy Level',
      },
    },
    Reputation: {
      screen: () => <Text>Reputation</Text>,
      options: {
        title: 'Reputation',
      },
    },
    Incentive: {
      screen: () => <Text>Incentive</Text>,
      options: {
        title: 'Incentive',
      },
    },
    Consumers: {
      screen: () => <Text>Consumers</Text>,
      options: {
        title: 'Consumers',
      },
    },
    Congrats: {
      screen: () => <Text>Congrats</Text>,
      options: {
        title: 'Congrats',
      },
    },
  }
});

const MainTabs = createBottomTabNavigator({
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      switch (route.name) {
        case 'Home':
          iconName = focused ? 'home' : 'home-outline';
          break;
        case 'Share':
          iconName = focused ? 'share-social' : 'share-social-outline';
          break;
        case 'Profile':
          iconName = focused ? 'person' : 'person-outline';
          break;
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#0071e3',
  }),
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerShown: false,
      }
    },
    Share: {
      screen: ShareStack,
      options: {
        headerShown: false,
      }
    },
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
