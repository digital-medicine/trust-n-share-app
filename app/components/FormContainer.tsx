import {ScrollView, StyleSheet, View} from 'react-native';

export default function FormContainer({children}) {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
  },
  container: {
    gap: 20,
  },
});
