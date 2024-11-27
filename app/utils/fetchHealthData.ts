import {Platform} from 'react-native';
import AppleHealthKit, {HealthKitPermissions, HealthValue} from 'react-native-health';

export class HealthData {
  steps?: {date: string, value: number}[];
  energyBurned?: {date: string, value: number}[];
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
    getEnergyBurned(),
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

function getStepCount(): Promise<{ date: string, value: number }[] | null> {
  // Get step count for the last 7 days
  const options = {
    startDate: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return new Promise((resolve, _) => {
    AppleHealthKit.getDailyStepCountSamples(options, (error: string, results: Array<any>) => {
      if (error) {
        console.log('getStepCount error:', error);
        return resolve(null);
      }

      // Aggregate steps by day
      const aggregatedSteps = results.reduce((acc: Record<string, number>, item) => {
        // Extract the date (ignoring time)
        const day = new Date(item.startDate).toISOString().split('T')[0];

        // Aggregate steps for each day
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day] += item.value;

        return acc;
      }, {});

      // Convert aggregated results into an array of objects
      const stepsByDay = Object.entries(aggregatedSteps).map(([date, totalSteps]) => ({
        date,
        value: totalSteps,
      }));

      console.log('stepsByDay:', stepsByDay);

      resolve(stepsByDay);
    });
  });
}

function getEnergyBurned(): Promise<{ date: string, value: number }[] | null> {
  const options = {
    startDate: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return new Promise((resolve, _) => {
    AppleHealthKit.getActiveEnergyBurned(options, (error: string, results: HealthValue[]) => {
      if (error) {
        console.log('getActiveEnergyBurned error:', error);
        return resolve(null);
      }

      // Aggregate energy burned by day
      const aggregatedEnergy = results.reduce((acc: Record<string, number>, item) => {
        // Extract the date (ignoring time)
        const day = new Date(item.startDate).toISOString().split('T')[0];

        // Aggregate energy burned for each day
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day] += item.value;

        return acc;
      }, {});

      // Convert aggregated results into an array of objects
      const energyByDay = Object.entries(aggregatedEnergy).map(([date, totalEnergy]) => ({
        date,
        value: totalEnergy,
      }));

      resolve(energyByDay);
    });
  });
}

function fetchGoogleFitData(): Promise<HealthData> {
  // TODO: Implement Google Fit fetching
  return Promise.reject(new Error('Not implemented'));
}
