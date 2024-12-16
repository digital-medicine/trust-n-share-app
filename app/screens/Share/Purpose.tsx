import FormContainer from '../../components/FormContainer.tsx';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import FormListItem from '../../components/FormListItem.tsx';
import {useState} from 'react';
import ErrorText from '../../components/ErrorText.tsx';
import {useFormOptions} from '../../contexts/FormOptionsContext';
import {useFormStore} from '../../stores/form.ts';


export default function Purpose()  {
  const navigation = useNavigation();
  const form = useFormStore(state => state.form);
  const toggleFormSelected = useFormStore(state => state.toggleFormSelected);
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
