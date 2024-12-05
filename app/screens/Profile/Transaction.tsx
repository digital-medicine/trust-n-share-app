import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';


export default function Transaction({ route }) {
  const { id, name } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* info */}
      <View style={styles.infoBox}>
        <Text style={styles.description}>
          Schritte zählen bis zur Erleuchtung: Eine Meta-Analyse über Fitness-Tracker und das Finden des inneren Zen.
        </Text>

        <View style={infoItemStyles.infoItem}>
          <Text style={infoItemStyles.infoItemTitle}>Recipient:</Text>
          <Text style={infoItemStyles.infoItemData}>{name}</Text>
        </View>

        <View style={infoItemStyles.infoItem}>
          <Text style={infoItemStyles.infoItemTitle}>Date:</Text>
          <Text style={infoItemStyles.infoItemData}>2024-11-01</Text>
        </View>
      </View>

      {/* used data */}
      <View style={styles.infoBox}>
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
      </View>
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
