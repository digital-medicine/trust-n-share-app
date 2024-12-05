import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import FormContainer from '../../components/FormContainer.tsx';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useFormContext} from '../../contexts/FormContext';
import {useNavigation} from '@react-navigation/native';
import FormListItem from '../../components/FormListItem.tsx';
import {useState} from 'react';
import ErrorText from '../../components/ErrorText.tsx';


export default function Purpose()  {
  const navigation = useNavigation();
  const { form, toggleFormSelected } = useFormContext();

  const [error, setError] = useState<string|null>(null);

  const onSubmit = () => {
    if (form.purposes.length === 0) {
      setError('Please select at least one purpose.');
      return;
    }

    setError(null);
    // @ts-ignore
    navigation.navigate('Institutions');
  }

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

      <ErrorText error={error} />

      <PrimaryButton onPress={onSubmit} title={'Next'} />
    </FormContainer>
  );
}
