import {useNavigation} from '@react-navigation/native';
import {useFormContext} from '../../contexts/FormContext';
import FormContainer from '../../components/FormContainer.tsx';
import {StyleSheet, Text} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton.tsx';


export default function Information() {
  const navigation = useNavigation();

  return (
    <FormContainer>
      <Text style={styles.textbox}>
        We can protect your data by obscuring details.
        We can obscure them to a greater or lesser extent.
        The stronger the protection, the less useful the data.
        Therefore, the next questions help us to assess how much protection is worth to you.
        Then we can make you suitable offers.
      </Text>

      {/* @ts-ignore */}
      <PrimaryButton onPress={() => navigation.navigate('PrivacyLevel')} title={'Next'} />
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  textbox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: '#d7d7d7',
    textAlign: 'justify',
    lineHeight: 20,
  }
});
