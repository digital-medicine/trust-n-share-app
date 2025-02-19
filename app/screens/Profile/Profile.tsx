import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useUserStore} from '../../stores/user.ts';
import {translate} from '../../utils/localization.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const user = useUserStore(state => state.user);

  const transactions = [
    {id: 1, name: 'Rewe', date: '2024-11-05'},
    {id: 2, name: 'DLR', date: '2024-11-20'},
    {id: 3, name: 'UKB', date: '2024-11-21'},
    {id: 4, name: 'UKJ', date: '2024-12-02'},
  ];

  const [uploads, setUploads] = useState({});

  const fetchUploadHistory = async () => {
    const uploadHistory = await AsyncStorage.getItem(
      user.username + 'uploadHistory',
    );
    if (uploadHistory) {
      const uploads = JSON.parse(uploadHistory);

      // sort by timestamp, descending
      uploads.uploads = Object.fromEntries(
        Object.entries(uploads.uploads).sort(
          (a, b) => b[1].timestamp - a[1].timestamp,
        ),
      );

      setUploads(uploads);
    }
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  useFocusEffect(() => {
    fetchUploadHistory();
  });

  return (
    <ScrollView style={styles.safeArea}>
      <View style={styles.container}>
        <Section header={translate('profile.info')}>
          <InfoBox>
            <InfoItem
              title={translate('profile.name')}
              data={user?.username ?? 'Error'}
            />
            <InfoItem
              title={translate('profile.email')}
              data={user?.email ?? 'Error'}
            />
          </InfoBox>
        </Section>

        <Section header={translate('profile.upload-history')}>
          <UploadHistory uploads={uploads} />
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

function Section({header, children}) {
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

function InfoBox({children}) {
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

function InfoItem({title, data}: {title: string; data: string | undefined}) {
  return (
    <View style={infoItemStyles.infoItem}>
      <Text style={infoItemStyles.infoItemTitle}>{title}</Text>
      <Text style={infoItemStyles.infoItemData}>{data ?? 'No data'}</Text>
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

function UploadHistory({uploads}: {uploads: Object}) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return (
    <>
      {Object.entries(uploads?.uploads ?? {}).map(([uuid, upload]) => (
        <UploadButton
          key={uuid}
          uuid={uuid}
          date={new Intl.DateTimeFormat('de-DE', dateOptions)
            .format(new Date(upload.timestamp))
            .replace(', ', ' ')}
        />
      ))}
    </>
  );
}

function UploadButton({uuid, date}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={transactionButtonStyles.whiteButton}
      onPress={() => navigation.navigate('Transaction', {uuid, date})}>
      <View style={transactionButtonStyles.whiteButtonLeft}>
        <Text style={transactionButtonStyles.name}>{date}</Text>
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
