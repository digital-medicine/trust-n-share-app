import {useEffect, useState} from 'react';
import {
  Text,
  View,
} from 'react-native';
import fetchHealthData, {HealthData} from '../utils/fetchHealthData.ts';

export default function HomeScreen() {
  const [healthData, setHealthData] = useState(new HealthData());

  // Fetch health data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHealthData();
        setHealthData(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Text>Steps: {healthData.steps ?? 'No data'}</Text>
      <Text>Energy burned: {healthData.energyBurned ?? 'No data'}</Text>
    </View>
  );
}

