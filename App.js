import 'reflect-metadata'; // MUST be the first import
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TestScreen } from './src/presentation/screens/TestScreen';

// Initialize the DI container
import './src/di/container';

export default function App() {
  return (
    <View style={styles.container}>
      <TestScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
