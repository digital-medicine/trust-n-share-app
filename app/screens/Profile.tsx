import {Text, View} from 'react-native';
import Link from '../components/Link.tsx';
import React from 'react';
import AuthContext from '../contexts/AuthContext';
import PrimaryButton from '../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';


export default function ProfileScreen() {
  const { logout } = React.useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>

      <PrimaryButton
        onPress={() => navigation.navigate('Compensations')}
        title='Compensations'
      />

      <Link onPress={logout}>Logout</Link>
    </View>
  );
}
