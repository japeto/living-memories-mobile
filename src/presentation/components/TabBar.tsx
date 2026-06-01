/* ============================================================
   TabBar — .tabbar / .tab port (bottom navigation)
   Usage: <TabBar active="home" onChange={setTab} />
   Note: includes basic bottom safe-area. For dynamic notch
   use react-native-safe-area-context and add the inset to paddingBottom.
   ============================================================ */
import React from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

export type TabId = 'home' | 'recuerdos' | 'bienestar' | 'recordatorios';

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'recuerdos', label: 'Recuerdos', icon: 'book' },
  { id: 'bienestar', label: 'Bienestar', icon: 'heart' },
  { id: 'recordatorios', label: 'Recordar', icon: 'bell' },
];

export interface TabBarProps {
  active: TabId;
  onChange: (id: TabId) => void;
  bottomInset?: number;   // device bottom safe-area
}

export function TabBar({ active, onChange, bottomInset = 30 }: TabBarProps) {
  const t = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        paddingTop: 10,
        paddingHorizontal: 14,
        paddingBottom: bottomInset,
        backgroundColor: t.colors.surface,
        borderTopWidth: 1,
        borderTopColor: t.colors.line,
      }}
    >
      {TABS.map((tab) => {
        const on = active === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8 }}
          >
            <Icon
              name={tab.icon}
              size={26}
              strokeWidth={on ? 2.5 : 2}
              color={on ? t.colors.primary : t.colors.inkFaint}
            />
            <Text
              variant="tiny"
              color={on ? t.colors.primary : t.colors.inkFaint}
              style={{ fontSize: 11, fontWeight: '800', letterSpacing: 0, textTransform: 'none' }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
