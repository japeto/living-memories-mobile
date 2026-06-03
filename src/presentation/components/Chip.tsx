/* ============================================================
   Chip — .chip / .dot port
   Usage: <Chip color={c} soft={s} icon="family">Familia</Chip>
   ============================================================ */
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

export interface ChipProps {
  children?: React.ReactNode;
  color?: string;   // text + icon
  soft?: string;    // background
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ children, color, soft, icon, style }: ChipProps) {
  const t = useTheme();
  const fg = color ?? t.colors.ink;
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 13,
          paddingVertical: 6,
          borderRadius: t.radius.pill,
          backgroundColor: soft ?? t.colors.surface2,
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={15} strokeWidth={2.4} color={fg} />}
      <Text variant="small" color={fg} style={{ fontWeight: '800', fontSize: 14 }}>
        {children}
      </Text>
    </View>
  );
}

/** Color dot (mood). */
export function Dot({ color, size = 9 }: { color: string; size?: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
}
