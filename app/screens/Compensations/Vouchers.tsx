import {Dimensions, StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {useAvailableCompensationsStore} from '../../stores/availableCompensations.ts';
import {translate} from '../../utils/localization.ts';

export default function VouchersScreen() {
  const vouchers = useAvailableCompensationsStore(state => state.vouchers);
  const redeemVoucher = useAvailableCompensationsStore(state => state.redeemVoucher);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {vouchers.map(voucher => (
          <TouchableOpacity style={styles.gridItem} key={voucher.uuid} onPress={() => redeemVoucher(voucher.uuid)}>
            <Text style={styles.gridItemHeader}>{translate("upload.incentives." + voucher.name)}</Text>
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
