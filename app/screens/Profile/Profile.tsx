import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen() {
  const infoItems = [
    { title: 'Name', data: 'John Doe' },
    { title: 'Date of birth', data: '2000-01-01' },
    { title: 'Participated studies', data: '4' },
    { title: 'Money earned', data: '7,50 €' },
  ];

  const transactions = [
    { id: 1, name: 'Rewe', date: '2024-11-05' },
    { id: 2, name: 'DLR', date: '2024-11-20' },
    { id: 3, name: 'UKB', date: '2024-11-21' },
    { id: 4, name: 'UKJ', date: '2024-12-02' },
  ];

  return (
    <ScrollView style={styles.safeArea}>
      <View style={styles.container}>
        <Section header="Info">
          <InfoBox>
            {infoItems.map((item, index) => (
              <InfoItem key={index} title={item.title} data={item.data} />
            ))}
          </InfoBox>
        </Section>

        <Section header="Transaction History">
          <TransactionHistory transactions={transactions} />
        </Section>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
  },
});

function Section({ header, children }) {
  return (
    <View style={sectionStyles.sectionContainer}>
      <Text style={sectionStyles.header}>{header}</Text>
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  sectionContainer: {
    gap: 16,
  },
  header: {
    paddingTop: 30,
    paddingBottom: 14,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

function InfoBox({ children }) {
  return <View style={infoBoxStyles.infoBox}>{children}</View>;
}

const infoBoxStyles = StyleSheet.create({
  infoBox: {
    backgroundColor: '#d7d7d7',
    padding: 20,
    borderRadius: 8,
    gap: 12,
  },
});

function InfoItem({ title, data }) {
  return (
    <View style={infoItemStyles.infoItem}>
      <Text style={infoItemStyles.infoItemTitle}>{title}</Text>
      <Text style={infoItemStyles.infoItemData}>{data}</Text>
    </View>
  );
}

const infoItemStyles = StyleSheet.create({
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItemTitle: {
    color: '#6c6c6c',
    fontSize: 18,
  },
  infoItemData: {
    fontSize: 18,
  },
});

function TransactionHistory({ transactions }) {
  return (
    <>
      {transactions.map((transaction, index) => (
        <TransactionButton
          key={transaction.id}
          id={transaction.id}
          name={transaction.name}
          date={transaction.date}
        />
      ))}
    </>
  );
}

function TransactionButton({ id, name, date }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={transactionButtonStyles.whiteButton}
      onPress={() => navigation.navigate('Transaction', { id, name })}
    >
      <View style={transactionButtonStyles.whiteButtonLeft}>
        <Text style={transactionButtonStyles.name}>{name}</Text>
        <Text style={transactionButtonStyles.date}>{date}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="black" />
    </TouchableOpacity>
  );
}

const transactionButtonStyles = StyleSheet.create({
  whiteButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensures vertical alignment for children
  },
  whiteButtonLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensures the Text components are vertically aligned
  },
  name: {
    fontSize: 18,
  },
  date: {
    paddingRight: 20,
    fontSize: 18,
    color: '#6c6c6c',
  },
});
