import {create} from 'zustand';
import {getIncentives, getUser} from '../utils/restApi.ts';


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
  availableCompensations: string[];
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

  const { setUser } = useUserStore.getState();

  try {
    // Fetch user data
    const userResponse = await getUser(userId);
    if (userResponse.error) {
      throw new Error(userResponse.error);
    }

    // Fetch incentives data
    const incentivesResponse = await getIncentives();
    if (incentivesResponse.error) {
      throw new Error(incentivesResponse.error);
    }

    console.log("Fetched compensations", incentivesResponse.json.incentiveTypes);

    // Combine both results and update the store
    const combinedUserData: User = {
      donorInfo: userResponse.json.donorInfo,
      _id: userResponse.json._id,
      username: userResponse.json.username,
      email: userResponse.json.email,
      active: userResponse.json.active,
      roles: userResponse.json.roles,
      availableCompensations: incentivesResponse.json.incentiveTypes,
    };

    setUser(combinedUserData);
  } catch (error) {
    console.error("Error updating user:", error.message);
  }
};
