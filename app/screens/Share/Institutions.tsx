import FormContainer from '../../components/FormContainer.tsx';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import FormListItem from '../../components/FormListItem.tsx';
import {useState} from 'react';
import ErrorText from '../../components/ErrorText.tsx';
import {useFormStore} from '../../stores/form.ts';
import {translate} from '../../utils/localization.ts';


export default function Institutions()  {
  const navigation = useNavigation();
  const form = useFormStore(state => state.form);
  const toggleFormSelected = useFormStore(state => state.toggleFormSelected);

  const [error, setError] = useState<string|null>(null);

  const onSubmit = () => {
    if (form.institutions.length === 0) {
      setError(translate("upload.institutions.error-no-selection"));
      return;
    }

    setError(null);
    // @ts-ignore
    navigation.navigate('Duration');
  }

  return (
    <FormContainer>
      <FormListItem
        title={translate("upload.institutions.universities")}
        onPress={() => toggleFormSelected('institutions', 'universities')}
        selected={form.institutions.includes('universities')}
      />

      <FormListItem
        title={translate("upload.institutions.government")}
        onPress={() => toggleFormSelected('institutions', 'government')}
        selected={form.institutions.includes('government')}
      />

      <FormListItem
        title={translate("upload.institutions.hospitals")}
        onPress={() => toggleFormSelected('institutions', 'hospitals')}
        selected={form.institutions.includes('hospitals')}
      />

      <FormListItem
        title={translate("upload.institutions.companies")}
        onPress={() => toggleFormSelected('institutions', 'companies')}
        selected={form.institutions.includes('companies')}
      />

      <FormListItem
        title={translate("upload.institutions.insurance")}
        onPress={() => toggleFormSelected('institutions', 'insurance')}
        selected={form.institutions.includes('insurance')}
      />

      <ErrorText error={error} />

      {/*@ts-ignore*/}
      <PrimaryButton onPress={onSubmit} title={translate("general.next")} />
    </FormContainer>
  );
}


