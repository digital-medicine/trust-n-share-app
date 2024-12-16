import { Button, Alert } from 'react-native';
import React from 'react';
import {useAuthStore} from '../stores/auth.ts';

export default function LogoutButton() {
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ],
      { cancelable: true }
    );
  };

  return (
    <Button color="red" title="Logout" onPress={handleLogout} />
  );
}
