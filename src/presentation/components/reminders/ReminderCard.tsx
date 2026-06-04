import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Reminder } from '../../../domain/reminders/entities/Reminder';
import { formatReminderDate } from '../../../utils/date';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onToggle }) => {
  const theme = useTheme();
  
  return (
    <Card style={[styles.card, { opacity: reminder.is_done ? 0.6 : 1 }]}>
      <Card.Content style={styles.content}>
        <MaterialCommunityIcons name="bell-outline" size={24} color={theme.colors.primary} />
        
        <View style={styles.textContainer}>
          <Text 
            variant="titleMedium" 
            style={[styles.title, { textDecorationLine: reminder.is_done ? 'line-through' : 'none' }]}
          >
            {reminder.title} · {formatReminderDate(reminder.due_date)}
          </Text>
          <Text 
            variant="bodyMedium" 
            numberOfLines={1} 
            style={[
              styles.description, 
              { color: theme.colors.outline, textDecorationLine: reminder.is_done ? 'line-through' : 'none' }
            ]}
          >
            {reminder.description}
          </Text>
        </View>
        
        <IconButton 
          icon={reminder.is_done ? "check-circle" : "checkbox-blank-circle-outline"}
          iconColor={reminder.is_done ? theme.colors.primary : theme.colors.outline}
          size={24}
          onPress={onToggle}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
  }
});
