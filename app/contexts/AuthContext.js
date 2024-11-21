import React, { createContext, useEffect, useState, useMemo } from 'react';
import * as Keychain from 'react-native-keychain';

// Create the AuthContext
const AuthContext = createContext({
  login: async (email, password) => {},
  logout: async () => {},
  isLoading: true,
  isLoggedIn: false,
});

// Define the AuthProvider
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log('Credentials successfully loaded for user ' + credentials.username);
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

  const authContextValue = useMemo(() => ({
    login: async (email, password) => {
      const token = 'dummy-auth-token'; // TODO: Replace with real API call to fetch token
      if (password === "error") {
        throw new Error('Invalid password');
      }

      await Keychain.setGenericPassword('trust-user', token);
      setUserToken(token);
    },
    register: async (gender, firstName, lastName, email, password, birthDate) => {
      const token = 'dummy-auth-token'; // TODO: Replace with real API call to fetch token
      await Keychain.setGenericPassword('trust-user', token);
      setUserToken(token);
    },
    logout: async () => {
      await Keychain.resetGenericPassword();
      setUserToken(null);
    },
    isLoading,
    isLoggedIn: !!userToken,
  }), [userToken, isLoading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
