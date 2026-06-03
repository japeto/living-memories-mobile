import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTestViewModel } from '../viewModels/useTestViewModel';

export function TestScreen() {
  const { message } = useTestViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message || 'Loading...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
