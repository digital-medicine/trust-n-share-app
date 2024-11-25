import {Text, View} from 'react-native';
import Link from '../components/Link.tsx';
import React from 'react';
import AuthContext from '../contexts/AuthContext';


export default function ProfileScreen() {
  const { logout } = React.useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Link onPress={logout}>Logout</Link>
    </View>
  );
}
