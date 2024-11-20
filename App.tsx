import * as React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const LoginContext = React.createContext();
const AuthContext = React.createContext();

function useIsLoggedIn() {
  const isLoggedIn = React.useContext(LoginContext);
  return isLoggedIn;
}

function useIsLoggedOut() {
  const isLoggedIn = React.useContext(LoginContext);
  return !isLoggedIn;
}

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen Testest</Text>
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
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>TODO Login</Text>
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
    let userToken = null;
    // TODO: Fetch user token from keychain using react-native-keychain

    setUserToken(userToken);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  const isSignedIn = userToken != null;

  return (
    <LoginContext.Provider value={isSignedIn}>
      <Navigation />
    </LoginContext.Provider>
  );
}

export default App;
