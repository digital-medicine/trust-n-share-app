import { create } from 'zustand';
import { getUser, putUser } from '../utils/restApi';
import {useAuthStore} from './auth.ts';

interface PrivacyLevel {
  incentive: number;
  highRisk: number;
  lowRisk: number;
}

interface FormState {
  data: string[];          // Adjust these types as necessary
  purposes: string[];
  institutions: string[];
  duration: number;
  privacyLevel: PrivacyLevel;
  reputation: number;
  incentives: string[];
  consumers: string[];
}

interface FormStore {
  form: FormState;
  toggleFormSelected: (category: keyof FormState, key: string) => void;
  setDuration: (months: number) => void;
  setPrivacyIncentive: (value: number) => void;
  setPrivacyHighRisk: (value: number) => void;
  setPrivacyLowRisk: (value: number) => void;
  setReputation: (value: number) => void;
  submitForm: () => Promise<void>;
}

const initialState: FormState = {
  data: [],
  purposes: [],
  institutions: [],
  duration: 12,
  privacyLevel: {
    incentive: 5,
    highRisk: 50,
    lowRisk: 50,
  },
  reputation: 50,
  incentives: [],
  consumers: [],
};

export const useFormStore = create<FormStore>((set, get) => ({
  form: initialState,

  toggleFormSelected: (category, key) => {
    const { form } = get();

    if (!Array.isArray(form[category])) {
      throw new Error(`Invalid category: ${String(category)}`);
    }

    const updatedCategory = form[category].includes(key)
      ? form[category].filter((item: string) => item !== key)
      : [...form[category], key];

    set({
      form: {
        ...form,
        [category]: updatedCategory,
      },
    });
  },

  setDuration: (months) => {
    const { form } = get();
    set({ form: { ...form, duration: months } });
  },

  setPrivacyIncentive: (value) => {
    const { form } = get();
    set({
      form: {
        ...form,
        privacyLevel: { ...form.privacyLevel, incentive: value },
      },
    });
  },

  setPrivacyHighRisk: (value) => {
    const { form } = get();
    set({
      form: {
        ...form,
        privacyLevel: { ...form.privacyLevel, highRisk: value },
      },
    });
  },

  setPrivacyLowRisk: (value) => {
    const { form } = get();
    set({
      form: {
        ...form,
        privacyLevel: { ...form.privacyLevel, lowRisk: value },
      },
    });
  },

  setReputation: (value) => {
    const { form } = get();
    set({ form: { ...form, reputation: value } });
  },

  submitForm: async () => {
    const { form } = get();

    // Fetch user data because it's needed for the form submission
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('User not found');
    }

    // Prepare form data
    const submitData = {
      donorInfo: {
        privacyLow: form.privacyLevel.lowRisk,
        privacyHigh: form.privacyLevel.highRisk,
        privacyNone: form.privacyLevel.incentive,
        incentiveTypes: form.incentives,
        reputation: form.reputation,
        sharing: form.purposes,
      },
      _id: user._id,
      username: user.username,
      email: user.email,
      active: true,
      roles: user.roles,
    };

    // Submit
    const submitResponse = await putUser(submitData);
    if (submitResponse.error) {
      throw new Error(submitResponse.error);
    }
  },
}));
