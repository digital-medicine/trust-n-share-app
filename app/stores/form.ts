import {create} from 'zustand';
import {getConsumers, putUser} from '../utils/restApi';
import {v4 as uuidv4} from 'uuid';
import {useUserStore} from './user.ts';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAvailableCompensationsStore} from './availableCompensations.ts';

interface PrivacyLevel {
  incentive: number;
  highRisk: number;
  lowRisk: number;
}

interface FormState {
  data: string[];
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
  setPrivacyLevel: (privacyLevel: PrivacyLevel) => void;
  setReputation: (value: number) => void;
  submitForm: () => Promise<void>;
}

const initialState: FormState = {
  data: [],
  purposes: [],
  institutions: [],
  duration: Config.FORM_DURATION ? Number(Config.FORM_DURATION) : 12,
  privacyLevel: {
    incentive: Config.FORM_PRIVACY_INCENTIVE
      ? Number(Config.FORM_PRIVACY_INCENTIVE)
      : 20,
    highRisk: 50,
    lowRisk: 50,
  },
  reputation: Config.FORM_BUYER_REPUTATION
    ? Number(Config.FORM_BUYER_REPUTATION)
    : 50,
  incentives: [],
  consumers: [],
};

export const useFormStore = create<FormStore>(set => ({
  form: initialState,

  toggleFormSelected: (category: string, key: string) =>
    set(state => {
      if (!Array.isArray(state.form[category])) {
        throw new Error(`Invalid category: ${String(category)}`);
      }

      const updatedCategory = state.form[category].includes(key)
        ? state.form[category].filter((item: string) => item !== key)
        : [...state.form[category], key];

      return {
        form: {
          ...state.form,
          [category]: updatedCategory,
        },
      };
    }),

  setDuration: (months: number) =>
    set(state => ({
      form: {
        ...state.form,
        duration: months,
      },
    })),

  // setPrivacyIncentive: (value: boolean) =>
  //   set((state) => ({
  //     form: {
  //       ...state.form,
  //       privacyLevel: { ...state.form.privacyLevel, incentive: value },
  //     },
  //   })),
  //
  // setPrivacyHighRisk: (value: boolean) =>
  //   set((state) => ({
  //     form: {
  //       ...state.form,
  //       privacyLevel: { ...state.form.privacyLevel, highRisk: value },
  //     },
  //   })),
  //
  // setPrivacyLowRisk: (value: boolean) =>
  //   set((state) => ({
  //     form: {
  //       ...state.form,
  //       privacyLevel: { ...state.form.privacyLevel, lowRisk: value },
  //     },
  //   })),

  setPrivacyLevel: (privacyLevel: PrivacyLevel) =>
    set(state => ({
      form: {
        ...state.form,
        privacyLevel: privacyLevel,
      },
    })),

  setReputation: (value: number) =>
    set(state => ({
      form: {
        ...state.form,
        reputation: value,
      },
    })),

  submitForm: async () => {
    const {form} = useFormStore.getState();

    await submitUserPreferences(form);

    await appendUploadHistory(form);

    await generateCompensations(form);
  },
}));

async function submitUserPreferences(form: FormState) {
  const user = useUserStore.getState().user;
  if (!user) {
    throw new Error('User not found');
  }

  const submitData = {
    donorInfo: {
      privacyLow: form.privacyLevel.lowRisk,
      privacyHigh: form.privacyLevel.highRisk,
      privacyNone: form.privacyLevel.incentive,
      reputation: form.reputation,
      sharing: form.institutions,
    },
    _id: user._id,
    username: user.username,
    email: user.email,
    active: true,
    roles: user.roles,
  };

  const submitResponse = await putUser(submitData);
  if (submitResponse.error) {
    throw new Error(submitResponse.error);
  }
}

async function appendUploadHistory(form: FormState) {
  const uploadUuid = uuidv4();

  // Get username
  const user = useUserStore.getState().user;
  if (!user) {
    throw new Error('User not found');
  }
  const username = user.username;

  // Get current upload history
  const currentHistory = await AsyncStorage.getItem(username + 'uploadHistory');

  // Create new upload history
  let newHistory;
  if (currentHistory === null) {
    newHistory = {
      uploads: {
        [uploadUuid]: {
          form: form,
          timestamp: Date.now(),
        },
      },
    };
  } else {
    newHistory = JSON.parse(currentHistory);
    newHistory.uploads[uploadUuid] = {
      form: form,
      timestamp: Date.now(),
    };
  }

  // Save new upload history
  await AsyncStorage.setItem(
    username + 'uploadHistory',
    JSON.stringify(newHistory),
  );
}

async function generateCompensations(form: FormState) {
  // Fetch all consumer names from API
  const consumersResponse = await getConsumers();
  if (consumersResponse.error) {
    throw new Error(consumersResponse.error);
  }
  const allConsumers = consumersResponse.json.consumer;

  for (const consumer of form.consumers) {
    // Roll the dice if the consumer buys the data
    if (Math.random() > Number(Config.CONSUMER_BUY_CHANCE ?? 0.5)) {
      continue;
    }

    // Find the consumer
    const consumerName: string = allConsumers.find(
      c => c._id === consumer,
    ).username;
    if (!consumerName) {
      console.warn(`Could not find consumer: ${consumerName}`);
      continue;
    }

    // Find a random delay for the compensations
    let max = Number(Config.COMPENSATION_DELAY_MAX ?? 5000);
    const min = Number(Config.COMPENSATION_DELAY_MIN ?? 1000);
    const delay = Math.floor(Math.random() * (max - min)) + min;
    console.log(
      'generateCompensations delay',
      delay,
      '(max:',
      max,
      'min:',
      min,
      ')',
    );

    // Generate compensations
    const addVoucher = useAvailableCompensationsStore.getState().addVoucher;
    const addMoney = useAvailableCompensationsStore.getState().addMoney;

    // choose one random element from form.incentives
    const randomIncentive =
      form.incentives[Math.floor(Math.random() * form.incentives.length)];

    setTimeout(() => {
      console.log('consumer ' + consumerName + ' buys the data');
      if (randomIncentive == 'cash') {
        addMoney(randomIncentive);
      } else {
        addVoucher(randomIncentive);
      }
    }, delay);
  }
}
