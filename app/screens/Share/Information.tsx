import {useNavigation} from '@react-navigation/native';
import FormContainer from '../../components/FormContainer.tsx';
import {StyleSheet, Text} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {translate} from '../../utils/localization.ts';


export default function Information() {
  const navigation = useNavigation();

  return (
    <FormContainer>
      <Text style={styles.textbox}>
        {translate("upload.information.text")}
      </Text>

      {/* @ts-ignore */}
      <PrimaryButton onPress={() => navigation.navigate('PrivacyLevel')} title={translate("general.next")} />
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
