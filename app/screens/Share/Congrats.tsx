import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import {useNavigation} from '@react-navigation/native';
import {useFormStore} from '../../stores/form.ts';
import {translate} from '../../utils/localization.ts';


export default function Congrats() {
  const form = useFormStore(state => state.form);
  const navigation = useNavigation();

  const formString = JSON.stringify(form, null, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>{translate("upload.congrats.title")}</Text>

        <Text style={styles.subHeader}>
          {translate("upload.congrats.subheader")}
        </Text>

        <Text style={styles.text}>
          {translate("upload.congrats.text")}
        </Text>
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
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subHeader: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 500,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
  },
})
