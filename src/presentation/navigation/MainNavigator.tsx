import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { View, Text } from 'react-native';
import { HomeScreen } from '../screens/home/HomeScreen';
import { MemoriesScreen } from '../screens/memories/MemoriesScreen';
import { RemindersScreen } from '../screens/reminders/RemindersScreen';

const PlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Próximamente...</Text>
  </View>
);

export function MainNavigator() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'memories', title: 'Recuerdos', focusedIcon: 'book', unfocusedIcon: 'book-outline' },
    { key: 'reminders', title: 'Recordatorios', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    memories: MemoriesScreen,
    reminders: RemindersScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
