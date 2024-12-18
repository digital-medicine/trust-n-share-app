import {create} from 'zustand';

interface ServiceAvailableStore {
  available: boolean;
  setAvailable: (value: boolean) => void;
}

export const useServiceAvailableStore = create<ServiceAvailableStore>((set) => ({
  available: false,
  setAvailable: (value: boolean) => {
    set({ available: value });
  },
}));
