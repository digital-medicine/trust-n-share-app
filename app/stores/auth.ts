import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';
import { postLogin } from '../utils/restApi';
import { useTokensStore } from './tokens';

interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  userId: string | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    gender: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthDate: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchCredentials: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: true,
  isLoggedIn: false,
  userId: null,
  accessToken: null,

  login: async (username: string, password: string) => {
    const { setAccessToken, setRefreshToken } = useTokensStore.getState();
    const response = await postLogin(username, password);

    if (response.status !== 200) {
      throw new Error(response.json?.message || "Login failed");
    }

    const newAccessToken = response.json.accessToken;
    const newRefreshToken = response.json.refreshToken;
    const userId = response.json.id;

    if (!newAccessToken || !newRefreshToken) {
      throw new Error("Tokens not received from server");
    }

    // Store tokens in Keychain
    await Keychain.setGenericPassword(
      'HealthNavApp',
      JSON.stringify({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
    );

    // Update tokens in zustand token store
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    // Update auth store state
    set({
      accessToken: newAccessToken,
      userId: userId,
      isLoggedIn: true,
    });
  },

  register: async (
    gender: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthDate: string
  ) => {
    const { setAccessToken } = useTokensStore.getState();
    // TODO: Implement actual register API call
    // Assuming a dummy token returned from a registration endpoint
    const token = 'dummy-auth-token';

    // Store the token
    await Keychain.setGenericPassword('HealthNavApp', token);
    setAccessToken(token);

    // Update auth store state
    set({
      accessToken: token,
      isLoggedIn: true,
    });
  },

  logout: async () => {
    const { setAccessToken, setRefreshToken } = useTokensStore.getState();
    await Keychain.resetGenericPassword();
    setAccessToken(null);
    setRefreshToken(null);

    // Update auth store state
    set({
      accessToken: null,
      userId: null,
      isLoggedIn: false,
    });
  },

  fetchCredentials: async () => {
    const { setAccessToken, setRefreshToken } = useTokensStore.getState();

    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const storedData = JSON.parse(credentials.password);
        setAccessToken(storedData.accessToken);
        setRefreshToken(storedData.refreshToken);

        set({
          accessToken: storedData.accessToken,
          isLoggedIn: storedData.accessToken !== null,
          isLoading: false,
        });
      } else {
        // No credentials found
        setAccessToken(null);
        setRefreshToken(null);

        set({
          accessToken: null,
          isLoggedIn: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Failed to access Keychain", error);
      setAccessToken(null);
      setRefreshToken(null);

      set({
        accessToken: null,
        isLoggedIn: false,
        isLoading: false,
      });
    }
  },
}));
