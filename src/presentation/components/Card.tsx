/* ============================================================
   Card — .card port (surface + lg radius + shadow)
   Usage: <Card><Text>…</Text></Card>
        <Card flush>…</Card>   // no padding (for colored headers)
   ============================================================ */
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export interface CardProps {
  children?: React.ReactNode;
  flush?: boolean;             // no internal padding
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, flush, style }: CardProps) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: t.colors.surface,
          borderRadius: t.radius.lg,
          padding: flush ? 0 : 18,
          overflow: flush ? 'hidden' : 'visible',
          ...t.shadow.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
