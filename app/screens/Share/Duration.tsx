import {useNavigation} from '@react-navigation/native';
import FormContainer from '../../components/FormContainer.tsx';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import FormTextInput from '../../components/FormTextInput.tsx';
import {StyleSheet, Text, View} from 'react-native';
import {useState} from 'react';
import {useFormStore} from '../../stores/form.ts';
import {translate} from '../../utils/localization.ts';

export default function Duration() {
  const navigation = useNavigation();
  const form = useFormStore(state => state.form);
  const setDuration = useFormStore(state => state.setDuration);

  const [error, setError] = useState<string|null>(null);

  const onDurationChange = (duration) => {
    validateDuration(duration);
    setDuration(duration);
  }

  const validateDuration = (duration: number) => {
    if (isNaN(duration)) {
      setError(translate("upload.duration.error-not-a-number"));
      return false;
    }
    if (duration < 1) {
      setError(translate("upload.duration.error-too-short"));
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
        <Text style={styles.text}>{translate("upload.duration.text1")}</Text>

        <FormTextInput
          style={styles.input}
          value={form.duration.toString()}
          onChangeText={onDurationChange}
          placeholder="Duration"
          inputMode="numeric"
          onSubmitEditing={onSubmit}
        />

        <Text style={styles.text}>{translate("upload.duration.text2")}</Text>
      </View>

      {error && <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>}

      <PrimaryButton onPress={onSubmit} title={translate("general.next")} />
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
