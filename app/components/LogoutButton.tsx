import { Button, Alert } from 'react-native';
import React from 'react';
import AuthContext from '../contexts/AuthContext';

export default function LogoutButton() {
  const { logout } = React.useContext(AuthContext);

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
