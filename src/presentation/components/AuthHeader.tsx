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
    <View style={{ marginBottom: 32, gap: 8 }}>
      {onBack && (
        <Pressable 
          onPress={onBack} 
          hitSlop={8} 
          style={{ 
            alignSelf: 'flex-start',
            marginBottom: 16,
            padding: 8,
            marginLeft: -8,
            borderRadius: t.radius.full,
          }}
        >
          <Icon name="back" size={28} color={t.colors.ink} />
        </Pressable>
      )}
      <Text variant="heading" style={{ fontSize: 32 }}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="body" tone="soft" style={{ fontSize: 18 }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
