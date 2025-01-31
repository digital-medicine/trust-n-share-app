import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';
import {getUser, postLogin, postRegister} from '../utils/restApi';
import {useUserStore} from './user.ts';

interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string) => void;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchCredentials: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: true,
  isLoggedIn: false,
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
        userId,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
    );

    // Update auth store state
    set({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      isLoggedIn: true,
    });

    await useUserStore.getState().updateUser(userId);
  },

  register: async (
    username: string,
    email: string,
    password: string,
  ) => {
    const response = await postRegister(username, email, password);

    console.log("Registration response", response);
    if (response.status !== 200) {
      throw new Error(response.json?.message || "Registration failed");
    }

    // Login
    await get().login(username, password);
  },

  logout: async () => {
    console.log("Logging out");

    await Keychain.resetGenericPassword();

    set({
      accessToken: null,
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

        await useUserStore.getState().updateUser(storedData.userId);
      } else {
        // No credentials found
        set({
          accessToken: null,
          refreshToken: null,
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
