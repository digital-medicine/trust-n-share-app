import {Platform} from 'react-native';
import AppleHealthKit, {HealthKitPermissions, HealthValue} from 'react-native-health';

export class HealthData {
  steps?: number;
  energyBurned?: number;
  // TODO: Add more
}

export default async function fetchHealthData(): Promise<HealthData> {
  if (Platform.OS === 'ios') {
    return await fetchHealthKitData();
  }
  if (Platform.OS === 'android') {
    return await fetchGoogleFitData();
  }

  throw new Error('Unsupported platform');
}

async function fetchHealthKitData(): Promise<HealthData> {
  const data = new HealthData();

  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.StepCount,
        AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
        AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
        // ADD MORE PERMISSIONS HERE
      ],
    },
  } as HealthKitPermissions;

  await initHealthKit(permissions);

  const [steps, energyBurned] = await Promise.all([
    getStepCount(),
    getTotalEnergyBurned(),
    // ADD MORE FETCH FUNCTIONS HERE
  ]);

  if (steps !== null) data.steps = steps;
  if (energyBurned !== null) data.energyBurned = energyBurned;
  // ASSIGN MORE DATA HERE

  return data;
}

function initHealthKit(permissions: HealthKitPermissions): Promise<void> {
  return new Promise((resolve, reject) => {
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        console.log('initHealthKit error:', error);
        return reject(new Error('Cannot grant permissions!'));
      }
      resolve();
    });
  });
}

function getStepCount(): Promise<number|null> {
  return new Promise((resolve, _) => {
    AppleHealthKit.getStepCount({}, (error: string, result: HealthValue) => {
      if (error) {
        console.log('getStepCount error:', error);
        return resolve(null);
      }
      resolve(result.value);
    });
  });
}

function getActiveEnergyBurned(options): Promise<number|null> {
  return new Promise((resolve, _) => {
    AppleHealthKit.getActiveEnergyBurned(options, (error: string, results: HealthValue[]) => {
      if (error) {
        console.log('getActiveEnergyBurned error:', error);
        return resolve(null);
      }
      const totalActiveEnergy = results.reduce((sum, item) => sum + item.value, 0);
      resolve(totalActiveEnergy);
    });
  });
}

function getBasalEnergyBurned(options): Promise<number|null> {
  return new Promise((resolve, _) => {
    AppleHealthKit.getBasalEnergyBurned(options, (error: string, results: HealthValue[]) => {
      if (error) {
        console.log('getBasalEnergyBurned error:', error);
        return resolve(null);
      }
      const totalBasalEnergy = results.reduce((sum, item) => sum + item.value, 0);
      resolve(totalBasalEnergy);
    });
  });
}

async function getTotalEnergyBurned(): Promise<number|null> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const isoStartOfDay = startOfDay.toISOString();
  const options = {
    startDate: isoStartOfDay,
  }

  const [activeEnergy, basalEnergy] = await Promise.all([
    getActiveEnergyBurned(options),
    getBasalEnergyBurned(options),
  ]);

  if (activeEnergy === null || basalEnergy === null) {
    return null;
  }

  return Math.round(activeEnergy + basalEnergy);
}

function fetchGoogleFitData(): Promise<HealthData> {
  // TODO: Implement Google Fit fetching
  return Promise.reject(new Error('Not implemented'));
}
