import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';

export default function DataSelection() {
  const navigation = useNavigation();

  const [steps, setSteps] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ListItem
          title={'Steps'}
          dataDescription={'Total steps'}
          data={512}
          icon={'footsteps'}
          onPress={() => setSteps(!steps)}
          selected={steps}
        />

        <PrimaryButton onPress={() => navigation.navigate('Purpose')} title={'Next'} />
      </ScrollView>
    </View>
  );
}

function ListItem({title, dataDescription, data, icon, onPress, selected}: {
  title: string,
  dataDescription: string,
  data: number|string,
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

  return (
    <TouchableOpacity style={listItemStyle} onPress={onPress}>
      {/* left side (text) */}
      <View style={{ gap: 4 }}>
        <Text style={listItemTitleStyle}>{title}</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text style={listItemDataDescriptionStyle}>{dataDescription}:</Text>
          <Text style={listItemDataStyle}>{data}</Text>
        </View>
      </View>

      {/* right side (icon) */}
      <Ionicons name={icon} size={36} color={selected ? '#fff' : '#6c6c6c'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    gap: 20,
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#d7d7d7',
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
  listItemDataSelected: {
    color: '#fff',
  },
});
