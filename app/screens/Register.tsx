import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useState} from 'react';
import FormTextInput from '../components/FormTextInput.tsx';
import PrimaryButton from '../components/PrimaryButton.tsx';
import {validateEmail} from '../utils/validateEmail.ts';
import {useAuthStore} from '../stores/auth.ts';
import {translate} from '../utils/localization.ts';

type errors = {
  form?: string;
  gender?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
  birthDate?: string;
};

export default function RegisterScreen() {
  const register = useAuthStore(state => state.register);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({} as errors);

  const validate = (): boolean => {
    let newErrors = {};

    // Validate email
    if (!validateEmail(email)) {
      newErrors = {
        ...newErrors,
        email: translate('Bitte gib eine gültige E-Mail-Adresse ein.'),
      };
    }

    // Validate name
    if (username.length === 0) {
      newErrors = {
        ...newErrors,
        firstName: translate('register.error-username-empty'),
      };
    }

    // Validate password
    if (password.length === 0) {
      newErrors = {
        ...newErrors,
        password: translate('register.error-password-empty'),
      };
    }
    if (password !== confirmPassword) {
      newErrors = {
        ...newErrors,
        confirmPassword: translate('register.error-password-mismatch'),
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await register(username, email, password);
    } catch (e) {
      console.log(e);
      setErrors({form: e.message});
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {errors.form ? <Text style={{color: 'red'}}>{errors.form}</Text> : null}

        <FormTextInput
          placeholder={translate('register.username')}
          value={username}
          onChangeText={setUsername}
          keyboardType="default"
          autoCapitalize="none"
        />

        {errors.lastName ? (
          <Text style={{color: 'red'}}>{errors.lastName}</Text>
        ) : null}

        <FormTextInput
          placeholder={translate('register.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {errors.email ? (
          <Text style={{color: 'red'}}>{errors.email}</Text>
        ) : null}

        <FormTextInput
          placeholder={translate('register.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {errors.password ? (
          <Text style={{color: 'red'}}>{errors.password}</Text>
        ) : null}

        <FormTextInput
          placeholder={translate('register.confirm-password')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {errors.confirmPassword ? (
          <Text style={{color: 'red'}}>{errors.confirmPassword}</Text>
        ) : null}

        <PrimaryButton
          onPress={handleRegister}
          title={translate('register.button')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  select: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  datePickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 8,
  },
  datePickerText: {
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#1d1d1f',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOSContainer: {
    pointerEvents: 'none',
  },
  inputIOS: {
    backgroundColor: 'white',
    height: 50,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#1d1d1f',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    backgroundColor: 'white',
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#1d1d1f',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  placeholder: {
    color: '#999', // Placeholder text color
  },
  iconContainer: {
    top: 13,
    right: 12,
  },
});
