import AuthContext from '../contexts/AuthContext';
import React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Link from '../components/Link.tsx';

export default function HomeScreen() {
  const { logout } = React.useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Link onPress={logout}>Logout</Link>
    </View>
  );
}

