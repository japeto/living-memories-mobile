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
