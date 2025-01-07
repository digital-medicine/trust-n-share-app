import {Platform} from 'react-native';
import type {HealthKitPermissions} from 'react-native-health';
import {
  initialize,
  requestPermission,
  readRecords, getGrantedPermissions, aggregateGroupByDuration,
} from 'react-native-health-connect';

let AppleHealthKit: typeof import('react-native-health').default | null = null;
if (Platform.OS === 'ios') {
  AppleHealthKit = require('react-native-health');
}

export class HealthData {
  steps?: {date: string, value: number}[];
  energyBurned?: {date: string, value: number}[];
  // TODO: Add more
}

export default async function fetchHealthData(): Promise<HealthData> {
  console.log("Fetching health data for platform", Platform.OS);

  if (Platform.OS === 'ios') {
    return await fetchHealthKitData();
  }
  if (Platform.OS === 'android') {
    return await fetchHealthConnectData();
  }

  throw new Error('Unsupported platform');
}

async function fetchHealthKitData(): Promise<HealthData> {
  if (!AppleHealthKit) {
    throw new Error('Could not load HealthKit');
  }

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

  const [
    steps,
    activeEnergyBurned,
    basalEnergyBurned,
  ] = await Promise.all([
    fetchAndAggregateData(AppleHealthKit.getDailyStepCountSamples),
    fetchAndAggregateData(AppleHealthKit.getActiveEnergyBurned),
    fetchAndAggregateData(AppleHealthKit.getBasalEnergyBurned),
    // ADD MORE FETCH FUNCTIONS HERE
  ]);

  // Combine active and basal energy burned
  const energyBurned = activeEnergyBurned?.map((entry, index) => {
    return {
      date: entry.date,
      value: entry.value + (basalEnergyBurned?.[index]?.value ?? 0),
    };
  });

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

async function fetchHealthConnectData(): Promise<HealthData> {
  const data = new HealthData();

  // initialize the client
  const isInitialized = await initialize();
  if (!isInitialized) {
    throw new Error('Could not initialize Health Connect');
  }

  // request permissions
  const grantedPermissions = await requestPermission([
    { accessType: 'read', recordType: 'TotalCaloriesBurned' },
    { accessType: 'read', recordType: 'Steps' },
  ]);
  const permissionsOkay = ["Steps", "TotalCaloriesBurned"]
    .every(recordType => grantedPermissions
      .map(permission => permission.recordType)
      .includes(recordType)
    );
  if (!permissionsOkay) {
    throw new Error('Could not grant permissions');
  }

  // Read steps
  const stepsResult = await aggregateGroupByDuration({
    recordType: 'Steps',
    timeRangeFilter: {
      operator: 'between',
      startTime: getStartDateAWeekAgo(),
      endTime: new Date().toISOString(),
    },
    timeRangeSlicer: {
      duration: 'DAYS',
      length: 1,
    },
  });
  data.steps = stepsResult.map(entry => {
    return {
      date: new Date(entry.endTime).toISOString().split('T')[0],
      value: entry.result.COUNT_TOTAL,
    };
  });

  const energyBurnedResult = await aggregateGroupByDuration({
    recordType: 'TotalCaloriesBurned',
    timeRangeFilter: {
      operator: 'between',
      startTime: getStartDateAWeekAgo(),
      endTime: new Date().toISOString(),
    },
    timeRangeSlicer: {
      duration: 'DAYS',
      length: 1,
    },
  });
  data.energyBurned = energyBurnedResult.map(entry => {
    return {
      date: new Date(entry.endTime).toISOString().split('T')[0],
      value: entry.result.ENERGY_TOTAL.inKilocalories,
    };
  });

  return data;
}
