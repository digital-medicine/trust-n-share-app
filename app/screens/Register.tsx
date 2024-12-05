import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useContext, useState} from 'react';
import FormTextInput from '../components/FormTextInput.tsx';
import RNPickerSelect from 'react-native-picker-select';
import PrimaryButton from '../components/PrimaryButton.tsx';
import AuthContext from '../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {validateEmail} from '../utils/validateEmail.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';

type errors = {
  form?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
  birthDate?: string;
}

export default function RegisterScreen() {
  const { register } = useContext(AuthContext);

  const [gender, setGender]  = useState('other');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState(new Date(946731600000));

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({} as errors);

  const onDatePickerChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setBirthDate(selectedDate);
  };

  const validate = (): boolean => {
    let newErrors = {};

    // Validate email
    if (!validateEmail(email)) {
      newErrors = { ...newErrors, email: 'Invalid email address' };
    }

    // Validate name
    if (firstName.length === 0) {
      newErrors = { ...newErrors, firstName: 'First name must not be empty' };
    }
    if (lastName.length === 0) {
      newErrors = { ...newErrors, lastName: 'Last name must not be empty' };
    }

    // Validate password
    if (password.length === 0) {
      newErrors = { ...newErrors, password: 'Password must not be empty' };
    }
    if (password !== confirmPassword) {
      newErrors = { ...newErrors, confirmPassword: 'Passwords do not match' };
    }

    // Validate birthdate
    if (birthDate >= new Date()) {
      newErrors = { ...newErrors, birthDate: 'Birthdate is in the future' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await register(gender, firstName, lastName, email, password, birthDate);
    } catch (e) {
      console.log(e);
      setErrors({form: e.message});
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {errors.form ? <Text style={{ color: 'red' }}>{errors.form}</Text> : null}

        <RNPickerSelect
          placeholder={{
            label: 'Select your Gender ...',
            value: null,
          }}
          style={pickerSelectStyles}
          onValueChange={(value) => setGender(value)}
          items={[
            { label: 'Female', value: 'female' },
            { label: 'Male', value: 'male' },
            { label: 'Other', value: 'other' },
          ]}
          Icon={() => {
            return <Ionicons name="caret-down" size={24} color="gray" />;
          }}
        />

        <FormTextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          keyboardType="default"
          autoCapitalize="words"
        />

        {errors.firstName ? <Text style={{ color: 'red' }}>{errors.firstName}</Text> : null}

        <FormTextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          keyboardType="default"
          autoCapitalize="words"
        />

        {errors.lastName ? <Text style={{ color: 'red' }}>{errors.lastName}</Text> : null}

        <FormTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {errors.email ? <Text style={{ color: 'red' }}>{errors.email}</Text> : null}

        <FormTextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {errors.password ? <Text style={{ color: 'red' }}>{errors.password}</Text> : null}

        <FormTextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {errors.confirmPassword ? <Text style={{ color: 'red' }}>{errors.confirmPassword}</Text> : null}

        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerText}>Birthdate</Text>

          <DateTimePicker
            testID="dateTimePicker"
            value={birthDate}
            mode="date"
            onChange={onDatePickerChange}
          />
        </View>

        {errors.birthDate ? <Text style={{ color: 'red' }}>{errors.birthDate}</Text> : null}

        <PrimaryButton onPress={handleRegister} title="Register" />

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
    pointerEvents: "none"
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
