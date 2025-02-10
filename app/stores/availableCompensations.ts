import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {v4 as uuidv4} from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class Compensation {
  uuid: string;
  name: string;

  constructor(name: string) {
    this.uuid = uuidv4();
    this.name = name;
  }
}

interface AvailableCompensationsStore {
  vouchers: Compensation[];
  studyResults: Compensation[];
  purpose: Compensation[];
  money: Compensation[];

  amount: () => number;

  addVoucher: (name: string) => void;
  redeemVoucher: (uuid: string) => void;
  addStudyResult: (name: string) => void;
  redeemStudyResult: (uuid: string) => void;
  addPurpose: (name: string) => void;
  redeemPurpose: (uuid: string) => void;
  addMoney: (name: string) => void;
  redeemMoney: (uuid: string) => void;
}

export const useAvailableCompensationsStore =
  create<AvailableCompensationsStore>()(
    persist(
      (set, get) => ({
        vouchers: [],
        studyResults: [],
        purpose: [],
        money: [],

        amount: () =>
          get().vouchers.length +
          get().studyResults.length +
          get().purpose.length +
          get().money.length,

        addVoucher: (name: string) =>
          set({vouchers: [...get().vouchers, new Compensation(name)]}),
        redeemVoucher: (uuid: string) =>
          set({vouchers: get().vouchers.filter(v => v.uuid !== uuid)}),
        addStudyResult: (name: string) =>
          set({studyResults: [...get().studyResults, new Compensation(name)]}),
        redeemStudyResult: (uuid: string) =>
          set({studyResults: get().studyResults.filter(v => v.uuid !== uuid)}),
        addPurpose: (name: string) =>
          set({purpose: [...get().purpose, new Compensation(name)]}),
        redeemPurpose: (uuid: string) =>
          set({purpose: get().purpose.filter(v => v.uuid !== uuid)}),
        addMoney: (name: string) =>
          set({money: [...get().money, new Compensation(name)]}),
        redeemMoney: (uuid: string) =>
          set({money: get().money.filter(v => v.uuid !== uuid)}),
      }),
      {
        name: 'defaultAvailableCompensations', // Default key before user is known
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  );
