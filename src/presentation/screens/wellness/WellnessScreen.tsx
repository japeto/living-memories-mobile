import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';
import { useTheme } from '../../theme/ThemeProvider';
import { useWellnessViewModel } from '../../viewModels/wellness/useWellnessViewModel';
import { MoodChart } from '../../components/wellness/MoodChart';
import { TopicDistribution } from '../../components/wellness/TopicDistribution';

export function WellnessScreen() {
  const t = useTheme();
  const { data } = useWellnessViewModel();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: t.colors.bg }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text variant="h1">Mi Bienestar</Text>
        <Text variant="body" tone="soft" style={styles.subtitle}>
          Un vistazo a tus emociones y temas recurrentes.
        </Text>
      </View>

      <Card style={[styles.highlightCard, { backgroundColor: t.colors.secondarySoft }]}>
        <View style={styles.highlightHeader}>
          <Icon name="heart" size={24} color={t.colors.secondary} />
          <Text variant="body" style={{ color: t.colors.secondary, marginLeft: 8, fontWeight: '600' }}>
            ESTA SEMANA
          </Text>
        </View>
        <Text variant="h2" style={styles.highlightTitle}>
          {data.week}
        </Text>
        <Text variant="body" tone="soft">
          Has estado compartiendo recuerdos principalmente sobre tu familia y tus rutinas diarias.
        </Text>
      </Card>

      <Card style={styles.sectionCard}>
        <Text variant="h3">Ánimo de la semana</Text>
        <MoodChart data={data.moods} />
      </Card>

      <Card style={styles.sectionCard}>
        <Text variant="h3">De qué hablas más</Text>
        <TopicDistribution data={data.topics} />
      </Card>
      
      {/* Padding at the bottom for scroll */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginTop: 48, // space for status bar
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
  },
  highlightCard: {
    marginBottom: 24,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightTitle: {
    marginBottom: 8,
  },
  sectionCard: {
    marginBottom: 24,
  },
});
