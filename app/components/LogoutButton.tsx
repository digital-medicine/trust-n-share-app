import {Alert, Button} from 'react-native';
import React from 'react';
import {useAuthStore} from '../stores/auth.ts';
import {translate} from '../utils/localization.ts';

export default function LogoutButton() {
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    Alert.alert(
      translate('logout.confirm.header'),
      translate('logout.confirm.text'),
      [
        {text: translate('general.cancel'), style: 'cancel'},
        {text: translate('logout'), style: 'destructive', onPress: logout},
      ],
      {cancelable: true},
    );
  };

  return (
    <Button color="red" title={translate('logout')} onPress={handleLogout} />
  );
}
