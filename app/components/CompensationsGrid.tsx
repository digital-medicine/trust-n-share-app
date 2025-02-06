import React from 'react';
import {ScrollView, StyleSheet, Text, View, Dimensions} from 'react-native';
import PrimaryButton from './PrimaryButton';
import {translate} from '../utils/localization.ts'; // Adjust path as needed

type Incentive = {
  uuid: string;
  name: string;
};

type IncentivesGridProps = {
  items: Incentive[];
  onRedeem: (uuid: string) => void;
  emptyStateTranslationKey: string;
};

export default function IncentivesGrid({
  items,
  onRedeem,
  emptyStateTranslationKey,
}: IncentivesGridProps) {
  return (
    <ScrollView style={styles.container}>
      {items.length > 0 ? (
        <View style={styles.grid}>
          {items.map(item => (
            <View style={styles.gridItem} key={item.uuid}>
              <Text style={styles.gridItemHeader}>
                {translate('upload.incentives.' + item.name)}
              </Text>
              <PrimaryButton
                title={translate('compensations.redeem')}
                onPress={() => onRedeem(item.uuid)}
              />
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyState}>
          {translate(emptyStateTranslationKey)}
        </Text>
      )}
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
    marginBottom: 10,
  },
  emptyState: {
    fontSize: 16,
    marginTop: 40,
    textAlign: 'center',
    color: '#6c6c6c',
  },
});