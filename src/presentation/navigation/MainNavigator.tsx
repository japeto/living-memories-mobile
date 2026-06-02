import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { View, Text } from 'react-native';
import { HomeScreen } from '../screens/home/HomeScreen';

const PlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Próximamente...</Text>
  </View>
);

export function MainNavigator() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'history', title: 'Historial', focusedIcon: 'history', unfocusedIcon: 'history' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    history: PlaceholderScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
