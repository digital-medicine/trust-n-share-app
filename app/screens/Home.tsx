import {useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
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
    <SafeAreaView>

      {/* Personal Health data */}
      <View style={styles.personalHealthContainer}>
        <Text style={styles.header}>Personal Fitness Data</Text>
        <View style={styles.personalHealthGrid}>
          <PersonalHealthItem title="Steps" value={healthData.steps} />
          <PersonalHealthItem title="Energy Burned" value={healthData.energyBurned} />
          <PersonalHealthItem title="Steps" value={healthData.steps} />
          <PersonalHealthItem title="Energy Burned" value={healthData.energyBurned} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function PersonalHealthItem({title, value}: {title: string; value: number | undefined}) {
  return (
    <View style={personalHealthItemStyles.outer}>
      <View style={personalHealthItemStyles.inner}>
        <Text>{title}</Text>
        <Text>{value ?? 'No data'}</Text>
      </View>
    </View>
  );
}

const personalHealthItemStyles = StyleSheet.create({
  outer: {
    width: Dimensions.get('window').width / 2 - 10,
  },
  inner: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    borderRadius: 8,
    height: 150,
  },
})

const styles = StyleSheet.create({
  personalHealthContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  personalHealthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },

});
