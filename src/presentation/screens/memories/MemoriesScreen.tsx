import React from 'react';
import { View, StyleSheet, SectionList, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useMemoriesViewModel } from '../../viewModels/memories/useMemoriesViewModel';
import { CategoryPills } from '../../components/CategoryPills';
import { MemoryCard } from '../../components/MemoryCard';
import { Text } from '../../components/Text';

export function MemoriesScreen() {
  const theme = useTheme();
  const {
    isLoading,
    error,
    sections,
    availableTopics,
    selectedTopic,
    toggleTopicFilter,
    refetch,
  } = useMemoriesViewModel();

  if (isLoading && sections.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.bg }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.bg }]}>
        <Text variant="body" color={theme.colors.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <Text variant="h1" style={styles.headerTitle}>Recuerdos</Text>
      
      {availableTopics.length > 0 && (
        <CategoryPills
          topics={availableTopics}
          selectedTopic={selectedTopic}
          onSelectTopic={(topic) => {
            if (topic === '') {
              if (selectedTopic !== null) toggleTopicFilter(selectedTopic);
            } else {
              toggleTopicFilter(topic);
            }
          }}
        />
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <MemoryCard m={item} layout="galeria" />
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: theme.colors.bg }]}>
            <Text variant="h2">{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="body" tone="faint">No se encontraron recuerdos.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 120,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
});
