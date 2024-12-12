import React, { createContext, useEffect, useState, useMemo } from 'react';
import * as Keychain from 'react-native-keychain';
import {postLogin} from '../utils/restApi';
import {useTokensStore} from '../stores/tokens';

// Create the AuthContext
const AuthContext = createContext({
  login: async (username, password) => {},
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
  const [userId, setUserId] = useState(null);
  const { accessToken, setAccessToken, refreshToken, setRefreshToken } = useTokensStore();

  useEffect(() => {
    console.log('AuthContext: Fetching credentials');

    const fetchCredentials = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log('Credentials successfully loaded for user ' + credentials.username);
          setAccessToken(JSON.parse(credentials.password).accessToken);
          setRefreshToken(JSON.parse(credentials.password).refreshToken);
        } else {
          console.log('No credentials stored');
          setAccessToken(null);
          setRefreshToken(null);
        }
      } catch (error) {
        console.error("Failed to access Keychain", error);
        setAccessToken(null);
        setRefreshToken(null);
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
      const newAccessToken = response.json.accessToken;
      const newRefreshToken = response.json.refreshToken;
      if (!newAccessToken || !newRefreshToken) {
        throw new Error("Tokens not received from server");
      }

      // Store tokens
      await Keychain.setGenericPassword(
        'HealthNavApp',
        JSON.stringify({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        })
      );
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

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
    isLoggedIn: accessToken !== null,
    userId,
  }), [accessToken, userId, isLoading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


