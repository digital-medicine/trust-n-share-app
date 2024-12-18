import {StyleSheet, Text, View} from 'react-native';
import PrimaryButton from '../components/PrimaryButton.tsx';
import {useServiceAvailableStore} from '../stores/serviceAvailable.ts';


export default function Unavailable() {
  const setAvailable = useServiceAvailableStore(state => state.setAvailable);

  const retry = async () => {
    const testResponse = await fetch('http://87.106.82.135:8089/');

    if (testResponse.status !== 503) {
      setAvailable(true);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Service unavailable :(</Text>

      <PrimaryButton onPress={retry} title={"Retry"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    padding: 20,
    gap: 40,
  },
  header: {
    alignSelf: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
