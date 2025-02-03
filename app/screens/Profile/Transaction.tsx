import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUserStore} from '../../stores/user.ts';


export default function Transaction({ route }) {
  const { uuid, date } = route.params;

  const user = useUserStore(state => state.user);

  const [upload, setUpload] = useState({});

  useEffect(() => {
    const fetchUpload = async () => {
      const uploadHistory = await AsyncStorage.getItem(user.username + 'uploadHistory');
      if (uploadHistory) {
        setUpload(JSON.parse(uploadHistory).uploads[uuid]);
      }
    };

    fetchUpload();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* info */}
      <View style={styles.infoBox}>
        <Text style={styles.description}>
          {JSON.stringify(upload, null, 2)}
        </Text>
      </View>

      {/* used data */}
      {/*<View style={styles.infoBox}>
        <Text style={styles.boxHeader}>
          Used data
        </Text>

        <View style={infoItemStyles.infoItem}>
          <Text style={infoItemStyles.infoItemData}>Steps</Text>
          <Text style={infoItemStyles.infoItemTitle}>351</Text>
        </View>

        <View style={infoItemStyles.infoItem}>
          <Text style={infoItemStyles.infoItemData}>Calories</Text>
          <Text style={infoItemStyles.infoItemTitle}>65</Text>
        </View>
      </View>*/}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  infoBox: {
    backgroundColor: '#d7d7d7',
    padding: 20,
    borderRadius: 8,
    gap: 12,
  },
  boxHeader: {
    fontSize: 18,
    fontWeight: 500,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    lineHeight: 24,
    paddingBottom: 20,
    textAlign: 'justify',
  },
});

const infoItemStyles = StyleSheet.create({
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItemTitle: {
    color: '#6c6c6c',
    fontSize: 18,
  },
  infoItemData: {
    fontSize: 18,
  },
});
