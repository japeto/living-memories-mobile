/* ============================================================
   Text — typography with system variants
   Usage: <Text variant="h1">Hola</Text>
        <Text variant="serifBody" tone="soft">quote…</Text>
   ============================================================ */
import React from 'react';
import { Text as RNText, TextProps, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { type as typeScale } from '../theme/tokens';

type Variant = keyof typeof typeScale;
type Tone = 'ink' | 'soft' | 'faint' | 'primary' | 'onPrimary';

export interface TextOwnProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
  color?: string;        // direct override
  style?: StyleProp<TextStyle>;
}

export function Text({
  variant = 'body',
  tone = 'ink',
  color,
  style,
  children,
  ...rest
}: TextOwnProps) {
  const t = useTheme();
  const toneColor =
    color ??
    {
      ink: t.colors.ink,
      soft: t.colors.inkSoft,
      faint: t.colors.inkFaint,
      primary: t.colors.primary,
      onPrimary: t.colors.onPrimary,
    }[tone];

  return (
    <RNText {...rest} style={[typeScale[variant], { color: toneColor }, style]}>
      {children}
    </RNText>
  );
}
