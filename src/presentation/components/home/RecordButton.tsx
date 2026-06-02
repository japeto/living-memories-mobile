import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

interface RecordButtonProps {
  phase: 'idle' | 'rec' | 'proc';
  onPress: () => void;
}

export function RecordButton({ phase, onPress }: RecordButtonProps) {
  const theme = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (phase === 'rec') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [phase, pulseAnim]);

  const getBackgroundColor = () => {
    switch (phase) {
      case 'idle':
        return theme.colors.primary;
      case 'rec':
        return theme.colors.error;
      case 'proc':
        return theme.colors.surfaceVariant;
      default:
        return theme.colors.primary;
    }
  };

  const getIcon = () => {
    switch (phase) {
      case 'idle':
        return 'microphone';
      case 'rec':
        return 'stop';
      case 'proc':
        return 'dots-horizontal';
    }
  };

  return (
    <View style={styles.container}>
      {phase === 'rec' && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              backgroundColor: theme.colors.error,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}
      <TouchableOpacity
        testID="record-button"
        style={[
          styles.button,
          { backgroundColor: getBackgroundColor() },
          phase === 'proc' && { opacity: 0.5 },
        ]}
        onPress={onPress}
        disabled={phase === 'proc'}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={getIcon()}
          size={36}
          color={phase === 'proc' ? theme.colors.onSurfaceVariant : theme.colors.onPrimary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.3,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
