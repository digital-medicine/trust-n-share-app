import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import TextInput from '../components/TextInput.tsx';
import RNPickerSelect from 'react-native-picker-select';
import PrimaryButton from '../components/PrimaryButton.tsx';
import AuthContext from '../contexts/AuthContext';

export default function RegisterScreen() {
  const { register } = React.useContext(AuthContext);

  const [gender, setGender]  = React.useState('other');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [birthDate, setBirthDate] = React.useState('');

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
