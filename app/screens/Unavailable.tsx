import {StyleSheet, Text, View} from 'react-native';
import PrimaryButton from '../components/PrimaryButton.tsx';
import {useServiceAvailableStore} from '../stores/serviceAvailable.ts';
import Config from 'react-native-config';
import {translate} from '../utils/localization.ts';

export default function Unavailable() {
  const setAvailable = useServiceAvailableStore(state => state.setAvailable);

  const retry = async () => {
    const testResponse = await fetch(Config.API_URL);

    if (testResponse.status !== 503) {
      setAvailable(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{translate('unavailable.header')}</Text>

      <PrimaryButton onPress={retry} title={translate('unavailable.retry')} />
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
