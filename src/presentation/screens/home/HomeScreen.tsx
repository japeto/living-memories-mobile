import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Avatar, useTheme, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TouchableRipple } from 'react-native-paper';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useHomeViewModel } from '../../viewModels/home/useHomeViewModel';
import { RecordingHero } from '../../components/home/RecordingHero';
import { MemoryCard } from '../../components/home/MemoryCard';
import { useAuth } from '../../providers/AuthProvider';

export function HomeScreen() {
  const theme = useTheme();
  const vm = useHomeViewModel();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { userName } = useAuth();

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
            Buenos días, <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{userName || 'Usuario'}</Text>
          </Text>
        </View>
        <TouchableRipple onPress={() => navigation.navigate('Profile')} style={{ borderRadius: 24 }} borderless>
          <Avatar.Icon size={48} icon="account-outline" color="#407062" style={{ backgroundColor: '#E3EFEC' }} />
        </TouchableRipple>
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
          renderItem={({ item, index }) => (
            <View style={styles.timelineRow}>
              <View style={styles.timelineColumn}>
                <View style={[styles.timelineDot, { backgroundColor: item.id === vm.newId ? theme.colors.primary : '#6A9084' }]} />
                {index !== vm.memories.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineCard}>
                <MemoryCard memory={item} isNew={item.id === vm.newId} />
              </View>
            </View>
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
  },
  timelineRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  timelineColumn: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 24,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2DCD0',
    marginTop: 8,
    marginBottom: -24,
  },
  timelineCard: {
    flex: 1,
  }
});
