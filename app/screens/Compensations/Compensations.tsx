import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton.tsx';
import React from 'react';
import {useUserStore} from '../../stores/user.ts';
import {translate} from '../../utils/localization.ts';
import {useAvailableCompensationsStore} from '../../stores/availableCompensations.ts';


export default function Compensations() {
  const navigation = useNavigation();
  const badgeCount = useAvailableCompensationsStore(state => state.amount()) ?? 0;
  const addVoucher = useAvailableCompensationsStore(state => state.addVoucher);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{translate("compensations.header")}</Text>

        <PrimaryButton
          title={'test'}
          onPress={() => addVoucher('test')}
        >test</PrimaryButton>

        {/*{form.incentives.includes('vouchers')
          ? <Box
            title='Vouchers'
            description='Receive vouchers for various stores and services as a token of appreciation.'
            button={() => navigation.navigate('Vouchers')}
          />
          : null
        }

        {form.incentives.includes('studyResults')
          ? <Box
            title='Results of the study'
            description='Get exclusive access to the results of the study you participated in.'
            button={() => navigation.navigate('StudyResults')}
          />
          : null
        }

        {form.incentives.includes('institutes')
          ? <Box
            title='Donations for institutes'
            description='Contribute to educational and research institutes through your participation.'
            button={null}
          />
          : null
        }

        {form.incentives.includes('purpose')
          ? <Box
            title='Purpose of data use'
            description='Understand how your data will be used and for what purposes.'
            button={() => navigation.navigate('PurposeResults')}
          />
          : null
        }

        {form.incentives.includes('money')
          ? <Box
            title='Financial compensation'
            description='Receive a final compensation for your valuable participation.'
            button={() => navigation.navigate('Money')}
          />
          : null
        }*/}

        <Box
          title={translate("compensations.vouchers.title")}
          description={translate("compensations.vouchers.description")}
          button={() => navigation.navigate('Vouchers')}
          badgeCount={badgeCount}
        />

        <Box
          title={translate("compensations.study-results.title")}
          description={translate("compensations.study-results.description")}
          button={() => navigation.navigate('StudyResults')}
        />

        <Box
          title={translate("compensations.donations.title")}
          description={translate("compensations.donations.description")}
          button={null}
        />

        <Box
          title={translate("compensations.purpose.title")}
          description={translate("compensations.purpose.description")}
          button={() => navigation.navigate('PurposeResults')}
        />

        <Box
          title={translate("compensations.money.title")}
          description={translate("compensations.money.description")}
          button={() => navigation.navigate('Money')}
        />

      </ScrollView>
    </SafeAreaView>
  )
}

function Box({ title, description, button, badgeCount }:
  { title: string, description: string, button: (() => void) | null, badgeCount?: number }) {
  return (
    <View style={styles.box}>
      <Text style={styles.boxHeader}>{title}</Text>

      <Text style={styles.boxText}>
        {description}
      </Text>

      {button ? <PrimaryButton
        onPress={button}
        title={translate("compensations.redeem")}
        badgeCount={badgeCount}
      /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    padding: 20,
    gap: 20,
  },
  box: {
    backgroundColor: '#d7d7d7',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  boxHeader: {
    fontSize: 18,
    fontWeight: 500,
    textAlign: 'center',
  },
  boxText: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'justify',
  },
});
