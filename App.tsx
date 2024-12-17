import React, {useContext, useEffect} from 'react';
import {View, Text} from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/screens/Login.tsx';
import HomeScreen from './app/screens/Home.tsx';
import RegisterScreen from './app/screens/Register.tsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './app/screens/Profile/Profile.tsx';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DataSelection from './app/screens/Share/DataSelection.tsx';
import Purpose from './app/screens/Share/Purpose.tsx';
import Institutions from './app/screens/Share/Institutions.tsx';
import Duration from './app/screens/Share/Duration.tsx';
import Information from './app/screens/Share/Information.tsx';
import PrivacyLevel from './app/screens/Share/PrivacyLevel.tsx';
import Reputation from './app/screens/Share/Reputation.tsx';
import Incentives from './app/screens/Share/Incentives.tsx';
import Consumers from './app/screens/Share/Consumers.tsx';
import Congrats from './app/screens/Share/Congrats.tsx';
import Compensations from './app/screens/Compensations/Compensations.tsx';
import LogoutButton from './app/components/LogoutButton.tsx';
import Transaction from './app/screens/Profile/Transaction.tsx';
import {useAuthStore} from './app/stores/auth.ts';
import VouchersScreen from './app/screens/Compensations/Vouchers.tsx';
import CompensationsTabIcon from './app/components/CompensationsTabIcon.tsx';

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
      screen: Purpose,
      options: {
        title: 'Purpose of Data usage',
      },
    },
    Institutions: {
      screen: Institutions,
      options: {
        title: 'Institutions',
      },
    },
    Duration: {
      screen: Duration,
      options: {
        title: 'Duration',
      },
    },
    Information: {
      screen: Information,
      options: {
        title: 'Information',
      },
    },
    PrivacyLevel: {
      screen: PrivacyLevel,
      options: {
        title: 'Level of Privacy',
      },
    },
    Reputation: {
      screen: Reputation,
      options: {
        title: 'Reputation',
      },
    },
    Incentives: {
      screen: Incentives,
      options: {
        title: 'Incentives',
      },
    },
    Consumers: {
      screen: Consumers,
      options: {
        title: 'Consumers',
      },
    },
    Congrats: {
      screen: Congrats,
      options: {
        title: 'Congrats',
        headerShown: false,
      },
    },
  }
});

const CompensationsStack = createNativeStackNavigator({
  screens: {
    Main: {
      screen: Compensations,
      options: {
        title: 'Compensations',
        headerShown: false,
      },
    },
    Vouchers: {
      screen: VouchersScreen,
      options: {
        title: 'Vouchers',
      },
    },
    Money: {
      screen: () => <Text>Money</Text>,
      options: {
        title: 'Financial Compensation',
      },
    },
    StudyResults: {
      screen: () => <Text>StudyResults</Text>,
      options: {
        title: 'Study results',
      },
    },
    PurposeResults: {
      screen: () => <Text>Purpose</Text>,
      options: {
        title: 'Purpose',
      },
    },
  }
});

const ProfileStack = createNativeStackNavigator({
  screens: {
    Main: {
      screen: ProfileScreen,
      options: {
        title: 'Profile',
        // headerShown: false,
        headerRight: LogoutButton,
      },
    },
    Transaction: {
      screen: Transaction,
      options: ({ route }) => ({
        title: route.params.name,
      }),
    }
  },
});

const MainTabs = createBottomTabNavigator({
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      switch (route.name) {
        case 'Home':
          iconName = focused ? 'home' : 'home-outline';
          break;
        case 'Upload':
          iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
          break;
        case 'Compensations':
          iconName = focused ? 'gift' : 'gift-outline';
          break;
        case 'Profile':
          iconName = focused ? 'person' : 'person-outline';
          break;
      }

      if (route.name === 'Compensations') {
        return <CompensationsTabIcon focused={focused} size={size} color={color} />;
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
    Upload: {
      screen: ShareStack,
      options: {
        headerShown: false,
      }
    },
    Compensations: {
      screen: CompensationsStack,
      options: {
        headerShown: false,
      }
    },
    Profile: {
      screen: ProfileStack,
      options: {
        headerShown: false,
      }
    },
  },
});

const RootStack = createNativeStackNavigator({
  groups: {
    Main: {
      if: () => useAuthStore((state) => state.isLoggedIn),
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
      if: () => !useAuthStore((state) => state.isLoggedIn),
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

function App() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const fetchCredentials = useAuthStore(state => state.fetchCredentials);

  useEffect(() => {
    // Load credentials on app startup
    fetchCredentials();
  }, [fetchCredentials]);

  if (isLoading) {
    return (
      <SplashScreen />
    );
  }

  return (
    <Navigation />
  );
}

export default App;
