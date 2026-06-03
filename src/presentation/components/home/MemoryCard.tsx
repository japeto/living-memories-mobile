import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Memory } from '../../../domain/memories/entities/Memory';

interface MemoryCardProps {
  memory: Memory;
  isNew?: boolean;
}

export function MemoryCard({ memory, isNew }: MemoryCardProps) {
  const theme = useTheme();

  return (
    <Card style={[styles.card, isNew && { borderColor: theme.colors.primary, borderWidth: 1 }]} mode="elevated">
      <Card.Content>
        <View style={styles.header}>
          <Text variant="labelMedium" style={{ color: theme.colors.outline }}>
            {memory.time}
          </Text>
          {isNew && (
            <Chip compact textStyle={{ fontSize: 10 }} style={{ backgroundColor: theme.colors.primaryContainer }}>
              Nuevo
            </Chip>
          )}
        </View>

        {memory.title && (
          <Text variant="titleMedium" style={styles.title}>
            {memory.title}
          </Text>
        )}

        <Text variant="bodyLarge" style={styles.text}>
          {memory.text}
        </Text>

        {memory.status === 'processing' ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="small" style={{ marginRight: 8 }} />
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              Analizando con IA...
            </Text>
          </View>
        ) : (
          <View style={styles.tagsContainer}>
            {memory.topic ? (
              <Chip icon="tag" style={styles.tag} textStyle={styles.tagText} compact>
                {memory.topic}
              </Chip>
            ) : null}
            {memory.mood ? (
              <Chip icon="emoticon-outline" style={styles.tag} textStyle={styles.tagText} compact>
                {memory.mood}
              </Chip>
            ) : null}
          </View>
        )}

        {memory.reminder && memory.status !== 'processing' && (
          <View style={[styles.reminderContainer, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <MaterialCommunityIcons name="bell-outline" size={16} color={theme.colors.onTertiaryContainer} />
            <Text variant="labelMedium" style={[styles.reminderText, { color: theme.colors.onTertiaryContainer }]}>
              {memory.reminder}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  text: {
    marginBottom: 16,
    lineHeight: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  reminderText: {
    marginLeft: 8,
  },
});
