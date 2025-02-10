import {create} from 'zustand';
import {
  fetchHealthData,
  HealthData,
  initAndGetPermissions,
} from '../utils/fetchHealthData';

interface HealthStore {
  healthLoading: boolean;
  permissionsGranted: boolean;
  healthData: HealthData;
  fetchHealth: () => Promise<void>;
}

export const useHealthStore = create<HealthStore>(set => ({
  healthLoading: true,
  permissionsGranted: false,
  healthData: new HealthData(),

  fetchHealth: async () => {
    set({healthLoading: true});
    try {
      const permissionsGranted = await initAndGetPermissions();
      const healthData = await fetchHealthData();
      set({
        permissionsGranted,
        healthData,
      });
    } catch (e) {
      console.error(e);
    } finally {
      set({healthLoading: false});
    }
  },
}));
