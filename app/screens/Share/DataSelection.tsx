import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useEffect, useState} from 'react';
import FormContainer from '../../components/FormContainer.tsx';
import ErrorText from '../../components/ErrorText.tsx';
import {getIncentives, getPurposes} from '../../utils/restApi.ts';
import {useFormOptions} from '../../contexts/FormOptionsContext';
import {useFormStore} from '../../stores/form.ts';
import {useHealthStore} from '../../stores/health.ts';

export default function DataSelection() {
  const navigation = useNavigation();
  const form = useFormStore(state => state.form);
  const toggleFormSelected = useFormStore(state => state.toggleFormSelected);
  const { formOptions, setIncentives, setPurposes } = useFormOptions();
  const healthData = useHealthStore(state => state.healthData);

  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<number|null>(null);
  const [energyBurned, setEnergyBurned] = useState<number|null>(null);

  const [error, setError] = useState<string|null>(null);

  // Fetch form options and aggregate health data for display
  useEffect(() => {
    // aggregate total steps
    if (healthData.steps && healthData.steps.length > 0) {
      const totalSteps = Math.round(healthData.steps.reduce((acc, entry) => acc + entry.value, 0));
      setSteps(totalSteps);
    }

    // aggregate total energy burned
    if (healthData.energyBurned && healthData.energyBurned.length > 0) {
      const totalEnergyBurned = Math.round(healthData.energyBurned.reduce((acc, entry) => acc + entry.value, 0));
      setEnergyBurned(totalEnergyBurned);
    }

    const fetchFormOptions = async () => {
      // fetch incentives
      const incentivesResponse = await getIncentives();
      if (incentivesResponse.error) {
        setError(incentivesResponse.error);
      }
      setIncentives(incentivesResponse.json.incentiveTypes);

      // fetch purposes
      const purposesResponse = await getPurposes();
      if (purposesResponse.error) {
        setError(purposesResponse.error);
      }
      setPurposes(purposesResponse.json.organizations);
    }
    fetchFormOptions().then(() => {
      setLoading(false);
      console.log("formOptions", formOptions);
    });


  }, []);

  const onSubmit = () => {
    // validate form
    if (form.data.length === 0) {
      setError('Please select at least one data type.');
      return;
    }

    setError(null);
    // @ts-ignore
    navigation.navigate('Purpose');
  }

  return (
    <FormContainer>
      {loading ? (
        <Text style={styles.loading}>Loading ...</Text>
      ) : (
        <>
          <ListItem
            title={'Steps'}
            dataDescription={'Total steps'}
            data={steps}
            icon={'footsteps'}
            onPress={() => toggleFormSelected('data', 'steps')}
            selected={form.data.includes('steps')}
          />
          <ListItem
            title={'Energy Burned'}
            dataDescription={'Total energy burned'}
            data={energyBurned}
            icon={'flame'}
            onPress={() => toggleFormSelected('data', 'energyBurned')}
            selected={form.data.includes('energyBurned')}
          />
        </>
      )}

      <ErrorText error={error} />

      <PrimaryButton onPress={onSubmit} title={'Next'} />
    </FormContainer>
  );
}

function ListItem({title, dataDescription, data, icon, onPress, selected}: {
  title: string,
  dataDescription: string,
  data: number|string|null,
  icon: string,
  onPress: () => void,
  selected: boolean,
}) {
  const listItemStyle = [
    styles.listItem,
    selected ? styles.listItemSelected : null,
  ];
  const listItemTitleStyle = [
    styles.listItemTitle,
    selected ? styles.listItemTitleSelected : null,
  ];
  const listItemDataDescriptionStyle = [
    styles.listItemDataDescription,
    selected ? styles.listItemDataDescriptionSelected : null,
  ];
  const listItemDataStyle = [
    styles.listItemData,
    selected ? styles.listItemDataSelected : null,
  ];
  const listItemNoDataStyle = [
    styles.listItemNoData,
    selected ? styles.listItemDataSelected : null,
  ];

  return (
    <TouchableOpacity style={listItemStyle} onPress={onPress}>
      {/* left side (text) */}
      <View style={{ gap: 4 }}>
        <Text style={listItemTitleStyle}>{title}</Text>

        <View style={{ flexDirection: "row", gap: 6 }}>
          <Text style={listItemDataDescriptionStyle}>{dataDescription}:</Text>
          {data !== null
            ? <Text style={listItemDataStyle}>{data}</Text>
            : <Text style={listItemNoDataStyle}>No data</Text>
          }
        </View>
      </View>

      {/* right side (icon) */}
      <Ionicons name={icon} size={36} color={selected ? '#fff' : '#6c6c6c'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  listItemSelected: {
    backgroundColor: '#4190e0',
  },
  listItemTitle: {
    fontSize: 20,
    color: '#343434',
  },
  listItemTitleSelected: {
    color: '#fff',
  },
  listItemDataDescription: {
    fontSize: 16,
    color: '#727272',
  },
  listItemDataDescriptionSelected: {
    color: '#fff',
  },
  listItemData: {
    fontSize: 16,
    color: '#4f4f4f',
  },
  listItemNoData: {
    fontSize: 16,
    color: '#989898',
  },
  listItemDataSelected: {
    color: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
