import { useNavigation } from '@react-navigation/native';
import FormContainer from '../../components/FormContainer.tsx';
import FormListItem from '../../components/FormListItem.tsx';
import {useFormContext} from '../../contexts/FormContext';
import PrimaryButton from '../../components/PrimaryButton.tsx';


export default function Incentives() {
  const navigation = useNavigation();
  const { form, toggleFormSelected } = useFormContext();

  return (
    <FormContainer>
      <FormListItem
        title="Vouchers"
        description="Receive vouchers for various stores and services as a token of appreciation"
        onPress={() => toggleFormSelected('incentives', 'vouchers')}
        selected={form.incentives.includes('vouchers')}
      />

      <FormListItem
        title="Results of the study"
        description="Get exclusive access to the results of the study you participated in"
        onPress={() => toggleFormSelected('incentives', 'studyResults')}
        selected={form.incentives.includes('studyResults')}
      />

      <FormListItem
        title="Donations for institutes"
        description="Contribute to educational and research institues through your participation"
        onPress={() => toggleFormSelected('incentives', 'institutes')}
        selected={form.incentives.includes('institutes')}
      />

      <FormListItem
        title="Purpose of data use"
        description="Understand how your data will be used and for what purposes"
        onPress={() => toggleFormSelected('incentives', 'purpose')}
        selected={form.incentives.includes('purpose')}
      />

      <FormListItem
        title="Fincancial compensation"
        description="Recieve a final compensation for your valuable participation"
        onPress={() => toggleFormSelected('incentives', 'money')}
        selected={form.incentives.includes('money')}
      />

      <PrimaryButton onPress={() => navigation.navigate('Consumers')} title={'Next'} />
    </FormContainer>
  )
}
