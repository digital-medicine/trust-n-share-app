import {useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {BarChart} from 'react-native-chart-kit';
import {useHealthStore} from '../stores/health.ts';
import PrimaryButton from '../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import {translate, languageTag} from '../utils/localization.ts';

export default function HomeScreen() {
  const healthData = useHealthStore(state => state.healthData);
  const fetchHealth = useHealthStore(state => state.fetchHealth);
  const healthLoading = useHealthStore(state => state.healthLoading);

  const navigation = useNavigation();

  const [stepsToday, setStepsToday] = useState<number|null>(null);
  const [energyBurnedToday, setEnergyBurnedToday] = useState<number|null>(null);
  const [activeMinutesToday, setActiveMinutesToday] = useState<number|null>(null);
  const [stepsChartData, setStepsChartData] = useState<{labels: string[], datasets: {}}>(
    {labels: [], datasets: [{data: []}]},
  );
  const [activeMinutesChartData, setActiveMinutesChartData] = useState<{labels: string[], datasets: {}}>(
    {labels: [], datasets: [{data: []}]},
  );

  // Fetch health data on mount
  useEffect(() => {
    fetchHealth();
  }, []);

  // Transform health data for display
  useEffect(() => {
    if (healthData.steps && healthData.steps.length > 0) {
      // Get steps taken today
      const today = new Date().toISOString().split('T')[0];
      const stepsToday = healthData.steps
        .find((entry) => entry.date === today)
        ?.value;
      if (stepsToday) {
        setStepsToday(Math.round(stepsToday));
      }

      // Prepare step data for bar chart
      const stepsChartDataTemp = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const label = date.toLocaleDateString(languageTag, { weekday: 'short' });

        const value =
          healthData.steps.find(
            (entry) => entry.date === date.toISOString().split('T')[0]
          )?.value ?? 0;

        stepsChartDataTemp.push({
          date,
          label,
          value,
        });
      }
      const labels = stepsChartDataTemp.map((entry) => entry.label);
      const data = stepsChartDataTemp.map((entry) => Math.round(entry.value));
      setStepsChartData({ labels, datasets: [{ data }] });
    }

    if (healthData.activeMinutes && healthData.activeMinutes.length > 0) {
      console.log("activeMinutes", healthData.activeMinutes);

      // Get active minutes today
      const today = new Date().toISOString().split('T')[0];
      const activeMinutes = healthData.activeMinutes
        .find((entry) => entry.date === today)
        ?.value;
      if (activeMinutes) {
        setActiveMinutesToday(Math.round(activeMinutes));
      }

      // Prepare Active Minutes data for bar chart
      const activeMinutesChartDataTemp = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const label = date.toLocaleDateString(languageTag, { weekday: 'short' });

        const value =
          healthData.activeMinutes.find(
            (entry) => entry.date === date.toISOString().split('T')[0]
          )?.value ?? 0;

        activeMinutesChartDataTemp.push({
          date,
          label,
          value,
        });
      }
      const labels = activeMinutesChartDataTemp.map((entry) => entry.label);
      const data = activeMinutesChartDataTemp.map((entry) => Math.round(entry.value));
      setActiveMinutesChartData({ labels, datasets: [{ data }] });
    }

    // Get energy burned today
    if (healthData.energyBurned) {
      const today = new Date().toISOString().split('T')[0];
      const energy = healthData.energyBurned.find(
        (entry) => entry.date === today
      )?.value;
      if (energy) {
        setEnergyBurnedToday(Math.round(energy));
      }
    }
  }, [healthData]);

  return (
    <ScrollView>
      <SafeAreaView>
        {/* Personal Health data */}
        <View style={styles.personalHealthContainer}>
          <Text style={styles.header}>{translate("home.today-header")}</Text>
          {healthLoading
            ? <Text>{translate("general.loading")}</Text>
            : <View style={styles.personalHealthGrid}>
              <PersonalHealthItem title={translate("home.steps")}
                                  value={stepsToday}
                                  iconPack="ionicons"
                                  icon="footsteps" />
              <PersonalHealthItem title={translate("home.calories")}
                                  value={energyBurnedToday}
                                  iconPack="ionicons"
                                  icon="flame" />
              <PersonalHealthItem title={translate("home.active-minutes")}
                                  value={activeMinutesToday}
                                  iconPack="fontawesome6"
                                  icon="person-running" />
            </View>
          }

          <View style={{width: "100%", paddingHorizontal: 20}}>
            <PrimaryButton onPress={() => navigation.navigate("Upload")} title={translate("general.upload")} />
          </View>
        </View>

        {/* fitness statistics */}
        <View style={styles.statisticsContainer}>
          <Text style={styles.header}>{translate("home.statistics-header")}</Text>
          {healthLoading
            ? <Text>{translate("general.loading")}</Text>
            :
            <>
              <View style={styles.chartContainer}>
              <Text style={styles.chartHeader}>{translate("home.steps-this-week")}</Text>
                {healthData?.steps?.length ?? 0 > 0
                  ? <BarChart
                    data={stepsChartData}
                    style={{
                      marginVertical: 8,
                      borderRadius: 8,
                      paddingRight: 0,
                    }}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      decimalPlaces: 0,
                      backgroundGradientFrom: "#d7d7d7",
                      backgroundGradientFromOpacity: 0,
                      backgroundGradientTo: "#d7d7d7",
                      backgroundGradientToOpacity: 0,
                      barPercentage: 1,
                      useShadowColorFromDataset: false,
                      fillShadowGradientFrom: '#0071e3',
                      fillShadowGradientFromOpacity: 1,
                      fillShadowGradientTo: '#0071e3',
                      fillShadowGradientToOpacity: 1,
                      barRadius: 8,
                    }}
                    width={Dimensions.get('window').width - 50}
                    height={200}
                    fromZero={true}
                    withInnerLines={false}
                    showBarTops={false}
                    withHorizontalLabels={false}
                    showValuesOnTopOfBars={true}
                  />
                  : <View style={styles.chartEmptyState}>
                    <Text style={styles.noData}>{translate("general.no-data")}</Text>
                  </View>
                }
              </View>
              <View style={styles.chartContainer}>
                <Text style={styles.chartHeader}>{translate("home.active-minutes-this-week")}</Text>
                {healthData?.activeMinutes?.some(entry => entry.value !== null)
                  ? <BarChart
                    data={activeMinutesChartData}
                    style={{
                      marginVertical: 8,
                      borderRadius: 8,
                      paddingRight: 0,
                    }}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      decimalPlaces: 0,
                      backgroundGradientFrom: "#d7d7d7",
                      backgroundGradientFromOpacity: 0,
                      backgroundGradientTo: "#d7d7d7",
                      backgroundGradientToOpacity: 0,
                      barPercentage: 1,
                      useShadowColorFromDataset: false,
                      fillShadowGradientFrom: '#0071e3',
                      fillShadowGradientFromOpacity: 1,
                      fillShadowGradientTo: '#0071e3',
                      fillShadowGradientToOpacity: 1,
                      barRadius: 8,
                    }}
                    width={Dimensions.get('window').width - 50}
                    height={200}
                    fromZero={true}
                    withInnerLines={false}
                    showBarTops={false}
                    withHorizontalLabels={false}
                    showValuesOnTopOfBars={true}
                  />
                  : <View style={styles.chartEmptyState}>
                    <Text style={styles.noData}>{translate("general.no-data")}</Text>
                  </View>
                }
            </View>
            </>
          }
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

function PersonalHealthItem({
  title,
  value,
  iconPack,
  icon,
}: {
  title: string;
  value: number | null;
  iconPack: "ionicons" | "fontawesome6";
  icon: string;
}) {
  return (
    <View style={personalHealthItemStyles.outer}>
      <View style={personalHealthItemStyles.inner}>

        {/*<Ionicons name={icon} size={30} color="#6c6c6c" />*/}

        {iconPack === "ionicons" && <Ionicons name={icon} size={30} color="#6c6c6c" />}
        {iconPack === "fontawesome6" && <FontAwesome6 name={icon} size={30} color="#6c6c6c" />}


        {value !== null ? (
          <Text style={personalHealthItemStyles.value}>{value}</Text>
        ) : (
          <Text style={styles.noData}>{translate('general.no-data')}</Text>
        )}
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
})

const styles = StyleSheet.create({
  personalHealthContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statisticsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  chartContainer: {
    backgroundColor: '#d7d7d7',
    borderRadius: 8,
    width: Dimensions.get('window').width - 40,
    marginTop: 20,
  },
  chartHeader: {
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 10,
  },
  chartEmptyState: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noData: {
    fontSize: 24,
    paddingVertical: 12,
    color: '#989898',
  }
});
