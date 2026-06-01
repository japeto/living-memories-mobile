import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from '../components/Text';
import { useTheme } from '../theme/ThemeProvider';

export function SplashScreen() {
  const t = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.colors.bg }]}>
      <View style={styles.content}>
        {/* Central Graphic */}
        <View style={styles.graphicContainer}>
          <View style={[styles.ringOuter, { borderColor: t.colors.line }]}>
            <View style={[styles.ringInner, { borderColor: t.colors.primarySoft }]}>
              <View style={[styles.core, { backgroundColor: t.colors.primary }]} />
            </View>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text variant="h1" tone="ink" style={styles.titleLine1}>
            Mi Recuerdo
          </Text>
          <Text variant="display" tone="primary" style={styles.titleLine2}>
            Vivo
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text variant="body" tone="soft">
          Tu voz, guardada con cariño
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60, // visual balance
  },
  graphicContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleLine1: {
    fontSize: 42,
    lineHeight: 46,
    marginBottom: 0,
  },
  titleLine2: {
    fontSize: 42,
    lineHeight: 46,
    fontStyle: 'italic',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
});
