import FormContainer from '../../components/FormContainer.tsx';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import FormListItem from '../../components/FormListItem.tsx';
import {useState} from 'react';
import ErrorText from '../../components/ErrorText.tsx';
import {useFormStore} from '../../stores/form.ts';
import {useFormOptionsStore} from '../../stores/formOptions.ts';
import {translate} from '../../utils/localization.ts';


export default function Purpose()  {
  const navigation = useNavigation();
  const form = useFormStore(state => state.form);
  const toggleFormSelected = useFormStore(state => state.toggleFormSelected);

  const [error, setError] = useState<string|null>(null);

  const onSubmit = () => {
    if (form.purposes.length === 0) {
      setError(translate("upload.purpose.error-no-selection"));
      return;
    }

    setError(null);
    // @ts-ignore
    navigation.navigate('Institutions');
  }

  return (
    <FormContainer>


      <FormListItem
        title={translate("upload.purpose.universities")}
        onPress={() => toggleFormSelected('purposes', 'universities')}
        selected={form.purposes.includes('universities')}
      />

      <FormListItem
        title={translate("upload.purpose.government")}
        onPress={() => toggleFormSelected('purposes', 'government')}
        selected={form.purposes.includes('government')}
      />

      <FormListItem
        title={translate("upload.purpose.hospitals")}
        onPress={() => toggleFormSelected('purposes', 'hospitals')}
        selected={form.purposes.includes('hospitals')}
      />

      <FormListItem
        title={translate("upload.purpose.companies")}
        onPress={() => toggleFormSelected('purposes', 'companies')}
        selected={form.purposes.includes('companies')}
      />

      <FormListItem
        title={translate("upload.purpose.insurance")}
        onPress={() => toggleFormSelected('purposes', 'insurance')}
        selected={form.purposes.includes('insurance')}
      />

      <ErrorText error={error} />

      <PrimaryButton onPress={onSubmit} title={translate("general.next")} />
    </FormContainer>
  );
}
