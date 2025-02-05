import { useNavigation } from '@react-navigation/native';
import FormContainer from '../../components/FormContainer.tsx';
import FormListItem from '../../components/FormListItem.tsx';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useState} from 'react';
import ErrorText from '../../components/ErrorText.tsx';
import {useFormStore} from '../../stores/form.ts';
import {translate} from '../../utils/localization.ts';


export default function Incentives() {
  const navigation = useNavigation();
  const form = useFormStore(state => state.form);
  const toggleFormSelected = useFormStore(state => state.toggleFormSelected);

  const [error, setError] = useState<string|null>(null);

  const onSubmit = () => {
    if (form.incentives.length === 0) {
      setError(translate("upload.incentives.error-no-selection"));
      return;
    }

    setError(null);
    // @ts-ignore
    navigation.navigate('Consumers');
  }

  return (
    <FormContainer>
      {/*{formOptions.incentives.map((incentive) => (
        <FormListItem
          key={incentive._id}
          title={incentive.name}
          onPress={() => toggleFormSelected('incentives', incentive._id)}
          selected={form.incentives.includes(incentive._id)}
        />
      ))}*/}

      <FormListItem
        title={translate("upload.incentives.cash")}
        onPress={() => toggleFormSelected('incentives', 'cash')}
        selected={form.incentives.includes('cash')}
      />

      <FormListItem
        title={translate("upload.incentives.voucher-1")}
        onPress={() => toggleFormSelected('incentives', 'voucher-1')}
        selected={form.incentives.includes('voucher-1')}
      />

      <FormListItem
        title={translate("upload.incentives.voucher-2")}
        onPress={() => toggleFormSelected('incentives', 'voucher-2')}
        selected={form.incentives.includes('voucher-2')}
      />

      <FormListItem
        title={translate("upload.incentives.voucher-3")}
        onPress={() => toggleFormSelected('incentives', 'voucher-3')}
        selected={form.incentives.includes('voucher-3')}
      />

      <FormListItem
        title={translate("upload.incentives.voucher-4")}
        onPress={() => toggleFormSelected('incentives', 'voucher-4')}
        selected={form.incentives.includes('voucher-4')}
      />

      <ErrorText error={error} />

      <PrimaryButton onPress={onSubmit} title={translate("general.next")} />
    </FormContainer>
  )
}
