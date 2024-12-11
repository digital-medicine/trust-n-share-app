import React, { createContext, useEffect, useState, useMemo } from 'react';
import * as Keychain from 'react-native-keychain';
import Config from 'react-native-config';

// Create the AuthContext
const AuthContext = createContext({
  login: async (email, password) => {},
  register: async (gender, firstName, lastName, email, password, birthDate) => {},
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
      setUserToken(accessToken);
    },
    register: async (gender, firstName, lastName, email, password, birthDate) => {
      // TODO: Register using API
      const token = 'dummy-auth-token';

      await Keychain.setGenericPassword('HealthNavApp', token);
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

const postLogin = async (email, password) => {
  const response = await fetch(
    Config.API_URL + '/auth/signin',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    }
  );
  console.log(response);
  const json = await response.json();
  return {
    status: response.status,
    json,
  }
}
