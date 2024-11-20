import * as React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Keychain from 'react-native-keychain';

const LoginContext = React.createContext();
function useIsLoggedIn() {
  const isLoggedIn = React.useContext(LoginContext);
  return isLoggedIn;
}
function useIsLoggedOut() {
  const isLoggedIn = React.useContext(LoginContext);
  return !isLoggedIn;
}

const AuthContext = React.createContext();

function HomeScreen() {
  const { logout } = React.useContext(AuthContext);

  const handleLogout = async () => {
    logout();
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen Testest</Text>

      <TouchableHighlight onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableHighlight>
    </View>
  );
}

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}

function LoginScreen() {
  const { login } = React.useContext(AuthContext);

  const handleLogin = async () => {
    await login();
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableHighlight>
    </View>
  );
}

function RegisterScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>TODO Register</Text>
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
        Login: LoginScreen,
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
    login: async () => {
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
