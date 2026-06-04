import React from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';
import { resolveTopic, TopicKey } from '../theme/taxonomy';

interface CategoryPillsProps {
  topics: string[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string) => void;
}

export function CategoryPills({ topics, selectedTopic, onSelectTopic }: CategoryPillsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.pill,
            { backgroundColor: selectedTopic === null ? theme.colors.primary : theme.colors.surface2 }
          ]}
          onPress={() => onSelectTopic('')} // In useMemoriesViewModel, we toggle, but here 'All' means selected=null
        >
          <Text
            variant="small"
            style={{ color: selectedTopic === null ? theme.colors.surface : theme.colors.ink }}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {topics.map(topic => {
          const isSelected = selectedTopic === topic;
          // Asumimos que resolveTopic maneja tópicos no conocidos haciendo fallback
          const resolved = resolveTopic(topic as TopicKey, theme);

          return (
            <TouchableOpacity
              key={topic}
              style={[
                styles.pill,
                {
                  backgroundColor: isSelected ? resolved.color : theme.colors.surface2,
                  borderColor: isSelected ? resolved.color : theme.colors.line,
                  borderWidth: 1,
                }
              ]}
              onPress={() => onSelectTopic(topic)}
            >
              <Text
                variant="small"
                style={{ color: isSelected ? theme.colors.surface : theme.colors.ink }}
              >
                {topic}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
