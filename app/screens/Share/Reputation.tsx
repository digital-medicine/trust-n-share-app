import FormContainer from '../../components/FormContainer.tsx';
import {useNavigation} from '@react-navigation/native';
import {useFormContext} from '../../contexts/FormContext';
import {StyleSheet, Text, View} from 'react-native';
import Slider from '@react-native-community/slider';
import PrimaryButton from '../../components/PrimaryButton.tsx';


export default function Reputation() {
  const navigation = useNavigation();
  const {
    form,
    setReputation,
  } = useFormContext();

  return (
    <FormContainer>
      <View style={styles.box}>
        <Text style={styles.boxHeader}>Buyer Reputation</Text>

        <Text style={styles.boxText}>
          What reputation should a
          <Text style={{ fontWeight: 'bold' }}> buyer </Text>
          of your data set have as a
          <Text style={{ fontWeight: 'bold' }}> minimum</Text>
          ?
        </Text>

        <Text style={styles.reputationText}>
          {form.reputation} %
        </Text>

        <Slider
          style={{ width: '100%' }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={form.reputation}
          onValueChange={setReputation}
        />
      </View>

      <PrimaryButton onPress={() => navigation.navigate('Incentives')} title={'Next'} />
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
  reputationText: {
    fontSize: 20,
    textAlign: 'center',
  }
});
