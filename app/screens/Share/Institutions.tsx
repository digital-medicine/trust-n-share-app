import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import FormContainer from '../../components/FormContainer.tsx';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useFormContext} from '../../contexts/FormContext';
import {useNavigation} from '@react-navigation/native';
import FormListItem from '../../components/FormListItem.tsx';


export default function Institutions()  {
  const navigation = useNavigation();
  const { form, toggleFormSelected } = useFormContext();

  return (
    <FormContainer>
      <FormListItem
        title="Universities"
        onPress={() => toggleFormSelected('institutions', 'universities')}
        selected={form.institutions.includes('universities')}
      />

      <FormListItem
        title="Government and Administration"
        onPress={() => toggleFormSelected('institutions', 'government')}
        selected={form.institutions.includes('government')}
      />

      <FormListItem
        title="Hospitals"
        onPress={() => toggleFormSelected('institutions', 'hospitals')}
        selected={form.institutions.includes('hospitals')}
      />

      <FormListItem
        title="Private companies"
        onPress={() => toggleFormSelected('institutions', 'companies')}
        selected={form.institutions.includes('companies')}
      />

      <FormListItem
        title="Insurance providers"
        onPress={() => toggleFormSelected('institutions', 'insurance')}
        selected={form.institutions.includes('insurance')}
      />

      <PrimaryButton onPress={() => navigation.navigate('Duration')} title={'Next'} />
    </FormContainer>
  );
}


