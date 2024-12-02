import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useFormContext} from '../../contexts/FormContext';
import PrimaryButton from '../../components/PrimaryButton.tsx';


export default function Congrats() {
  const { form } = useFormContext();

  const formString = JSON.stringify(form, null, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Congratulations!</Text>

        <Text style={styles.subHeader}>
          Your chosen fitness activity data will now be shared with your chosen institutions.
        </Text>

        <PrimaryButton
          onPress={() => {}}
          title="Select compensations"
          style={{ alignSelf: 'stretch' }}
        />

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
