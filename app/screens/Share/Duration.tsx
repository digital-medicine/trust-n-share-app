import {useNavigation} from '@react-navigation/native';
import {useFormContext} from '../../contexts/FormContext';
import FormContainer from '../../components/FormContainer.tsx';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import FormTextInput from '../../components/FormTextInput.tsx';
import {StyleSheet, Text, View} from 'react-native';
import {useState} from 'react';

export default function Duration() {
  const navigation = useNavigation();
  const { form, setDuration } = useFormContext();

  const [error, setError] = useState<string|null>(null);

  const onDurationChange = (duration) => {
    validateDuration(duration);
    setDuration(duration);
  }

  const validateDuration = (duration: number) => {
    if (isNaN(duration)) {
      setError('Duration must be a number');
      return false;
    }
    if (duration < 1) {
      setError('Duration must be at least 1 month');
      return false;
    }

    setError(null);
    return true;
  }

  const onSubmit = () => {
    if (!validateDuration(form.duration)) return;

    // @ts-ignore
    navigation.navigate('Information');
  }

  return (
    <FormContainer>
      <View style={styles.container}>
        <Text style={styles.text}>Share my data for</Text>

        <FormTextInput
          style={styles.input}
          value={form.duration.toString()}
          onChangeText={onDurationChange}
          placeholder="Duration"
          inputMode="numeric"
          onSubmitEditing={onSubmit}
        />

        <Text style={styles.text}>months.</Text>
      </View>

      {error && <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>}

      <PrimaryButton onPress={onSubmit} title={'Next'} />
    </FormContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    gap: 10,
  },
  input: {
    alignSelf: 'center',
    textAlign: 'center',
    height: 50,
    width: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 20,
    color: '#1d1d1f',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
