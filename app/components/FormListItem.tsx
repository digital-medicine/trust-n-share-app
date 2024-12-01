import {StyleSheet, Text, TouchableOpacity} from 'react-native';


export default function FormListItem({ title, onPress, selected}: {
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
