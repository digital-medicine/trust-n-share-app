import {useEffect, useState} from 'react';
import {
  Text,
  View,
} from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health'

export default function HomeScreen() {
  const [stepCount, setStepCount] = useState(0);
  const [activeEnergyBurned, setActiveEnergyBurned] = useState(0);

  // Fetch health data
  useEffect(() => {
    const permissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.StepCount,
          AppleHealthKit.Constants.Permissions.ActivitySummary,
        ],
      },
    } as HealthKitPermissions;

    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      /* Called after we receive a response from the system */

      if (error) {
        console.log('[ERROR] Cannot grant permissions!')
      }

      /* Can now read or write to HealthKit */

      AppleHealthKit.getStepCount({}, (err: string, results: HealthValue) => {
        if (err) {
          console.log('[ERROR] Cannot get step count!')
        }

        setStepCount(results.value);
      });
    });
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Text>Steps: {stepCount}</Text>
    </View>
  );
}

