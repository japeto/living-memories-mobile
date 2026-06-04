import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../Text';
import { useTheme } from '../../theme/ThemeProvider';
import { resolveTopic, TopicKey } from '../../theme/taxonomy';

interface TopicEntry {
  name: string;
  percentage: number;
}

interface TopicDistributionProps {
  data: TopicEntry[];
}

export function TopicDistribution({ data }: TopicDistributionProps) {
  const t = useTheme();

  return (
    <View style={styles.container}>
      {data.map((entry, index) => {
        const topic = resolveTopic(entry.name as TopicKey, t);
        const widthPercent = `${entry.percentage}%`;

        return (
          <View key={index} style={styles.item}>
            <View style={styles.header}>
              <Text variant="body" tone="ink">{entry.name}</Text>
              <Text variant="body" tone="soft">{entry.percentage}%</Text>
            </View>
            <View style={[styles.track, { backgroundColor: t.colors.surface2 }]}>
              <View 
                style={[
                  styles.fill, 
                  { 
                    width: widthPercent as any, 
                    backgroundColor: topic.color 
                  }
                ]} 
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  item: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
