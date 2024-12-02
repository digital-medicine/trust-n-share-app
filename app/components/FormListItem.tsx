import {StyleSheet, Text, TouchableOpacity} from 'react-native';

interface FormListItemProps {
  title: string;
  description?: string;
  onPress: () => void;
  selected: boolean;
}

export default function FormListItem({ title, description, onPress, selected }: FormListItemProps) {
  const listItemStyle = [
    styles.listItem,
    selected ? styles.listItemSelected : null,
  ];
  const listItemTitleStyle = [
    styles.listItemTitle,
    selected ? styles.listItemTitleSelected : null,
  ];
  const listItemDescriptionStyle = [
    styles.listItemDescription,
    selected ? styles.listItemDescriptionSelected : null,
  ];

  return (
    <TouchableOpacity style={listItemStyle} onPress={onPress}>
      <Text style={listItemTitleStyle}>{title}</Text>
      {description && <Text style={listItemDescriptionStyle}>{description}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#d7d7d7',
    padding: 20,
    borderRadius: 8,
    gap: 4,
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
  listItemDescription: {
    fontSize: 16,
    color: '#4f4f4f',
  },
  listItemDescriptionSelected: {
    color: '#fff',
  },
});
