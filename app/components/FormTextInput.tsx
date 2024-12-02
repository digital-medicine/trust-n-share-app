import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface PrimaryTextInputProps extends TextInputProps {}

const FormTextInput: React.FC<PrimaryTextInputProps> = (props) => {
  return (
    <TextInput
      style={[styles.input, props.style]}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

export default FormTextInput;

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1d1d1f',
  },
});

