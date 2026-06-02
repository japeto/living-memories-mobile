/* ============================================================
   Button — .btn port (.btn-primary/ghost/soft/text)
   Usage: <Button variant="primary" icon="mic" onPress={...}>Grabar</Button>
   ============================================================ */
import React, { useRef } from 'react';
import { Pressable, Animated, StyleProp, ViewStyle, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

type Variant = 'primary' | 'ghost' | 'soft' | 'text';

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: Variant;
  icon?: IconName;
  iconRight?: IconName;
  block?: boolean;          // full width
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  children,
  variant = 'primary',
  icon,
  iconRight,
  block,
  onPress,
  disabled,
  style,
}: ButtonProps) {
  const t = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const press = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 0 }).start();

  // variant styles
  const surfaces: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: t.colors.primary, ...t.shadow.primary(t.colors.primary) },
    ghost: { backgroundColor: 'transparent', borderWidth: 2, borderColor: t.colors.line },
    soft: { backgroundColor: t.colors.surface, ...t.shadow.card },
    text: { backgroundColor: 'transparent' },
  };
  const labelTone: Record<Variant, 'onPrimary' | 'ink' | 'primary'> = {
    primary: 'onPrimary',
    ghost: 'ink',
    soft: 'ink',
    text: 'primary',
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, block && { alignSelf: 'stretch' }, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => press(0.97)}
        onPressOut={() => press(1)}
        style={[
          {
            height: 62,
            paddingHorizontal: 28,
            borderRadius: t.radius.pill,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.5 : 1,
          },
          surfaces[variant],
        ]}
      >
        {icon && (
          <View style={{ marginRight: 10 }}>
            <Icon name={icon} size={22} strokeWidth={2.4} color={t.colors[labelTone[variant]]} />
          </View>
        )}
        {typeof children === 'string' ? (
          <Text variant="h3" tone={labelTone[variant]} style={{ fontWeight: '800', fontSize: 19 }}>
            {children}
          </Text>
        ) : (
          children
        )}
        {iconRight && (
          <View style={{ marginLeft: 10 }}>
            <Icon name={iconRight} size={22} strokeWidth={2.4} color={t.colors[labelTone[variant]]} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}
