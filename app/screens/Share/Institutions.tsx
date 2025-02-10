import FormContainer from '../../components/FormContainer.tsx';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import FormListItem from '../../components/FormListItem.tsx';
import {useState} from 'react';
import ErrorText from '../../components/ErrorText.tsx';
import {useFormStore} from '../../stores/form.ts';
import {translate} from '../../utils/localization.ts';
import {useFormOptionsStore} from '../../stores/formOptions.ts';

export default function Institutions() {
  const navigation = useNavigation();
  const form = useFormStore(state => state.form);
  const toggleFormSelected = useFormStore(state => state.toggleFormSelected);
  const formOptions = useFormOptionsStore(state => state.formOptions);

  const [error, setError] = useState<string | null>(null);

  const onSubmit = () => {
    if (form.institutions.length === 0) {
      setError(translate('upload.institutions.error-no-selection'));
      return;
    }

    setError(null);
    // @ts-ignore
    navigation.navigate('Duration');
  };

  return (
    <FormContainer>
      {formOptions.purposes.map(purpose => (
        <FormListItem
          key={purpose._id}
          title={purpose.name}
          onPress={() => toggleFormSelected('institutions', purpose._id)}
          selected={form.institutions.includes(purpose._id)}
        />
      ))}

      <ErrorText error={error} />

      {/*@ts-ignore*/}
      <PrimaryButton onPress={onSubmit} title={translate('general.next')} />
    </FormContainer>
  );
}
