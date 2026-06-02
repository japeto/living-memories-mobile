import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RecordButton } from './RecordButton';

interface RecordingHeroProps {
  phase: 'idle' | 'rec' | 'proc';
  seconds: number;
  onToggle: () => void;
  layerStep: number;
}

const LAYERS = [
  'Voz a texto',
  'Sentimiento',
  'Tema',
  'Resumen',
];

export function RecordingHero({ phase, seconds, onToggle, layerStep }: RecordingHeroProps) {
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
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      
      {phase !== 'proc' ? (
        <View style={styles.recordContent}>
          <Text variant="bodyLarge" style={[styles.helperText, { color: theme.colors.onSurfaceVariant }]}>
            {phase === 'idle' ? 'Toca para grabar un recuerdo' : 'Te escucho...'}
          </Text>
          <Text variant="displayMedium" style={[styles.timer, { color: phase === 'rec' ? theme.colors.error : theme.colors.onSurfaceVariant }]}>
            {formatTime(seconds)}
          </Text>
          <RecordButton phase={phase} onPress={onToggle} />
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
          
          <View style={styles.layersContainer}>
            {LAYERS.map((layer, index) => {
              const isDone = layerStep > index;
              const isCurrent = layerStep === index;
              
              let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'circle-outline';
              let iconColor = theme.colors.outline;
              
              if (isDone) {
                iconName = 'check-circle';
                iconColor = theme.colors.primary;
              } else if (isCurrent) {
                iconName = 'dots-horizontal-circle-outline';
                iconColor = theme.colors.primary;
              }

              return (
                <View key={layer} style={styles.layerRow}>
                  <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
                  <Text 
                    variant="bodyLarge" 
                    style={[
                      styles.layerText, 
                      { color: isDone || isCurrent ? theme.colors.onSurface : theme.colors.outline }
                    ]}
                  >
                    {layer}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 24,
    padding: 24,
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordContent: {
    alignItems: 'center',
  },
  helperText: {
    marginBottom: 8,
    opacity: 0.8,
  },
  timer: {
    marginBottom: 24,
    fontWeight: '300',
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
  },
  layersContainer: {
    width: '80%',
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  layerText: {
    marginLeft: 16,
  }
});
