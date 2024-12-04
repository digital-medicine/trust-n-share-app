import {SafeAreaView, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import React from 'react';


export default function Compensations() {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Text>Compensations</Text>

      <PrimaryButton
        onPress={() => navigation.navigate('Vouchers')}
        title='Vouchers'
      />

      <PrimaryButton
        onPress={() => navigation.navigate('Money')}
        title='Financial Compensation'
      />
    </SafeAreaView>
  )
}
