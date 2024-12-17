import {Text, View} from 'react-native';
import {useUserStore} from '../../stores/user.ts';


export default function VouchersScreen() {
  const user = useUserStore(state => state.user);
  console.log(user);

  return (
    <View>
      <Text>VouchersScreen</Text>

      {user?.availableCompensations.map(compensation => (
        <Text key={compensation._id}>{compensation.name}</Text>
      ))}
    </View>
  );
}
