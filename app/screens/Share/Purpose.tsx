import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import FormContainer from '../../components/FormContainer.tsx';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useFormContext} from '../../contexts/FormContext';
import {useNavigation} from '@react-navigation/native';
import FormListItem from '../../components/FormListItem.tsx';


export default function Purpose()  {
  const navigation = useNavigation();
  const { form, toggleFormSelected } = useFormContext();

  return (
    <FormContainer>
      <FormListItem
        title="Pharmaceutical studies"
        onPress={() => toggleFormSelected('purposes', 'pharma')}
        selected={form.purposes.includes('pharma')}
      />

      <FormListItem
        title="Development of Medical equipment"
        onPress={() => toggleFormSelected('purposes', 'medical')}
        selected={form.purposes.includes('medical')}
      />

      <FormListItem
        title="Development of Fitness equipment"
        onPress={() => toggleFormSelected('purposes', 'fitness')}
        selected={form.purposes.includes('fitness')}
      />

      <FormListItem
        title="Improvement of Traffic"
        onPress={() => toggleFormSelected('purposes', 'traffic')}
        selected={form.purposes.includes('traffic')}
      />

      <FormListItem
        title="City planning"
        onPress={() => toggleFormSelected('purposes', 'city')}
        selected={form.purposes.includes('city')}
      />

      <FormListItem
        title="Market research"
        onPress={() => toggleFormSelected('purposes', 'marketing')}
        selected={form.purposes.includes('marketing')}
      />

      <PrimaryButton onPress={() => navigation.navigate('Institutions')} title={'Next'} />
    </FormContainer>
  );
}
