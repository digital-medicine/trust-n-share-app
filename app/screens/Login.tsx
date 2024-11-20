import AuthContext from '../contexts/AuthContext';
import React from 'react';
import {
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { login } = React.useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight onPress={login}>
        <Text>Login</Text>
      </TouchableHighlight>
    </View>
  );
}
