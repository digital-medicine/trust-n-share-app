import {useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import fetchHealthData, {HealthData} from '../utils/fetchHealthData.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  const [healthData, setHealthData] = useState(new HealthData());
  const [stepsToday, setStepsToday] = useState<number|null>(null);
  const [energyBurnedToday, setEnergyBurnedToday] = useState<number|null>(null);

  useEffect(() => {
    // Fetch health data
    const fetchData = async () => {
      try {
        const data = await fetchHealthData();
        setHealthData(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();

    // Get steps taken today
    if (healthData.steps) {
      const today = new Date().toISOString().split('T')[0];
      const steps = healthData.steps
        .find((entry) => entry.date === today)
        ?.value;
      if (steps) {
        setStepsToday(Math.round(steps));
      }
    }

    // Get energy burned today
    if (healthData.energyBurned) {
      const today = new Date().toISOString().split('T')[0];
      const energy = healthData.energyBurned
        .find((entry) => entry.date === today)
        ?.value;
      if (energy) {
        setEnergyBurnedToday(Math.round(energy));
      }
    }
  }, []);

  return (
    <SafeAreaView>

      {/* Personal Health data */}
      <View style={styles.personalHealthContainer}>
        <Text style={styles.header}>Personal Fitness Data</Text>
        <View style={styles.personalHealthGrid}>
          <PersonalHealthItem title="steps taken" value={stepsToday} icon="footsteps" />
          <PersonalHealthItem title="calories burned" value={energyBurnedToday} icon="flame" />
          {/*<PersonalHealthItem title="calories burned" value={healthData.energyBurned} icon="flame" />*/}
          {/*<PersonalHealthItem title="steps taken" value={healthData.steps} icon="footsteps" />*/}
        </View>
      </View>

      {/* fitness statistics */}
      <View style={styles.statisticsContainer}>
        <Text style={styles.header}>Fitness Statistics</Text>
        <Text>TODO</Text>
      </View>
    </SafeAreaView>
  );
}

function PersonalHealthItem({title, value, icon}: {title: string; value: number | null; icon: string}) {
  return (
    <View style={personalHealthItemStyles.outer}>
      <View style={personalHealthItemStyles.inner}>
        <Ionicons name={icon} size={30} color="#6c6c6c" />
        {value !== null
          ? <Text style={personalHealthItemStyles.value}>{value}</Text>
          : <Text style={personalHealthItemStyles.noData}>No data</Text>
        }
        <Text style={personalHealthItemStyles.title}>{title}</Text>
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
    backgroundColor: '#d7d7d7',
    borderRadius: 8,
    height: 150,
  },
  title: {
    fontSize: 16,
    color: '#343434',
  },
  value: {
    fontSize: 36,
    color: 'black',
    paddingVertical: 6,
  },
  noData: {
    fontSize: 24,
    paddingVertical: 12,
    color: '#989898',
  }
})

const styles = StyleSheet.create({
  personalHealthContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statisticsContainer: {
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
