import FormContainer from '../../components/FormContainer.tsx';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useFormContext} from '../../contexts/FormContext';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import ErrorText from '../../components/ErrorText.tsx';

export default function Consumers() {
  const {form, toggleFormSelected, submitForm} = useFormContext();
  const navigation = useNavigation();

  const [error, setError] = useState<string|null>(null);

  function onSubmit() {
    // validate consumers
    if (form.consumers.length === 0) {
      setError('Please select at least one consumer.');
      return;
    }

    setError(null);

    submitForm();
    // @ts-ignore
    navigation.navigate('Congrats');
  }

  return (
    <FormContainer>
      <Item
        title="Uniklinik Bonn"
        score={100}
        onPress={() => toggleFormSelected('consumers', 'ukb')}
        selected={form.consumers.includes('ukb')}
      />

      <Item
        title="Uniklinik Jena"
        score={100}
        onPress={() => toggleFormSelected('consumers', 'ukj')}
        selected={form.consumers.includes('ukj')}
      />

      <Item
        title="CredibleCorp"
        score={50}
        onPress={() => toggleFormSelected('consumers', 'crediblecorp')}
        selected={form.consumers.includes('crediblecorp')}
      />

      <Item
        title="ShadyCorp"
        score={10}
        onPress={() => toggleFormSelected('consumers', 'shadycorp')}
        selected={form.consumers.includes('shadycorp')}
      />

      <ErrorText error={error} />

      <PrimaryButton onPress={onSubmit} title="Submit" />
    </FormContainer>
  );
}

interface ItemProps {
  title: string;
  score: number;
  onPress: () => void;
  selected: boolean;
}

function Item({ title, score, onPress, selected }: ItemProps) {
    const itemStyle = [
    styles.item,
    selected ? styles.itemSelected : null,
  ];
  const titleStyle = [
    styles.title,
    selected ? styles.titleSelected : null,
  ];
  const scoreStyle = {
    ...styles.score,
    backgroundColor: getTrafficLightColor(score),
  };

  return (
    <TouchableOpacity onPress={onPress} style={itemStyle}>
      <Text style={titleStyle}>{title}</Text>

      <Text style={scoreStyle}>Reputation: {score}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    backgroundColor: '#d7d7d7',
    padding: 20,
    borderRadius: 8,
    gap: 4,
  },
  itemSelected: {
    backgroundColor: '#4190e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
  },
  titleSelected: {
    color: '#fff',
  },
  score: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

function getTrafficLightColor(score: number): string {
  function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  function rgbToHex(r: number, g: number, b: number): string {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  // Clamp the score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  let red: number;
  let green: number;
  let blue = 0;

  if (score <= 50) {
    // From red to yellow
    red = 255;
    green = Math.round((score / 50) * 255);
  } else {
    // From yellow to green
    red = Math.round(255 - ((score - 50) / 50) * 255);
    green = 255;
  }

  // Convert RGB to hex code
  return rgbToHex(red, green, blue);
}

