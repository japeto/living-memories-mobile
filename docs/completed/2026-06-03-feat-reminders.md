# Reminders Feature - Implementation Plan

## 1. Domain Layer (`src/domain/reminders/`)
Create the core entities and interfaces for the Reminders feature.

**File:** `src/domain/reminders/entities/Reminder.ts`
```typescript
export interface Reminder {
  id: string;
  memory_id: string;
  title: string;
  due_date: string; // ISO 8601 format
  description: string;
  is_done: boolean;
}
```

**File:** `src/domain/reminders/repositories/IReminderRepository.ts`
```typescript
import { Reminder } from '../entities/Reminder';

export interface IReminderRepository {
  getReminders(): Promise<Reminder[]>;
  updateReminderStatus(id: string, is_done: boolean): Promise<void>;
}
```

**File:** `src/domain/reminders/useCases/GetRemindersUseCase.ts`
```typescript
import { inject, injectable } from 'tsyringe';
import { IReminderRepository } from '../repositories/IReminderRepository';
import { Reminder } from '../entities/Reminder';

@injectable()
export class GetRemindersUseCase {
  constructor(
    @inject('IReminderRepository') private repository: IReminderRepository
  ) {}

  async execute(): Promise<Reminder[]> {
    return this.repository.getReminders();
  }
}
```

**File:** `src/domain/reminders/useCases/UpdateReminderStatusUseCase.ts`
```typescript
import { inject, injectable } from 'tsyringe';
import { IReminderRepository } from '../repositories/IReminderRepository';

@injectable()
export class UpdateReminderStatusUseCase {
  constructor(
    @inject('IReminderRepository') private repository: IReminderRepository
  ) {}

  async execute(id: string, is_done: boolean): Promise<void> {
    return this.repository.updateReminderStatus(id, is_done);
  }
}
```

## 2. Data Layer (`src/data/`)
Implement API client calls and repository based on the interface. Note: Using `/api/v1/reminders` assuming it matches the current REST architecture standards in the API, based on the `memoriesApiClient.ts`.

**File:** `src/data/network/remindersApiClient.ts`
```typescript
import { apiClient } from './apiClient';
import { Reminder } from '../../domain/reminders/entities/Reminder';

export const getReminders = async (): Promise<Reminder[]> => {
  const response = await apiClient.get<Reminder[]>('/api/v1/reminders');
  return response.data;
};

export const updateReminderStatus = async (id: string, is_done: boolean): Promise<void> => {
  await apiClient.patch(`/api/v1/reminders/${id}`, { is_done });
};
```

**File:** `src/data/repositories/ReminderRepository.ts`
```typescript
import { IReminderRepository } from '../../domain/reminders/repositories/IReminderRepository';
import { Reminder } from '../../domain/reminders/entities/Reminder';
import { getReminders, updateReminderStatus } from '../network/remindersApiClient';

export class ReminderRepository implements IReminderRepository {
  async getReminders(): Promise<Reminder[]> {
    return await getReminders();
  }

  async updateReminderStatus(id: string, is_done: boolean): Promise<void> {
    return await updateReminderStatus(id, is_done);
  }
}
```

## 3. Dependency Injection (`src/di/container.ts`)
Register the newly created repository and use cases.

Modify `src/di/container.ts`:
```typescript
// Add imports
import { ReminderRepository } from '../data/repositories/ReminderRepository';
import { GetRemindersUseCase } from '../domain/reminders/useCases/GetRemindersUseCase';
import { UpdateReminderStatusUseCase } from '../domain/reminders/useCases/UpdateReminderStatusUseCase';

// Register implementations
container.registerSingleton('IReminderRepository', ReminderRepository);
container.registerSingleton(GetRemindersUseCase);
container.registerSingleton(UpdateReminderStatusUseCase);
```

## 4. Presentation Layer (`src/presentation/`)
Implement the UI and state management logic.

### 4.1 Utils
Modify `src/utils/date.ts` to include `formatReminderDate`:
```typescript
export function formatReminderDate(dateInput?: string | Date): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  
  const day = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date);
  const time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date);
  
  return `${day} ${time}`;
}
```

### 4.2 ViewModel
**File:** `src/presentation/viewModels/reminders/useRemindersViewModel.ts`
Handle the fetching of the list and the optimistic update of the `is_done` toggle.
```typescript
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { container } from '../../../di/container';
import { Reminder } from '../../../domain/reminders/entities/Reminder';
import { GetRemindersUseCase } from '../../../domain/reminders/useCases/GetRemindersUseCase';
import { UpdateReminderStatusUseCase } from '../../../domain/reminders/useCases/UpdateReminderStatusUseCase';

export const useRemindersViewModel = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const useCase = container.resolve(GetRemindersUseCase);
      const data = await useCase.execute();
      setReminders(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los recordatorios');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [])
  );

  const toggleReminderDone = async (reminder: Reminder) => {
    const newStatus = !reminder.is_done;
    
    // Optimistic UI update
    setReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, is_done: newStatus } : r));
    
    try {
      const updateUseCase = container.resolve(UpdateReminderStatusUseCase);
      await updateUseCase.execute(reminder.id, newStatus);
    } catch (err) {
      // Revert if request fails
      setReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, is_done: reminder.is_done } : r));
    }
  };

  return {
    reminders,
    isLoading,
    error,
    toggleReminderDone,
    refetch: fetchReminders,
  };
};
```

### 4.3 Component
**File:** `src/presentation/components/reminders/ReminderCard.tsx`
```typescript
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
```

### 4.4 Screen
**File:** `src/presentation/screens/reminders/RemindersScreen.tsx`
```typescript
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRemindersViewModel } from '../../viewModels/reminders/useRemindersViewModel';
import { ReminderCard } from '../../components/reminders/ReminderCard';

export function RemindersScreen() {
  const theme = useTheme();
  const vm = useRemindersViewModel();

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text variant="headlineMedium" style={styles.title}>Recordatorios</Text>
      <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.outline }]}>
        Creados solos, a partir de tu voz.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {vm.isLoading && vm.reminders.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={vm.reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReminderCard 
              reminder={item} 
              onToggle={() => vm.toggleReminderDone(item)} 
            />
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
             <View style={styles.centered}>
               <Text style={{ color: theme.colors.outline }}>No tienes recordatorios.</Text>
             </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  }
});
```

### 4.5 Navigation Update
Modify `src/presentation/navigation/MainNavigator.tsx` to include the Reminders tab.

```typescript
import { RemindersScreen } from '../screens/reminders/RemindersScreen';
// ...
  const [routes] = React.useState([
    { key: 'home', title: 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'memories', title: 'Recuerdos', focusedIcon: 'book', unfocusedIcon: 'book-outline' },
    { key: 'reminders', title: 'Recordatorios', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    memories: MemoriesScreen,
    reminders: RemindersScreen,
  });
```

## Considerations
- **API URL mapping**: It is assumed that the endpoint is `/api/v1/reminders` based on how `memories` uses `/api/v1/memories`. If the backend provides `/reminders` directly at root, we need to adjust `remindersApiClient.ts`.
- **Optimistic UI Updates**: The `is_done` toggle state updates instantly in the UI state while triggering the `PATCH` API call. If the call fails, the state gracefully reverts.
- **Visuals**: React Native Paper component styles (`strikethrough`, `opacity: 0.6`, MaterialCommunityIcons usage) directly follow the given specifications.
