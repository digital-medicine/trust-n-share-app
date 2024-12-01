import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import FormContainer from '../../components/FormContainer.tsx';
import {useState} from 'react';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useFormContext} from '../../contexts/FormContext';
import {useNavigation} from '@react-navigation/native';


export default function Purpose()  {
  const navigation = useNavigation();
  const { form, toggleFormSelected } = useFormContext();

  return (
    <FormContainer>
      <ListItem
        title="Pharmaceutical studies"
        onPress={() => toggleFormSelected('purposes', 'pharma')}
        selected={form.purposes.includes('pharma')}
      />

      <ListItem
        title="Development of Medical equipment"
        onPress={() => toggleFormSelected('purposes', 'medical')}
        selected={form.purposes.includes('medical')}
      />

      <ListItem
        title="Development of Fitness equipment"
        onPress={() => toggleFormSelected('purposes', 'fitness')}
        selected={form.purposes.includes('fitness')}
      />

      <ListItem
        title="Improvement of Traffic"
        onPress={() => toggleFormSelected('purposes', 'traffic')}
        selected={form.purposes.includes('traffic')}
      />

      <ListItem
        title="City planning"
        onPress={() => toggleFormSelected('purposes', 'city')}
        selected={form.purposes.includes('city')}
      />

      <ListItem
        title="Market research"
        onPress={() => toggleFormSelected('purposes', 'marketing')}
        selected={form.purposes.includes('marketing')}
      />

      <PrimaryButton onPress={() => navigation.navigate('Institutions')} title={'Next'} />
    </FormContainer>
  );
}

function ListItem({ title, onPress, selected}: {
  title: string;
  onPress: () => void;
  selected: boolean;
}) {
  const listItemStyle = [
    styles.listItem,
    selected ? styles.listItemSelected : null,
  ];
  const listItemTitleStyle = [
    styles.listItemTitle,
    selected ? styles.listItemTitleSelected : null,
  ];

  return (
    <TouchableOpacity style={listItemStyle} onPress={onPress}>
      <Text style={listItemTitleStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#d7d7d7',
    padding: 20,
    borderRadius: 8,
  },
  listItemSelected: {
    backgroundColor: '#4190e0',
  },
  listItemTitle: {
    fontSize: 18,
  },
  listItemTitleSelected: {
    color: '#fff',
  },
});
