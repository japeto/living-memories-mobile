import React from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Icon } from './Icon';

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function AuthHeader({ title, subtitle, onBack }: AuthHeaderProps) {
  const t = useTheme();

  return (
    <View style={{ marginBottom: 32, gap: 8, alignItems: 'center' }}>
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        {onBack && (
          <Pressable 
            onPress={onBack} 
            hitSlop={8} 
            style={{ 
              position: 'absolute',
              left: 0,
              padding: 8,
              marginLeft: -8,
              borderRadius: t.radius.pill,
            }}
          >
            <Icon name="back" size={28} color={t.colors.ink} />
          </Pressable>
        )}
        <View
          style={{
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ position: 'absolute', width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: t.colors.accent, opacity: 0.4 }} />
          <View style={{ position: 'absolute', width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: t.colors.secondary, opacity: 0.5 }} />
          <View style={{ position: 'absolute', width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: t.colors.primary, opacity: 0.15 }} />
          <View style={{ position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: t.colors.primary }} />
        </View>
      </View>
      <Text variant="h1" style={{ fontSize: 32, textAlign: 'center' }}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="body" tone="soft" style={{ fontSize: 18, textAlign: 'center' }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
