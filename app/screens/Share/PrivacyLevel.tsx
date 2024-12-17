import {useNavigation} from '@react-navigation/native';
import FormContainer from '../../components/FormContainer.tsx';
import {StyleSheet, Text, View} from 'react-native';
import FormTextInput from '../../components/FormTextInput.tsx';
import Slider from '@react-native-community/slider';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useEffect, useState} from 'react';
import ErrorText from '../../components/ErrorText.tsx';
import {getPrivacyLowRisk, getPrivacyHighRisk} from '../../utils/restApi.ts';
import {useFormStore} from '../../stores/form.ts';

export default function PrivacyLevel() {
  const navigation = useNavigation();

  const form = useFormStore(state => state.form);
  const setPrivacyIncentive = useFormStore(state => state.setPrivacyIncentive);
  const setPrivacyHighRisk = useFormStore(state => state.setPrivacyHighRisk);
  const setPrivacyLowRisk = useFormStore(state => state.setPrivacyLowRisk);

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

        const min = response.json.data[0];
        const max = response.json.data[1];
        setPrivacyHighRiskBounds({
          min,
          max,
        });
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

        const min = response.json.data[0];
        const max = response.json.data[1];
        setPrivacyLowRiskBounds({
            min,
            max,
          });
      })
      .catch(e => {
        console.error(e);
        setError(e.message);
      });
  }

  const onIncentiveChange = (incentive) => {
    validateIncentive(incentive);

    setPrivacyIncentive(incentive);

    fetchPrivacyHighRiskBounds();
    fetchPrivacyLowRiskBounds();
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
          Imagine that your data is now somewhat obfuscated.
          Compared to the original data, the risk that the data can be used to draw conclusions about you is reduced by
          10% (e.g. before it was possible to draw conclusions in 10 out of 100 cases, after in 9 out of 100 cases).
        </Text>
        <Text style={styles.boxText}>
          This makes the data less interesting.
          How much of the incentive promised for the original data would you sacrifice?
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
          Now significantly more details are being concealed.
          Compared to the original data, the risk that the data can be used to draw conclusions about you is reduced by
          90% (e.g. before it was possible to draw conclusions in 10 out of 100 cases, after in 1 out of 100 cases).
        </Text>
        <Text style={styles.boxText}>
          How much is this protection worth to you?
          What proportion of the incentives promised for the original data do you want to retain?
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
