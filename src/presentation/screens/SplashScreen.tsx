import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Animated, Pressable } from 'react-native';
import { Text } from '../components/Text';
import { useTheme } from '../theme/ThemeProvider';

export interface SplashScreenProps {
  onDone?: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const t = useTheme();
  const pop = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pop-in animation
    Animated.spring(pop, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 12,
      speed: 14,
    }).start();

    // Float looping animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    if (onDone) {
      const timer = setTimeout(onDone, 2600);
      return () => clearTimeout(timer);
    }
  }, [onDone, pop, float]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.colors.heroFrom }]}>
      <Pressable style={styles.pressable} onPress={onDone}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: pop,
                transform: [
                  { scale: pop },
                  {
                    translateY: float.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -12], // floats up 12px
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Central Graphic */}
            <View style={styles.graphicContainer}>
              <View style={[styles.ringOuter, { borderColor: t.colors.accent, opacity: 0.7 }]}>
                <View style={[styles.ringInner, { borderColor: t.colors.secondary, opacity: 0.8 }]}>
                  <View style={[styles.core, { backgroundColor: t.colors.primary }]} />
                </View>
              </View>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text tone="ink" style={styles.titleLine1}>
                Mi Recuerdo
              </Text>
              <Text tone="primary" style={styles.titleLine2}>
                Vivo
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View style={[styles.footer, { opacity: pop }]}>
          <Text variant="small" tone="faint" style={styles.footerText}>
            Tu voz, guardada con cariño
          </Text>
        </Animated.View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  graphicContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleLine1: {
    fontFamily: 'Lora_500',
    fontSize: 42,
    lineHeight: 46,
    marginBottom: -4,
  },
  titleLine2: {
    fontFamily: 'Lora_500_Italic',
    fontSize: 42,
    lineHeight: 46,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
  },
});
