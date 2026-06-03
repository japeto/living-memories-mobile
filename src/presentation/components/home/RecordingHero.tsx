import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RecordButton } from './RecordButton';

interface RecordingHeroProps {
  phase: 'idle' | 'rec' | 'proc';
  seconds: number;
  onToggle: () => void;
  liveText?: string;
}

export function RecordingHero({ phase, seconds, onToggle, liveText }: RecordingHeroProps) {
  const theme = useTheme();
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'proc') {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [phase, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {phase === 'idle' || phase === 'rec' ? (
        <View style={styles.recordContent}>
          <RecordButton phase={phase} onPress={onToggle} />
          
          <Text variant="bodyLarge" style={styles.helperText}>
            {phase === 'rec' ? formatTime(seconds) : 'Toca para grabar un recuerdo'}
          </Text>

          {phase === 'rec' && (
            <Text variant="bodyMedium" style={[styles.liveText, { color: theme.colors.outline }]}>
              {liveText ? `"${liveText}"` : 'Escuchando...'}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.procContent}>
          <View style={styles.spinnerContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <MaterialCommunityIcons name="loading" size={64} color={theme.colors.primary} />
            </Animated.View>
            <Text variant="titleMedium" style={[styles.procTitle, { color: theme.colors.onSurfaceVariant }]}>
              Organizando tu recuerdo...
            </Text>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordContent: {
    alignItems: 'center',
  },
  helperText: {
    marginTop: 24,
    opacity: 0.6,
  },
  liveText: {
    marginTop: 12,
    paddingHorizontal: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  procContent: {
    width: '100%',
    alignItems: 'center',
  },
  spinnerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  procTitle: {
    marginTop: 16,
    fontWeight: 'bold',
  }
});
