import {useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import fetchHealthData, {HealthData} from '../utils/fetchHealthData.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
          <PersonalHealthItem title="steps taken" value={healthData.steps} icon="footsteps" />
          <PersonalHealthItem title="calories burned" value={healthData.energyBurned} icon="flame" />
          <PersonalHealthItem title="calories burned" value={healthData.energyBurned} icon="flame" />
          <PersonalHealthItem title="steps taken" value={healthData.steps} icon="footsteps" />
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

function PersonalHealthItem({title, value, icon}: {title: string; value: number | undefined; icon: string}) {
  return (
    <View style={personalHealthItemStyles.outer}>
      <View style={personalHealthItemStyles.inner}>
        <Ionicons name={icon} size={30} color="#6c6c6c" />
        {value !== undefined
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
