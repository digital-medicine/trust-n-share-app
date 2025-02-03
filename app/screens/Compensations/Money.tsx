import {Dimensions, StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {useAvailableCompensationsStore} from '../../stores/availableCompensations.ts';

export default function MoneyScreen() {
  const money = useAvailableCompensationsStore(state => state.money);
  const redeemMoney = useAvailableCompensationsStore(state => state.redeemMoney);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {money.map(compensation => (
          <TouchableOpacity style={styles.gridItem} key={compensation.uuid} onPress={() => redeemMoney(compensation.uuid)}>
            <Text style={styles.gridItemHeader}>{compensation.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  gridItem: {
    width: Dimensions.get('window').width / 2 - 30,
    height: Dimensions.get('window').width / 2 - 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
