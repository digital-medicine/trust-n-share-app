import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import {useUserStore} from '../stores/user.ts';
import {Text, View} from 'react-native';

interface CompensationsTabIconProps {
  focused: boolean;
  size: number;
  color: string;
}

export default function CompensationsTabIcon(props: CompensationsTabIconProps) {
  const iconName = props.focused ? 'gift' : 'gift-outline';
  const badgeCount = useUserStore(state => state.user?.availableCompensations.length) ?? 0;

  return (
    // <Ionicons name={iconName} size={props.size} color={props.color} />

    // icon with badge
    <View style={{ width: 24, height: 24, margin: 5 }}>
      <Ionicons name={iconName} size={props.size} color={props.color} />
      {badgeCount > 0 && (
        <View
          style={{
            // /If you're using react-native < 0.57 overflow outside of the parent
            // will not work on Android, see https://git.io/fhLJ8
            position: 'absolute',
            right: -10,
            top: -3,
            backgroundColor: 'red',
            borderRadius: 8,
            width: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
            {badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
}
