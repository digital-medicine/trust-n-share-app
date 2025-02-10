import {create} from 'zustand';
import {getUser} from '../utils/restApi.ts';

interface User {
  donorInfo: {
    privacyLow: number;
    privacyHigh: number;
    privacyNone: number;
    incentiveTypes: string[];
    reputation: number;
    sharing: string[];
  };
  _id: string;
  username: string;
  email: string;
  active: boolean;
  roles: string[];
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (userId: string) => Promise<void>;
}

export const useUserStore = create<UserStore>(set => ({
  user: null,

  setUser: (user: User) => {
    set({user});
  },

  updateUser: async (userId: string) => {
    try {
      // Fetch user data
      const userResponse = await getUser(userId);
      if (userResponse.error) {
        throw new Error(userResponse.error);
      }

      // Update the store with the fetched data
      set({
        user: {
          donorInfo: userResponse.json.donorInfo,
          _id: userResponse.json._id,
          username: userResponse.json.username,
          email: userResponse.json.email,
          active: userResponse.json.active,
          roles: userResponse.json.roles,
        },
      });
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  },
}));
