import 'reflect-metadata'; // MUST be the first import
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreenNative from 'expo-splash-screen';
import { useFonts, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { Lora_500Medium, Lora_500Medium_Italic } from '@expo-google-fonts/lora';

import { ThemeProvider } from './src/presentation/theme/ThemeProvider';
import { SplashScreen } from './src/presentation/screens/SplashScreen';
import './src/di/container';

// Keep the native splash screen visible while we fetch resources
SplashScreenNative.preventAutoHideAsync().catch(() => {
  // Ignore errors if already hidden
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_500: Nunito_500Medium,
    Nunito_600: Nunito_600SemiBold,
    Nunito_700: Nunito_700Bold,
    Nunito_800: Nunito_800ExtraBold,
    Lora_500: Lora_500Medium,
    Lora_500_Italic: Lora_500Medium_Italic,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreenNative.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <SplashScreen />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
