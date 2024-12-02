import {useNavigation} from '@react-navigation/native';
import {useFormContext} from '../../contexts/FormContext';
import FormContainer from '../../components/FormContainer.tsx';
import {StyleSheet, Text, View} from 'react-native';
import FormTextInput from '../../components/FormTextInput.tsx';
import Slider from '@react-native-community/slider';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useState} from 'react';

export default function PrivacyLevel() {
  const navigation = useNavigation();
  const {
    form,
    setPrivacyIncentive,
    setPrivacyHighRisk,
    setPrivacyLowRisk,
  } = useFormContext();

  const [error, setError] = useState<string|null>(null);

  const onIncentiveChange = (incentive) => {
    validateIncentive(incentive);
    setPrivacyIncentive(incentive);
  }

  const validateIncentive = (incentive: number) => {
    if (isNaN(incentive)) {
      setError('Incentive must be a number');
      return false;
    }
    if (incentive < 0) {
      setError('Incentive must be positive');
      return false;
    }

    setError(null);
    return true;
  }

  const onSubmit = () => {
    if (!validateIncentive(form.privacyLevel.incentive)) return;

    // @ts-ignore
    navigation.navigate('Reputation');
  }

  return (
    <FormContainer>
      {/* Incentives */}
      <View style={styles.box}>
        <Text style={styles.boxHeader}>Incentives for original data</Text>

        <Text style={styles.boxText}>
          Let’s say no details would be obfuscated:
          For similar data, data users typically offer X euros as an incentive.
          What would be the incentive for you to share your data?
        </Text>

        <View style={styles.inputContainer}>
          <FormTextInput
            style={styles.input}
            value={form.privacyLevel.incentive.toString()}
            onChangeText={onIncentiveChange}
            placeholder="Duration"
            inputMode="numeric"
          />
          <Text style={styles.euro}>€</Text>
        </View>

        {error && <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>}
      </View>

      {/* High Risk */}
      <View style={styles.box}>
        <Text style={styles.boxHeader}>Low protection</Text>

        <Text style={styles.boxText}>
          What is the suitable incentive for your data donation in case of a hypothetical
          <Text style={{ fontWeight: 'bold' }}> high risk of re-identification?</Text>
        </Text>

        <Text style={styles.riskText}>
          {form.privacyLevel.highRisk} %
        </Text>

        <Slider
          style={{ width: '100%' }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={form.privacyLevel.highRisk}
          onValueChange={setPrivacyHighRisk}
        />
      </View>

      {/* Low Risk */}
      <View style={styles.box}>
        <Text style={styles.boxHeader}>High privacy</Text>

        <Text style={styles.boxText}>
          What is the suitable incentive for your data donation in case of a hypothetical
          <Text style={{ fontWeight: 'bold' }}> low risk of re-identification?</Text>
        </Text>

        <Text style={styles.riskText}>
          {form.privacyLevel.lowRisk} %
        </Text>

        <Slider
          style={{ width: '100%' }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={form.privacyLevel.lowRisk}
          onValueChange={setPrivacyLowRisk}
        />
      </View>

      <PrimaryButton onPress={onSubmit} title={'Next'} />
    </FormContainer>
  )
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#d7d7d7',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  boxHeader: {
    fontSize: 18,
    fontWeight: 500,
    textAlign: 'center',
  },
  boxText: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'justify',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginTop: 10,
    backgroundColor: '#fff',
    textAlign: 'center',
    height: 50,
    width: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 20,
    color: '#1d1d1f',
  },
  euro: {
    marginTop: 9,
    fontSize: 20,
    color: '#1d1d1f',
    marginLeft: 10,
  },
  riskText: {
    fontSize: 20,
    textAlign: 'center',
  }
});
