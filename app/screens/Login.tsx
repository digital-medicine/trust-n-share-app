import AuthContext from '../contexts/AuthContext';
import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton.tsx';
import FormTextInput from '../components/FormTextInput.tsx';
import Link from '../components/Link.tsx';
import {useNavigation} from '@react-navigation/native';

type errors = {
  form?: string;
  username?: string;
  password?: string;
}

export default function LoginScreen() {
  const { login } = React.useContext(AuthContext);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({} as errors);

  const validate = (): boolean => {
    let newErrors = {};

    // Validate username
    if (username.length === 0) {
      newErrors = { ...newErrors, username: 'Username must not be empty' };
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
      await login(username, password);
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

        <FormTextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        {errors.username ? <Text style={{ color: 'red' }}>{errors.username}</Text> : null}

        <FormTextInput
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
