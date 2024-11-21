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

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function LoginScreen() {
  const { login } = React.useContext(AuthContext);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const validate = (): boolean => {
    let newErrors = {};

    // Validate email
    if (!EMAIL_REGEX.test(email)) {
      newErrors = { ...newErrors, email: 'Invalid email address' };
    }

    // Validate password
    if (password.length === 0) {
      newErrors = { ...newErrors, password: 'Password must not be empty' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await login(email, password);
    } catch (e) {
      console.log(e);
      setErrors({form: e.message});
    }
  }

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        {errors.form ? <Text style={{ color: 'red' }}>{errors.form}</Text> : null}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {errors.email ? <Text style={{ color: 'red' }}>{errors.email}</Text> : null}

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {errors.password ? <Text style={{ color: 'red' }}>{errors.password}</Text> : null}

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
