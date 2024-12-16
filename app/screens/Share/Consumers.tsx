import FormContainer from '../../components/FormContainer.tsx';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import ErrorText from '../../components/ErrorText.tsx';
import {getConsumers} from '../../utils/restApi.ts';
import {useAuthStore} from '../../stores/auth.ts';
import {useFormStore} from '../../stores/form.ts';

export default function Consumers() {
  const form = useFormStore(state => state.form);
  const toggleFormSelected = useFormStore(state => state.toggleFormSelected);
  const submitForm = useFormStore(state => state.submitForm);
  const navigation = useNavigation();
  const userId = useAuthStore(state => state.userId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [consumers, setConsumers] = useState([
    { title: "Uniklinik Bonn", score: 100, id: "ukb" },
    { title: "Uniklinik Jena", score: 100, id: "ukj" },
    { title: "CredibleCorp", score: 50, id: "crediblecorp" },
    { title: "ShadyCorp", score: 10, id: "shadycorp" },
  ]); // TODO: initialize with empty array when fetched from API

  useEffect(() => {
    const fetchConsumers = async () => {
      // Fetch consumers
      const response = await getConsumers();
      console.log("Consumers Response", response);
      if (response.error) {
        setError(response.error);
        return;
      }
      setConsumers(response.json.consumer);
    }
    fetchConsumers().finally(() => {
      setLoading(false);
    });
  }, []);

  function onSubmit() {
    if (form.consumers.length === 0) {
      setError("Please select at least one consumer.");
      return;
    }

    setError(null);

    submitForm(userId)
      .then(() => {
        console.log("Submitted!");
        // @ts-ignore
        navigation.navigate("Congrats");
      })
      .catch((e) => {
        const message = "Could not submit: " + e.message;
        console.error(message);
        setError(message);
      });
  }

  return (
    <FormContainer>
      {loading
        ? <Text>Loading...</Text>
        : consumers.map((item) => (
          <Item
            key={item._id}
            title={item.username}
            score={item.consumerInfo.reputation}
            onPress={() => toggleFormSelected("consumers", item._id)}
            selected={form.consumers.includes(item._id)}
          />
        ))}

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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
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

  // Clamp
  score = Math.max(0, Math.min(10, score));

  let red: number;
  let green: number;
  let blue = 0;

  if (score <= 5) {
    // From red to yellow
    red = 255;
    green = Math.round((score / 5) * 255);
  } else {
    // From yellow to green
    red = Math.round(255 - ((score - 5) / 5) * 255);
    green = 255;
  }

  // Convert RGB to hex code
  return rgbToHex(red, green, blue);
}

