/* ============================================================
   RecordButton — port de .rec (3 estilos: pulso / halo / onda)
   Animado con Animated + Easing. Sin CSS keyframes.
   Uso: <RecordButton recStyle="pulso" recording={r} onToggle={...} />
   ============================================================ */
import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, View, Easing } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Icon } from './Icon';

type RecStyle = 'pulso' | 'halo' | 'onda';

export interface RecordButtonProps {
  recStyle?: RecStyle;
  recording?: boolean;
  onToggle?: () => void;
  size?: number;
}

/* ---- una onda concéntrica (pulso) ---- */
function Ripple({ color, size, delay, active }: { color: string; size: number; delay: number; active: boolean }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) { v.setValue(0); return; }
    const loop = Animated.loop(
      Animated.timing(v, { toValue: 1, duration: 2400, delay, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [active, delay]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size, height: size, borderRadius: size / 2,
        borderWidth: 2.5, borderColor: color,
        opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
        transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1.55] }) }],
      }}
    />
  );
}

/* ---- barras de forma de onda (onda) ---- */
function Wave({ color }: { color: string }) {
  const bars = [0, 0.15, 0.3, 0.12, 0.26, 0.05];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 46, gap: 5 }}>
      {bars.map((delay, i) => <Bar key={i} color={color} delay={delay * 1000} />)}
    </View>
  );
}
function Bar({ color, delay }: { color: string; delay: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 450, delay, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(v, { toValue: 0, duration: 450, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delay]);
  return (
    <Animated.View
      style={{
        width: 6, borderRadius: 4, backgroundColor: color,
        height: v.interpolate({ inputRange: [0, 1], outputRange: [10, 42] }),
      }}
    />
  );
}

export function RecordButton({ recStyle = 'pulso', recording = false, onToggle, size = 132 }: RecordButtonProps) {
  const t = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const halo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (recStyle !== 'halo') return;
    if (!recording) { halo.setValue(0); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(halo, { toValue: 0, duration: 1300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [recording, recStyle]);

  const press = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 0 }).start();

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {recStyle === 'halo' && recording && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute', width: size + 20, height: size + 20, borderRadius: (size + 20) / 2,
            backgroundColor: t.colors.primarySoft,
            opacity: halo.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.85] }),
            transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] }) }],
          }}
        />
      )}
      {recStyle === 'pulso' && recording && (
        <>
          <Ripple color={t.colors.primary} size={size} delay={0} active />
          <Ripple color={t.colors.primary} size={size} delay={800} active />
          <Ripple color={t.colors.primary} size={size} delay={1600} active />
        </>
      )}
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={onToggle}
          onPressIn={() => press(0.95)}
          onPressOut={() => press(1)}
          style={{
            width: size, height: size, borderRadius: size / 2,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: recording ? t.colors.primaryDeep : t.colors.primary,
            ...t.shadow.primary(t.colors.primary),
          }}
        >
          {recording && recStyle === 'onda'
            ? <Wave color={t.colors.onPrimary} />
            : <Icon name="mic" size={size * 0.42} strokeWidth={2.1} color={t.colors.onPrimary} />}
        </Pressable>
      </Animated.View>
    </View>
  );
}
