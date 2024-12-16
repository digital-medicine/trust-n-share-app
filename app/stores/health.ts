import { create } from 'zustand';
import fetchHealthData, { HealthData } from '../utils/fetchHealthData';

interface HealthStore {
  healthLoading: boolean;
  healthData: HealthData;
  fetchHealth: () => Promise<void>;
}

export const useHealthStore = create<HealthStore>((set) => ({
  healthLoading: true,
  healthData: new HealthData(),

  fetchHealth: async () => {
    set({ healthLoading: true });
    try {
      const data = await fetchHealthData();
      set({ healthData: data });
    } catch (e) {
      console.error(e);
    } finally {
      set({ healthLoading: false });
    }
  },
}));
