import {Dimensions, StyleSheet, Text, View, ScrollView} from 'react-native';
import {useUserStore} from '../../stores/user.ts';

export default function VouchersScreen() {
  const user = useUserStore(state => state.user);
  // const user = {
  //   availableCompensations: [
  //     {
  //       _id: '1',
  //       name: 'Voucher 1',
  //     },
  //     {
  //       _id: '2',
  //       name: 'Voucher 2',
  //     },
  //     {
  //       _id: '3',
  //       name: 'Voucher 3',
  //     },
  //   ],
  // }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {/*{user?.availableCompensations.map(compensation => (*/}
        {/*  <View style={styles.gridItem} key={compensation._id}>*/}
        {/*    <Text style={styles.gridItemHeader}>{compensation.name}</Text>*/}
        {/*  </View>*/}
        {/*))}*/}
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
