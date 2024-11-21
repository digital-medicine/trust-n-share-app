import AuthContext from '../contexts/AuthContext';
import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton.tsx';
import TextInput from '../components/TextInput.tsx';
import Link from '../components/Link.tsx';
import {useNavigation} from '@react-navigation/native';

export default function LoginScreen() {
  const { login } = React.useContext(AuthContext);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    // TODO: Add validation
    login(email, password);
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <PrimaryButton title="Login" onPress={handleLogin} />
        
        <Link onPress={() => navigation.navigate("Register")}>
          New user? Register here
        </Link>
      </View>
    </SafeAreaView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 32,
    margin: 40,
    textAlign: 'center',
    color: '#333',
  },
});
