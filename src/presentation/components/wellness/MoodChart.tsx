import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../Text';
import { useTheme } from '../../theme/ThemeProvider';
import { resolveMood, MoodKey } from '../../theme/taxonomy';

interface MoodEntry {
  day: string;
  level: number;
  label: string;
}

interface MoodChartProps {
  data: MoodEntry[];
}

export function MoodChart({ data }: MoodChartProps) {
  const t = useTheme();

  return (
    <View style={styles.container}>
      {data.map((entry, index) => {
        // Find corresponding mood color
        const moodColor = resolveMood(entry.label as MoodKey).color;
        const heightPercent = `${Math.max(10, entry.level * 100)}%`;

        return (
          <View key={index} style={styles.barColumn}>
            <View style={[styles.barTrack, { backgroundColor: t.colors.surface2 }]}>
              <View 
                style={[
                  styles.barFill, 
                  { 
                    height: heightPercent as any, 
                    backgroundColor: moodColor 
                  }
                ]} 
              />
            </View>
            <Text variant="caption" tone="soft" style={styles.dayLabel}>{entry.day}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginTop: 16,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 12,
    height: 90,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  dayLabel: {
    marginTop: 8,
  },
});
