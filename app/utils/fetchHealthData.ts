import {Platform} from 'react-native';
import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';

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
    fetchAndAggregateData(AppleHealthKit.getDailyStepCountSamples),
    fetchAndAggregateData(AppleHealthKit.getActiveEnergyBurned),
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

function fetchAndAggregateData(
  fetchMethod: (options: any, callback: (error: string, results: Array<any>) => void) => void,
): Promise<{ date: string; value: number }[] | null> {
  const options = {
    startDate: getStartDateAWeekAgo(),
  };

  return new Promise((resolve) => {
    fetchMethod(options, (error: string, results: Array<any>) => {
      if (error) {
        console.log('fetch error:', error);
        return resolve(null);
      }

      const dataByDay = sumResultsByDay(results);
      resolve(dataByDay);
    });
  });
}

function sumResultsByDay(results: Array<any>): { date: string; value: number }[] {
  const aggregatedData = results.reduce((acc: Record<string, number>, item) => {
    const day = new Date(item.startDate).toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + item.value;
    return acc;
  }, {});

  return Object.entries(aggregatedData).map(([date, value]) => ({
    date,
    value,
  }));
}

function getStartDateAWeekAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - 6);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function fetchGoogleFitData(): Promise<HealthData> {
  // TODO: Implement Google Fit fetching
  return Promise.reject(new Error('Not implemented'));
}
