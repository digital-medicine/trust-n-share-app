import {ScrollView, StyleSheet, View} from 'react-native';


export default function FormContainer({ children }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    gap: 20,
  },
});
