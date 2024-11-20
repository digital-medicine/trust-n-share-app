import AuthContext from '../contexts/AuthContext';
import React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { logout } = React.useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>

      <TouchableHighlight onPress={logout}>
        <Text>Logout</Text>
      </TouchableHighlight>
    </View>
  );
}

