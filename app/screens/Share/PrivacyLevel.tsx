import {useNavigation} from '@react-navigation/native';
import {useFormContext} from '../../contexts/FormContext';
import FormContainer from '../../components/FormContainer.tsx';
import {StyleSheet, Text, View} from 'react-native';
import FormTextInput from '../../components/FormTextInput.tsx';
import Slider from '@react-native-community/slider';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useEffect, useState} from 'react';
import ErrorText from '../../components/ErrorText.tsx';
import {getPrivacyLowRisk, getPrivacyHighRisk} from '../../utils/restApi.ts';

export default function PrivacyLevel() {
  const navigation = useNavigation();
  const {
    form,
    setPrivacyIncentive,
    setPrivacyHighRisk,
    setPrivacyLowRisk,
  } = useFormContext();

  const [privacyHighRiskBounds, setPrivacyHighRiskBounds] = useState<{min: number, max: number}|null>(null);
  const [privacyLowRiskBounds, setPrivacyLowRiskBounds] = useState<{min: number, max: number}|null>(null);
  const [incentiveError, setIncentiveError] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    fetchPrivacyHighRiskBounds();
    fetchPrivacyLowRiskBounds();
  }, []);

  const fetchPrivacyHighRiskBounds = () => {
    getPrivacyHighRisk(form.privacyLevel.incentive)
      .then(response => {
        if (response.status !== 200) {
          setError(response.json.message);
          return;
        }

        console.log(response.json);
        setPrivacyHighRiskBounds(response.json);
      })
      .catch(e => {
        console.error("getPrivacyHighRisk error", e.toString());
        setError(e.message);
      });
  }

  const fetchPrivacyLowRiskBounds = () => {
    getPrivacyLowRisk(form.privacyLevel.incentive, form.privacyLevel.lowRisk)
      .then(response => {
        if (response.status !== 200) {
          setError(response.json.message);
          return;
        }

        console.log(response.json);
        setPrivacyLowRiskBounds(response.json);
      })
      .catch(e => {
        console.error(e);
        setError(e.message);
      });
  }

  const onIncentiveChange = (incentive) => {
    validateIncentive(incentive);

    fetchPrivacyHighRiskBounds();
    fetchPrivacyLowRiskBounds();

    setPrivacyIncentive(incentive);
  };

  const validateIncentive = (incentive: number) => {
    if (isNaN(incentive)) {
      setIncentiveError('Incentive must be a number');
      return false;
    }
    if (incentive < 0) {
      setIncentiveError('Incentive must be positive');
      return false;
    }

    setIncentiveError(null);
    return true;
  }

  const onSubmit = () => {
    if (!validateIncentive(form.privacyLevel.incentive)) return;

    // @ts-ignore
    navigation.navigate('Reputation');
  }

  return (
    <FormContainer>
      <ErrorText error={error} />

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

        {/*{error && <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>}*/}
        <ErrorText error={incentiveError} />
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

        {privacyHighRiskBounds !== null
          ? <Slider
            style={{ width: '100%' }}
            minimumValue={privacyHighRiskBounds.min}
            maximumValue={privacyHighRiskBounds.max}
            value={form.privacyLevel.highRisk}
            onValueChange={setPrivacyHighRisk}
          />

          : <Text style={styles.loading}>Loading ...</Text>
        }
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

        {privacyLowRiskBounds !== null
          ? <Slider
            style={{ width: '100%' }}
            minimumValue={privacyLowRiskBounds.min}
            maximumValue={privacyLowRiskBounds.max}
            value={form.privacyLevel.lowRisk}
            onValueChange={setPrivacyLowRisk}
          />

          : <Text style={styles.loading}>Loading ...</Text>
        }
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
  },
  loading: {
    alignSelf: 'center',
    color: '#5e5e5e',
  }
});
