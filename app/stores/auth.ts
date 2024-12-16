import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';
import { postLogin } from '../utils/restApi';

interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  userId: string | null;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string) => void;
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
  refreshToken: null,

  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },

  setRefreshToken: (token: string) => {
    set({ refreshToken: token });
  },

  login: async (username: string, password: string) => {
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
    // TODO: Implement actual register API call
    // Assuming a dummy token returned from a registration endpoint
    const token = 'dummy-auth-token';

    // Store the token
    await Keychain.setGenericPassword('HealthNavApp', token);

    set({
      accessToken: token,
      isLoggedIn: true,
    });
  },

  logout: async () => {
    console.log("Logging out");

    await Keychain.resetGenericPassword();

    set({
      accessToken: null,
      userId: null,
      isLoggedIn: false,
    });
  },

  fetchCredentials: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const storedData = JSON.parse(credentials.password);

        set({
          accessToken: storedData.accessToken,
          refreshToken: storedData.refreshToken,
          isLoggedIn: storedData.accessToken !== null,
          isLoading: false,
        });
      } else {
        // No credentials found
        set({
          accessToken: null,
          isLoggedIn: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Failed to access Keychain", error);
      set({
        accessToken: null,
        refreshToken: null,
        isLoggedIn: false,
        isLoading: false,
      });
    }
  },
}));
