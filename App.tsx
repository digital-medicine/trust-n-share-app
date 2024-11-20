import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen Test</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App(): React.JSX.Element {
  return (
    // <SafeAreaView>
    //   <Text>Testes</Text>
    // </SafeAreaView>
    <Navigation />
  );
}

export default App;
