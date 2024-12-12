import { create } from 'zustand'

export const useTokensStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setRefreshToken: (token) => set({ refreshToken: token }),
}))
