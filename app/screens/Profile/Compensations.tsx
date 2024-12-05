import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import React from 'react';
import FormTextInput from '../../components/FormTextInput.tsx';
import ErrorText from '../../components/ErrorText.tsx';


export default function Compensations() {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* Vouchers */}
        <View style={styles.box}>
          <Text style={styles.boxHeader}>Vouchers</Text>

          <Text style={styles.boxText}>
            Receive vouchers for various stores and services as a token of appreciation.
          </Text>

          <PrimaryButton
            onPress={() => navigation.navigate('Vouchers')}
            title='Redeem'
          />
        </View>

        {/* Money */}
        <View style={styles.box}>
          <Text style={styles.boxHeader}>Financial compensation</Text>

          <Text style={styles.boxText}>
            Receive a final compensation for your valuable participation.
          </Text>

          <PrimaryButton
            onPress={() => navigation.navigate('Money')}
            title='Redeem'
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  box: {
    backgroundColor: '#d7d7d7',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  boxHeader: {
    fontSize: 18,
    fontWeight: 500,
    textAlign: 'center',
  },
  boxText: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'justify',
  },
});
