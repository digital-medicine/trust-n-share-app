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
}

export const useUserStore = create<UserStore>(set => ({
  user: null,

  setUser: (user: User) => {
    set({user});
  },
}));

export const updateUser = async (userId: string) => {
  console.log('Updating user', userId);

  const {setUser} = useUserStore.getState();

  getUser(userId).then(response => {
    if (response.error) {
      throw new Error(response.error);
    }

    setUser({
      donorInfo: response.json.donorInfo,
      _id: response.json._id,
      username: response.json.username,
      email: response.json.email,
      active: response.json.active,
      roles: response.json.roles,
    });
  });
}
