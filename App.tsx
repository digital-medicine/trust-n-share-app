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
import {useServiceAvailableStore} from './app/stores/serviceAvailable.ts';
import Unavailable from './app/screens/Unavailable.tsx';
import {translate} from './app/utils/localization.ts';

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{translate("general.loading")}</Text>
    </View>
  );
}

const ShareStack = createNativeStackNavigator({
  screenOptions: {
    headerBackTitle: translate("general.back"),
  },
  screens: {
    DataSelection: {
      screen: DataSelection,
      options: {
        title: translate("upload.data-selection.title"),
      },
    },
    Purpose: {
      screen: Purpose,
      options: {
        title: translate("upload.purpose.title"),
      },
    },
    Institutions: {
      screen: Institutions,
      options: {
        title: translate("upload.institutions.title"),
      },
    },
    Duration: {
      screen: Duration,
      options: {
        title: translate("upload.duration.title"),
      },
    },
    Information: {
      screen: Information,
      options: {
        title: translate("upload.information.title"),
      },
    },
    PrivacyLevel: {
      screen: PrivacyLevel,
      options: {
        title: translate("upload.privacy-level.title"),
      },
    },
    Reputation: {
      screen: Reputation,
      options: {
        title: translate("upload.reputation.title"),
      },
    },
    Incentives: {
      screen: Incentives,
      options: {
        title: translate("upload.incentives.title"),
      },
    },
    Consumers: {
      screen: Consumers,
      options: {
        title: translate("upload.consumers.title"),
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
        title: translate("general.home"),
      }
    },
    Upload: {
      screen: ShareStack,
      options: {
        headerShown: false,
        title: translate("general.upload"),
      }
    },
    Compensations: {
      screen: CompensationsStack,
      options: {
        headerShown: false,
        title: translate("general.compensations"),
      }
    },
    Profile: {
      screen: ProfileStack,
      options: {
        headerShown: false,
        title: translate("general.profile"),
      }
    },
  },
});

const RootStack = createNativeStackNavigator({
  groups: {
    Unavailable: {
      if: () => !useServiceAvailableStore((state) => state.available),
      screens: {
        Unavailable: {
          screen: Unavailable,
          options: {
            headerShown: false,
          },
        },
      },
    },
    Main: {
      if: () => {
        const available = useServiceAvailableStore((state) => state.available);
        const loggedIn = useAuthStore((state) => state.isLoggedIn);
        return available && loggedIn;
      },
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
      if: () => {
        const available = useServiceAvailableStore((state) => state.available);
        const loggedIn = useAuthStore((state) => state.isLoggedIn);
        return available && !loggedIn;
      },
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
