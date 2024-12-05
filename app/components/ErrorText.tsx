import {Text} from 'react-native';


export default function ErrorText({ error }: { error: string | null }) {
  if (!error) return null;

  return (
    <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>
  );
}
