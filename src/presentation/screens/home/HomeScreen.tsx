import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Avatar, useTheme, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHomeViewModel } from '../../viewModels/home/useHomeViewModel';
import { RecordingHero } from '../../components/home/RecordingHero';
import { MemoryCard } from '../../components/home/MemoryCard';

export function HomeScreen() {
  const theme = useTheme();
  const vm = useHomeViewModel();

  // Capitalize first letter helper
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const dateStr = capitalize(new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }));

  const renderHeader = () => (
    <View>
      <View style={styles.topBar}>
        <View>
          <Text variant="labelLarge" style={{ color: theme.colors.outline }}>
            {dateStr}
          </Text>
          <Text variant="headlineMedium" style={styles.greeting}>
            Buenos días, Rosa
          </Text>
        </View>
        <Avatar.Image size={48} source={{ uri: 'https://i.pravatar.cc/150?img=47' }} />
      </View>

      <RecordingHero
        phase={vm.phase}
        seconds={vm.seconds}
        onToggle={vm.onToggleRecord}
        layerStep={vm.layerStep}
      />

      <View style={styles.sectionTitleContainer}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Hoy</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {vm.isLoading && vm.memories.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator testID="loading-indicator" size="large" />
        </View>
      ) : (
        <FlatList
          data={vm.memories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MemoryCard memory={item} isNew={item.id === vm.newId} />
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  sectionTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 24,
  }
});
