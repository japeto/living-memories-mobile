import React from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme/ThemeProvider';
import { useWellnessViewModel } from '../../viewModels/wellness/useWellnessViewModel';
import { MoodChart } from '../../components/wellness/MoodChart';
import { TopicDistribution } from '../../components/wellness/TopicDistribution';

export function WellnessScreen() {
  const t = useTheme();
  const { data, isLoading, error, refetch } = useWellnessViewModel();

  if (isLoading && !data) {
    return (
      <View style={[styles.centered, { backgroundColor: t.colors.bg }]}>
        <ActivityIndicator size="large" color={t.colors.primary} />
        <Text style={{ marginTop: 16 }} tone="soft">
          Cargando tu bienestar...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: t.colors.bg, padding: 24 }]}>
        <Icon name="info" size={48} color={t.colors.primary} />
        <Text variant="h2" style={{ marginTop: 16, textAlign: 'center' }}>
          Ups, algo salió mal
        </Text>
        <Text
          variant="body"
          tone="soft"
          style={{ marginTop: 8, textAlign: 'center', marginBottom: 24 }}
        >
          {error}
        </Text>
        <Button variant="primary" onPress={refetch}>
          Reintentar
        </Button>
      </View>
    );
  }

  if (!data || (data.moods.length === 0 && data.topics.length === 0)) {
    return (
      <View style={[styles.centered, { backgroundColor: t.colors.bg, padding: 24 }]}>
        <Icon name="mic" size={48} color={t.colors.secondary} />
        <Text variant="h2" style={{ marginTop: 16, textAlign: 'center' }}>
          Aún no hay datos
        </Text>
        <Text
          variant="body"
          tone="soft"
          style={{ marginTop: 8, textAlign: 'center', marginBottom: 24 }}
        >
          Parece que no has grabado memorias esta semana. ¡Anímate a compartir lo que piensas para
          generar tu resumen de bienestar!
        </Text>
        <Button variant="soft" onPress={refetch}>
          Actualizar
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.colors.bg }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={t.colors.primary} />
      }
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
          <Text
            variant="body"
            style={{ color: t.colors.secondary, marginLeft: 8, fontWeight: '600' }}
          >
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

      {data.moods && data.moods.length > 0 && (
        <Card style={styles.sectionCard}>
          <Text variant="h3">Ánimo de la semana</Text>
          <MoodChart data={data.moods} />
        </Card>
      )}

      {data.topics && data.topics.length > 0 && (
        <Card style={styles.sectionCard}>
          <Text variant="h3">De qué hablas más</Text>
          <TopicDistribution data={data.topics} />
        </Card>
      )}

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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
