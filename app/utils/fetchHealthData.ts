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

async function fetchHealthConnectData(): Promise<HealthData> {
  const data = new HealthData();

  // initialize the client
  const isInitialized = await initialize();
  console.log("isInitialized:", isInitialized);

  // request permissions
  const grantedPermissions = await requestPermission([
    { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
    { accessType: 'read', recordType: 'Steps' },
  ]);
  console.log("grantedPermissions:", grantedPermissions);

  // TODO check if granted

  // Read steps

  readRecords('Steps', {
    timeRangeFilter: {
      operator: 'between',
      startTime: '2023-01-09T12:00:00.405Z',
      endTime: '2024-12-09T23:53:15.405Z',
    },
  }).then(({ records }) => {
    console.log('Retrieved records: ', JSON.stringify({ records }, null, 2)); // Retrieved records:  {"records":[{"startTime":"2023-01-09T12:00:00.405Z","endTime":"2023-01-09T23:53:15.405Z","energy":{"inCalories":15000000,"inJoules":62760000.00989097,"inKilojoules":62760.00000989097,"inKilocalories":15000},"metadata":{"id":"239a8cfd-990d-42fc-bffc-c494b829e8e1","lastModifiedTime":"2023-01-17T21:06:23.335Z","clientRecordId":null,"dataOrigin":"com.healthconnectexample","clientRecordVersion":0,"device":0}}]}
  });

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
  console.log("stepsResult:", stepsResult);
  data.steps = stepsResult.map(entry => {
    return {
      date: new Date(entry.startTime).toISOString().split('T')[0],
      value: entry.result.COUNT_TOTAL,
    };
  });

  // Read active calories
  // aggregateGroupByDuration({
  //   recordType: 'ActiveCaloriesBurned',
  //   timeRangeFilter: {
  //     operator: 'between',
  //     startTime: getStartDateAWeekAgo(),
  //     endTime: new Date().toISOString(),
  //   },
  //   timeRangeSlicer: {
  //     duration: 'DAYS',
  //     length: 1,
  //   },
  // }).then((result) => {
  //   const energyBurned = result.map(entry => {
  //     return {
  //       date: new Date(entry.startTime).toISOString().split('T')[0],
  //       value: entry.result.ACTIVE_CALORIES_TOTAL.inKilocalories,
  //     };
  //   });
  //   data.energyBurned = energyBurned;
  // });
  const energyBurnedResult = await aggregateGroupByDuration({
    recordType: 'ActiveCaloriesBurned',
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
      date: new Date(entry.startTime).toISOString().split('T')[0],
      value: entry.result.ACTIVE_CALORIES_TOTAL.inKilocalories,
    };
  });

  console.log("Health Connect result:", data);
  return data;
}
