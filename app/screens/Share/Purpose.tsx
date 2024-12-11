import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import FormContainer from '../../components/FormContainer.tsx';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useFormContext} from '../../contexts/FormContext';
import {useNavigation} from '@react-navigation/native';
import FormListItem from '../../components/FormListItem.tsx';
import {useEffect, useState} from 'react';
import ErrorText from '../../components/ErrorText.tsx';
import {useFormOptions} from '../../contexts/FormOptionsContext';


export default function Purpose()  {
  const navigation = useNavigation();
  const { form, toggleFormSelected } = useFormContext();
  const { formOptions } = useFormOptions();

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
      {formOptions.purposes.map((purpose) => (
        <FormListItem
          key={purpose._id}
          title={purpose.name}
          onPress={() => toggleFormSelected('purposes', purpose._id)}
          selected={form.purposes.includes(purpose._id)}
        />
      ))}

      <ErrorText error={error} />

      <PrimaryButton onPress={onSubmit} title={'Next'} />
    </FormContainer>
  );
}
