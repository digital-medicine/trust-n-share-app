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
import {useAuthStore} from '../stores/auth.ts';
import {translate} from '../utils/localization.ts';

type errors = {
  form?: string;
  username?: string;
  password?: string;
}

export default function LoginScreen() {
  const login = useAuthStore(state => state.login);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({} as errors);

  const validate = (): boolean => {
    let newErrors = {};

    // Validate username
    if (username.length === 0) {
      newErrors = { ...newErrors, username: translate("login.error-username-empty") };
    }

    // Validate password
    if (password.length === 0) {
      newErrors = { ...newErrors, password: translate("login.error-password-empty") };
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
        <Text style={styles.title}>{translate('login.header')}</Text>

        {errors.form ? <Text style={{color: 'red'}}>{errors.form}</Text> : null}

        <FormTextInput
          placeholder={translate('login.username')}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        {errors.username ? (
          <Text style={{color: 'red'}}>{errors.username}</Text>
        ) : null}

        <FormTextInput
          placeholder={translate('login.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {errors.password ? (
          <Text style={{color: 'red'}}>{errors.password}</Text>
        ) : null}

        <PrimaryButton
          title={translate('login.button')}
          onPress={handleLogin}
        />

        <Link onPress={() => navigation.navigate('Register')}>
          {translate('login.register')}
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
