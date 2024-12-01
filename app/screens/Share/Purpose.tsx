import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import FormContainer from '../../components/FormContainer.tsx';
import {useState} from 'react';
import PrimaryButton from '../../components/PrimaryButton.tsx';


export default function Purpose()  {
  const [selected, setSelected] = useState<string[]>([]);
  const toggleSelected = (key: string) => {
    if (selected.includes(key)) {
      setSelected(selected.filter((item) => item !== key));
    } else {
      setSelected([...selected, key]);
    }
  }

  const onSubmit = () => {
    // TODO
  }

  return (
    <FormContainer>
      <ListItem
        title="Pharmaceutical studies"
        onPress={() => toggleSelected('pharma')}
        selected={selected.includes('pharma')}
      />

      <ListItem
        title="Development of Medical equipment"
        onPress={() => toggleSelected('medical')}
        selected={selected.includes('medical')}
      />

      <ListItem
        title="Development of Fitness equipment"
        onPress={() => toggleSelected('fitness')}
        selected={selected.includes('fitness')}
      />

      <ListItem
        title="Improvement of Traffic"
        onPress={() => toggleSelected('traffic')}
        selected={selected.includes('traffic')}
      />

      <ListItem
        title="City planning"
        onPress={() => toggleSelected('city')}
        selected={selected.includes('city')}
      />

      <ListItem
        title="Market research"
        onPress={() => toggleSelected('marketing')}
        selected={selected.includes('marketing')}
      />

      <PrimaryButton onPress={onSubmit} title={'Next'} />
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
