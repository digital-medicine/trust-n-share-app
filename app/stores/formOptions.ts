import { create } from 'zustand';

interface FormOptionsState {
  formOptions: {
    incentives: string[];
    purposes: string[];
  };
  setIncentives: (incentives: string[]) => void;
  setPurposes: (purposes: string[]) => void;
}

export const useFormOptionsStore = create<FormOptionsState>((set) => ({
  formOptions: {
    incentives: [],
    purposes: [],
  },
  setIncentives: (incentives) =>
    set((state) => ({
      formOptions: {
        ...state.formOptions,
        incentives,
      },
    })),
  setPurposes: (purposes) =>
    set((state) => ({
      formOptions: {
        ...state.formOptions,
        purposes,
      },
    })),
}));
