import React, { createContext, useEffect, useState, useMemo } from 'react';
import * as Keychain from 'react-native-keychain';
import {postLogin} from '../utils/restApi';

// Create the AuthContext
const AuthContext = createContext({
  login: async (email, password) => {},
  register: async (gender, firstName, lastName, email, password, birthDate) => {},
  logout: async () => {},
  isLoading: true,
  isLoggedIn: false,
  userId: null,
  accessToken: null,
});

// Define the AuthProvider
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log('Credentials successfully loaded for user ' + credentials.username);
          setAccessToken(JSON.parse(credentials.password).accessToken);
        } else {
          console.log('No credentials stored');
          setAccessToken(null);
        }
      } catch (error) {
        console.error("Failed to access Keychain", error);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  const authContextValue = useMemo(() => ({
    login: async (username, password) => {
      const response = await postLogin(username, password);
      if (response.status !== 200) {
        throw new Error(response.json.message  || "Login failed");
      }

      // Get tokens
      const { accessToken, refreshToken } = response.json;
      if (!accessToken || !refreshToken) {
        throw new Error("Tokens not received from server");
      }

      // Store tokens
      await Keychain.setGenericPassword(
        'HealthNavApp',
        JSON.stringify({ accessToken, refreshToken })
      );
      setAccessToken(accessToken);

      // Store user ID
      setUserId(response.json.id);
    },
    register: async (gender, firstName, lastName, email, password, birthDate) => {
      // TODO: Register using API
      const token = 'dummy-auth-token';

      await Keychain.setGenericPassword('HealthNavApp', token);
      setAccessToken(token);
    },
    logout: async () => {
      await Keychain.resetGenericPassword();
      setAccessToken(null);
    },
    isLoading,
    isLoggedIn: !!accessToken,
    userId,
    accessToken,
  }), [accessToken, userId, isLoading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


