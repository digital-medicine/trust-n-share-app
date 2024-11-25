import {Button, StyleSheet, Text, View} from 'react-native';
import {useContext, useState} from 'react';
import TextInput from '../components/TextInput.tsx';
import RNPickerSelect from 'react-native-picker-select';
import PrimaryButton from '../components/PrimaryButton.tsx';
import AuthContext from '../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegisterScreen() {
  const { register } = useContext(AuthContext);

  const [gender, setGender]  = useState('other');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState(new Date(1598051730000));

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDatePickerChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setBirthDate(selectedDate);
  };

  const handleRegister = () => {
    // TODO: Basic validation

    register(gender, firstName, lastName, email, password, birthDate);
  }

  return (
    <View style={styles.container}>
      {/*<Text style={styles.title}>Register</Text>*/}

      <RNPickerSelect
        placeholder={{
          label: 'Gender',
          value: null,
        }}
        style={pickerSelectStyles}
        onValueChange={(value) => setGender(value)}
        items={[
          { label: 'Female', value: 'female' },
          { label: 'Male', value: 'male' },
          { label: 'Other', value: 'other' },
        ]}
      />

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        keyboardType="default"
        autoCapitalize="words"
      />

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        keyboardType="default"
        autoCapitalize="words"
      />

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

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <View style={styles.datePickerContainer}>
        <Text style={styles.datePickerText}>Birth date</Text>

        <DateTimePicker
          testID="dateTimePicker"
          value={birthDate}
          mode="date"
          onChange={onDatePickerChange}
        />
      </View>

      <PrimaryButton onPress={handleRegister} title="Register" />

    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  datePickerText: {
    fontSize: 16,
    color: '#1d1d1f',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
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
});
