import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import {useFormStore} from '../../stores/form.ts';


export default function Congrats() {
  const form = useFormStore(state => state.form);
  const navigation = useNavigation();

  const formString = JSON.stringify(form, null, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Congratulations!</Text>

        <Text style={styles.subHeader}>
          Your chosen fitness activity data will now be shared with your chosen institutions.
        </Text>

        <Text>
          As soon as your data is bought, you can collect your compensation in the Profile section.
        </Text>

        <Text style={{ fontFamily: 'Courier' }}>{formString}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    alignItems: 'center',
    padding: 20,
  },
  container: {
    alignItems: 'center',
    padding: 20,
    gap: 40,
  },
  header: {
    paddingTop: 60,
    fontSize: 32,
    fontWeight: 'bold',
  },
  subHeader: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 500,
  }
})
