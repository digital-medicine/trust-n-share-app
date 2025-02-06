import {Platform} from 'react-native';
import type {AppleHealthKit as HealthKitType, HealthKitPermissions} from 'react-native-health';
import {
  initialize,
  requestPermission,
  readRecords,
  getGrantedPermissions,
  aggregateGroupByDuration,
} from 'react-native-health-connect';

let AppleHealthKit: typeof import('react-native-health').default | null = null;
if (Platform.OS === 'ios') {
  AppleHealthKit = require('react-native-health');
}

export class HealthData {
  steps?: {date: string; value: number}[];
  energyBurned?: {date: string; value: number}[];
  activeMinutes?: {date: string; value: number|null}[];
  // TODO: Add more
}

/**
 * Initializes the health data permissions based on the platform (iOS or Android).
 *
 * @returns {Promise<boolean>} True if all requested permissions are granted, false if permissions are missing.
 * @throws {Error} Throws an error if the platform is unsupported or if permissions cannot be granted.
 */
export async function initAndGetPermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    return await initHealthKit();
  }
  if (Platform.OS === 'android') {
    return await initHealthConnect();
  }

  throw new Error('Unsupported platform');
}

/**
 * Fetches health data based on the platform (iOS or Android).
 *
 * @returns {Promise<HealthData>} A promise that resolves to the health data.
 * @throws {Error} Throws an error if the platform is unsupported.
 */
export async function fetchHealthData(): Promise<HealthData> {
  console.log('Fetching health data for platform', Platform.OS);

  if (Platform.OS === 'ios') {
    return await fetchHealthKitData();
  }
  if (Platform.OS === 'android') {
    return await fetchHealthConnectData();
  }

  throw new Error('Unsupported platform');
}

async function initHealthKit(): Promise<boolean> {
  console.log('Initializing HealthKit');

  if (!AppleHealthKit) {
    throw new Error('Could not load HealthKit');
  }

  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.StepCount,
        AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
        AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
        AppleHealthKit.Constants.Permissions.ActivitySummary,
        // ADD MORE PERMISSIONS HERE
      ],
    },
  } as HealthKitPermissions;

  // Initialize with permissions
  return new Promise((resolve, reject) => {
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        console.log('initHealthKit error:', error);
        return reject(new Error('Cannot grant permissions!'));
      }

      // This is where we would check if permissions are granted.
      // But, from the react-native-health docs:
      //
      // > Due to Apple's privacy model if an app user has previously denied a
      // > specific permission then they can not be prompted again for that same
      // > permission. The app user would have to go into the Apple Health app
      // > and grant the permission to your react-native app under sources tab.
      //
      // > For any data that is read from Healthkit the status/error is the same
      // > for both. This privacy restriction results in having no knowledge of
      // > whether the permission was denied (make sure it's added to the
      // > permissions options object), or the data for the specific request was
      // > nil (ex. no steps recorded today).

      resolve(true);
    });
  });
}

async function initHealthConnect(): Promise<boolean> {
  console.log('Initializing Health Connect');

  // initialize the client
  const isInitialized = await initialize();
  if (!isInitialized) {
    throw new Error('Could not initialize Health Connect');
  }

  // request permissions
  const grantedPermissions = await requestPermission([
    { accessType: 'read', recordType: 'TotalCaloriesBurned' },
    { accessType: 'read', recordType: 'Steps' },
    { accessType: 'read', recordType: 'ExerciseSession' },
    // ADD MORE PERMISSIONS HERE
  ]);
  const permissionsOkay = ["Steps", "TotalCaloriesBurned", "ExerciseSession"]
    .every(recordType => grantedPermissions
      .map(permission => permission.recordType)
      .includes(recordType)
    );
  if (!permissionsOkay) {
    return false;
  }

  return true;
}

async function fetchHealthKitData(): Promise<HealthData> {
  if (!AppleHealthKit) {
    throw new Error('Could not load HealthKit');
  }

  const data = new HealthData();

  const [
    steps,
    activeEnergyBurned,
    basalEnergyBurned,
    activeMinutes,
  ] = await Promise.all([
    fetchAndAggregateData(AppleHealthKit.getDailyStepCountSamples),
    fetchAndAggregateData(AppleHealthKit.getActiveEnergyBurned),
    fetchAndAggregateData(AppleHealthKit.getBasalEnergyBurned),
    fetchActiveMinutes(AppleHealthKit),
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
  if (activeMinutes !== null) data.activeMinutes = activeMinutes;
  // ASSIGN MORE DATA HERE

  return data;
}

function fetchAndAggregateData(
  fetchMethod: (
    options: any,
    callback: (error: string, results: Array<any>) => void,
  ) => void,
): Promise<{date: string; value: number}[] | null> {
  const options = {
    startDate: getStartDateAWeekAgo(),
  };

  return new Promise(resolve => {
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

function sumResultsByDay(results: Array<any>): {date: string; value: number}[] {
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

function fetchActiveMinutes(
  healthKit: HealthKitType,
): Promise<{ date: string; value: number | null }[]> {
  const promises: Promise<{ date: string; value: number | null }>[] = [];

  // Fetch active minutes for each day independently. This is because HealthKit
  // does not give us any timestamps for the data it provides.
  for (let i = 0; i < 7; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - i);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - i);
    endDate.setUTCHours(23, 59, 59, 999);

    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    const resultDate = startDate.toISOString().split("T")[0];

    const promise = new Promise<{ date: string; value: number | null }>(
      (resolve) => {
        healthKit.getActivitySummary(
          options,
          (error: string, results: Array<any>) => {

            if (error) {
              console.error("getActivitySummary error:", error);
              resolve({ date: resultDate, value: null });
            } else {
              const value = results[0]?.appleExerciseTime ?? null;
              resolve({ date: resultDate, value });
            }
          }
        );
      }
    );

    promises.push(promise);
  }

  return Promise.all(promises);
}

function getStartDateAWeekAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - 6);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

async function fetchHealthConnectData(): Promise<HealthData> {
  const data = new HealthData();

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

  // Read energy burned
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

  // Read Exercise Time
  const exerciseResult = await aggregateGroupByDuration({
    recordType: 'ExerciseSession',
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
  data.activeMinutes = exerciseResult.map(entry => {
    return {
      date: new Date(entry.endTime).toISOString().split('T')[0],
      value: entry.result.EXERCISE_DURATION_TOTAL.inSeconds / 60,
    };
  });

  return data;
}
