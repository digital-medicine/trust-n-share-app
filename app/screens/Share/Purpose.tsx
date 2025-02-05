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
        title={translate("upload.purpose.pharma-studies")}
        onPress={() => toggleFormSelected('purposes', 'pharma-studies')}
        selected={form.purposes.includes('pharma-studies')}
      />

      <FormListItem
        title={translate("upload.purpose.medical-equipment")}
        onPress={() => toggleFormSelected('purposes', 'medical-equipment')}
        selected={form.purposes.includes('medical-equipment')}
      />

      <FormListItem
        title={translate("upload.purpose.fitness-equipment")}
        onPress={() => toggleFormSelected('purposes', 'fitness-equipment')}
        selected={form.purposes.includes('fitness-equipment')}
      />

      <FormListItem
        title={translate("upload.purpose.traffic")}
        onPress={() => toggleFormSelected('purposes', 'traffic')}
        selected={form.purposes.includes('traffic')}
      />

      <FormListItem
        title={translate("upload.purpose.city-planning")}
        onPress={() => toggleFormSelected('purposes', 'city-planning')}
        selected={form.purposes.includes('city-planning')}
      />

      <FormListItem
        title={translate("upload.purpose.market-research")}
        onPress={() => toggleFormSelected('purposes', 'market-research')}
        selected={form.purposes.includes('market-research')}
      />

      <ErrorText error={error} />

      <PrimaryButton onPress={onSubmit} title={translate("general.next")} />
    </FormContainer>
  );
}
