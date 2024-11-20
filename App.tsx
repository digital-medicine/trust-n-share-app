import * as React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Keychain from 'react-native-keychain';
import AuthContext from './app/contexts/AuthContext.js';
import LoginScreen from './app/screens/Login.tsx';
import {LoginContext, useIsLoggedIn, useIsLoggedOut } from './app/contexts/LoginContext.js';
import HomeScreen from './app/screens/Home.tsx';
import RegisterScreen from './app/screens/Register.tsx';

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  groups: {
    Home: {
      if: useIsLoggedIn,
      screens: {
        Home: HomeScreen,
      },
    },
    Auth: {
      if: useIsLoggedOut,
      screens: {
        Login: {
          screen: LoginScreen,
          options: {
            headerShown: false,
          }
        },
        Register: RegisterScreen,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  React.useEffect(() => {
    const fetchCredentials = async () => {
      try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials.username
          );
          setUserToken(credentials.password);
        } else {
          console.log('No credentials stored');
          setUserToken(null);
        }
      } catch (error) {
        console.error("Failed to access Keychain", error);
        setUserToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  const authContext = React.useMemo(() => ({
    login: async (email: string, password: string) => {
      const token = 'dummy-auth-token'; // TODO: Get token from API
      await Keychain.setGenericPassword('trust-user', token);
      setUserToken(token);
      console.log('Logged in');
    },
    logout: async () => {
      await Keychain.resetGenericPassword();
      setUserToken(null);
      console.log('Logged out');
    },
  }), []);

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  const isSignedIn = userToken != null;

  return (
    <AuthContext.Provider value={authContext}>
      <LoginContext.Provider value={isSignedIn}>
        <Navigation />
      </LoginContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
