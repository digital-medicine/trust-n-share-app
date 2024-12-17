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
  const setPrivacyLevel = useFormStore(state => state.setPrivacyLevel);

  const [incentiveInput, setIncentiveInput] = useState<string>(form.privacyLevel.incentive.toString());
  const [incentive, setIncentive] = useState<number>(form.privacyLevel.incentive);
  const [highRisk, setHighRisk] = useState<number>(form.privacyLevel.highRisk);
  const [lowRisk, setLowRisk] = useState<number>(form.privacyLevel.lowRisk);

  const [privacyHighRiskBounds, setPrivacyHighRiskBounds] = useState<{min: number, max: number}|null>(null);
  const [privacyLowRiskBounds, setPrivacyLowRiskBounds] = useState<{min: number, max: number}|null>(null);
  const [incentiveError, setIncentiveError] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    fetchPrivacyHighRiskBounds();
    fetchPrivacyLowRiskBounds();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchPrivacyHighRiskBounds();
      await fetchPrivacyLowRiskBounds();
    };

    fetchData();
  }, [incentive]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchPrivacyLowRiskBounds();
    };

    fetchData();
  }, [incentive, highRisk]);

  const fetchPrivacyHighRiskBounds = async () => {
    setPrivacyHighRiskBounds(null);

    try {
      const response = await getPrivacyHighRisk(incentive);
      if (response.status !== 200) {
        setError(response.json.message);
        return;
      }

      const min = response.json.data[0];
      const max = response.json.data[1];
      console.log("Privacy High Risk Bounds", min, max);
      setPrivacyHighRiskBounds({ min, max });

      // If the selected value is outside the new bounds, adjust it
      if (highRisk < min) {
        setHighRisk(min);
      } else if (highRisk > max) {
        setHighRisk(max);
      }
    } catch (e) {
      console.error("getPrivacyHighRisk error", e.toString());
      setError(e.message);
    }
  };

  const fetchPrivacyLowRiskBounds = async () => {
    setPrivacyLowRiskBounds(null);

    try {
      const response = await getPrivacyLowRisk(
        incentive,
        highRisk
      );
      if (response.status !== 200) {
        setError(response.json.message);
        return;
      }

      const min = response.json.data[0];
      const max = response.json.data[1];
      console.log("Privacy Low Risk Bounds", min, max);
      setPrivacyLowRiskBounds({ min, max });

      // If the selected value is outside the new bounds, adjust it
      if (lowRisk < min) {
        setLowRisk(min);
      } else if (lowRisk > max) {
        setLowRisk(max);
      }
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  const onIncentiveChange = async (value: string) => {
    setIncentiveInput(value);

    const incentive = parseFloat(value);
    if (!validateIncentive(incentive)) {
      return;
    }
    setIncentive(incentive);
    console.log("Incentive set to", incentive);
  };

  const validateIncentive = (value: number) => {
    if (isNaN(value)) {
      setIncentiveError('Incentive must be a number');
      return false;
    }
    if (value < 0) {
      setIncentiveError('Incentive must be positive');
      return false;
    }

    setIncentiveError(null);
    return true;
  }

  const onSubmit = () => {
    if (!validateIncentive(incentive)) return;

    setPrivacyLevel({
      incentive,
      highRisk,
      lowRisk,
    });

    // @ts-ignore
    navigation.navigate('Reputation');
  }

  const toEuro = (value: number) => {
    return value.toFixed(2).replace('.', ',') + ' €';
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
            value={incentiveInput}
            onChangeText={onIncentiveChange}
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
          {toEuro(highRisk)}
        </Text>

        {privacyHighRiskBounds !== null
          ? <View>
              <Slider
                style={styles.slider}
                minimumValue={privacyHighRiskBounds.min}
                maximumValue={privacyHighRiskBounds.max}
                step={0.01}
                value={highRisk}
                onSlidingComplete={setHighRisk}
              />
              <View style={styles.sliderBoundContainer}>
                <Text style={styles.sliderBoundMin}>{toEuro(privacyHighRiskBounds.min)}</Text>
                <Text style={styles.sliderBoundMax}>{toEuro(privacyHighRiskBounds.max)}</Text>
              </View>
            </View>
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
          {toEuro(lowRisk)}
        </Text>

        {privacyLowRiskBounds !== null
          ? <View>
              <Slider
                style={styles.slider}
                minimumValue={privacyLowRiskBounds.min}
                maximumValue={privacyLowRiskBounds.max}
                step={0.01}
                value={lowRisk}
                onSlidingComplete={setLowRisk}
              />
              <View style={styles.sliderBoundContainer}>
                <Text style={styles.sliderBoundMin}>{toEuro(privacyLowRiskBounds.min)}</Text>
                <Text style={styles.sliderBoundMax}>{toEuro(privacyLowRiskBounds.max)}</Text>
              </View>
            </View>
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
  slider: {
    flex: 6,
  },
  sliderBoundContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderBoundMin: {
    flex: 1,
    fontSize: 16,
    color: '#5e5e5e',
  },
  sliderBoundMax: {
    flex: 1,
    fontSize: 16,
    color: '#5e5e5e',
    textAlign: 'right',
  },
  euro: {
    marginTop: 9,
    fontSize: 20,
    color: '#1d1d1f',
    marginLeft: 10,
  },
  riskText: {
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  loading: {
    alignSelf: 'center',
    color: '#5e5e5e',
  }
});
