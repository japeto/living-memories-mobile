/* ============================================================
   MemoryCard — memory card port (3 layouts)
   layout: 'diario' (timeline) | 'galeria' | 'compacto'
   ============================================================ */
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Icon } from './Icon';
import { Chip, Dot } from './Chip';
import { Card } from './Card';
import { TopicKey, MoodKey, resolveTopic, resolveMood } from '../theme/taxonomy';

export interface Memory {
  text: string;
  time: string;
  topic: TopicKey;
  mood: MoodKey;
  reminder?: string;
}

export interface MemoryCardProps {
  m: Memory;
  layout?: 'diario' | 'galeria' | 'compacto';
}

export function MemoryCard({ m, layout = 'diario' }: MemoryCardProps) {
  const t = useTheme();
  const topic = resolveTopic(m.topic, t);
  const mood = resolveMood(m.mood);

  /* ---- GALLERY ---- */
  if (layout === 'galeria') {
    return (
      <Card flush>
        <View style={{ height: 7, backgroundColor: topic.color }} />
        <View style={{ padding: 18, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Chip color={topic.color} soft={topic.soft} icon={topic.icon}>{m.topic}</Chip>
            <Text variant="small" tone="faint">{m.time}</Text>
          </View>
          <Text variant="serifLg" style={{ lineHeight: 28 }}>"{m.text}"</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 }}>
            <Dot color={mood.color} />
            <Text variant="small" color={mood.color}>{m.mood}</Text>
            {m.reminder && (
              <View style={{ marginLeft: 'auto' }}>
                <Chip color={t.colors.primary} soft={t.colors.primarySoft} icon="bell">Recordatorio</Chip>
              </View>
            )}
          </View>
        </View>
      </Card>
    );
  }

  /* ---- COMPACT ---- */
  if (layout === 'compacto') {
    return (
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start', paddingVertical: 14, paddingHorizontal: 4 }}>
        <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: topic.soft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={topic.icon} size={23} strokeWidth={2.2} color={topic.color} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <Text variant="small" color={topic.color}>{m.topic}</Text>
            <Text variant="small" tone="faint">{m.time}</Text>
          </View>
          <Text variant="body" style={{ marginTop: 3 }}>{m.text}</Text>
          {m.reminder && (
            <View style={{ marginTop: 8, flexDirection: 'row' }}>
              <Chip color={t.colors.primary} soft={t.colors.primarySoft} icon="bell">{m.reminder}</Chip>
            </View>
          )}
        </View>
      </View>
    );
  }

  /* ---- DIARY (timeline) ---- */
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <View style={{ alignItems: 'center', paddingTop: 4 }}>
        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: topic.color }} />
        <View style={{ flex: 1, width: 2, backgroundColor: t.colors.line, marginTop: 6, borderRadius: 2 }} />
      </View>
      <Card style={{ flex: 1, marginBottom: 18, padding: 16, paddingTop: 16, paddingBottom: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text variant="small" tone="faint">{m.time}</Text>
          <Dot color={mood.color} />
        </View>
        <Text variant="serifBody" style={{ marginBottom: 14 }}>"{m.text}"</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip color={topic.color} soft={topic.soft} icon={topic.icon}>{m.topic}</Chip>
          <Chip color={mood.color} soft={t.colors.surface2}>{m.mood}</Chip>
          {m.reminder && <Chip color={t.colors.primary} soft={t.colors.primarySoft} icon="bell">{m.reminder}</Chip>}
        </View>
      </Card>
    </View>
  );
}
