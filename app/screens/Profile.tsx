import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryButton from '../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Info</Text>

          <View style={styles.infoBox}>
            <View style={styles.infoItem}>
              <Text style={styles.infoItemTitle}>Name</Text>
              <Text style={styles.infoItemData}>John Doe</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoItemTitle}>Date of birth</Text>
              <Text style={styles.infoItemData}>2000-01-01</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoItemTitle}>Participated studies</Text>
              <Text style={styles.infoItemData}>4</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoItemTitle}>Money earned</Text>
              <Text style={styles.infoItemData}>7,50 €</Text>
            </View>
          </View>

          <PrimaryButton
            onPress={() => navigation.navigate('Compensations')}
            title='Compensations'
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Transaction history</Text>

          <TransactionButton name="Rewe" date="2024-11-05" />
          <TransactionButton name="Rewe" date="2024-11-05" />
          <TransactionButton name="Rewe" date="2024-11-05" />
        </View>
      </View>
    </ScrollView>
  );
}

function TransactionButton({name, date}: {name: string, date: string}) {

  return (
    <TouchableOpacity style={styles.whiteButton}>
      <View style={styles.whiteButtonLeft}>
        <Text style={styles.infoItemData}>{name}</Text>
        <Text style={styles.infoItemTitle}>{date}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    // padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionContainer: {
    padding: 20,
    gap: 20,
  },
  infoBox: {
    backgroundColor: '#d7d7d7',
    padding: 20,
    borderRadius: 8,
    gap: 12,
  },
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
  whiteButton: {
    backgroundColor: 'white',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  whiteButtonLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
  }
})
