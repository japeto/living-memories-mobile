import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useProfileViewModel } from '../../viewModels/profile/useProfileViewModel';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { Field } from '../../components/Field';
import { Chip } from '../../components/Chip';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';

export function ProfileScreen() {
  const t = useTheme();
  const navigation = useNavigation();
  const { profile, isLoading, error, handleLogout, refetch } = useProfileViewModel();

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <View style={[styles.container, { backgroundColor: t.colors.bg }]}>
      <Appbar.Header style={{ backgroundColor: t.colors.bg, elevation: 0 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color={t.colors.ink} />
        <Appbar.Content title="Mi perfil" titleStyle={{ color: t.colors.ink, fontFamily: t.fonts.sans, fontWeight: '700' }} />
      </Appbar.Header>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={t.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text variant="body" tone="error" style={{ marginBottom: 16 }}>{error}</Text>
          <Button onPress={refetch}>Reintentar</Button>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header (Avatar & Basic Info) */}
          <View style={styles.header}>
            <Avatar.Text 
              size={80} 
              label={getInitials(profile?.displayName)} 
              color={t.colors.primary} 
              style={{ backgroundColor: t.colors.primarySoft }} 
            />
            <Text variant="h2" style={{ marginTop: 16 }}>{profile?.displayName || 'Usuario'}</Text>
            <Text variant="body" tone="soft" style={{ marginTop: 4 }}>{profile?.email || 'Sin correo'}</Text>
            
            <Chip 
              icon="user" 
              color={t.colors.accent}
              soft={t.colors.accentSoft}
              style={{ marginTop: 12 }}
            >
              Miembro Activo
            </Chip>
          </View>

          {/* Account Data Section */}
          <View style={styles.section}>
            <Text variant="tiny" tone="soft" style={styles.sectionLabel}>DATOS DE TU CUENTA</Text>
            <Card>
              {/* Row 1: Name */}
              <View style={styles.cardRow}>
                <View style={styles.cardRowLeft}>
                  <Icon name="user" size={24} color={t.colors.inkSoft} />
                  <Text variant="body" style={{ marginLeft: 12 }}>Nombre</Text>
                </View>
                <Text variant="body" tone="soft" style={{ flexShrink: 1, textAlign: 'right' }} numberOfLines={1}>
                  {profile?.displayName || 'Usuario'}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: t.colors.line }]} />

              {/* Row 1.5: Full Name */}
              <View style={styles.cardRow}>
                <View style={styles.cardRowLeft}>
                  <Icon name="user" size={24} color={t.colors.inkSoft} />
                  <Text variant="body" style={{ marginLeft: 12 }}>Nombre completo</Text>
                </View>
                <Text variant="body" tone="soft" style={{ flexShrink: 1, textAlign: 'right' }} numberOfLines={1}>
                  {profile?.fullName || 'No especificado'}
                </Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: t.colors.line }]} />
              
              {/* Row 2: Email */}
              <View style={styles.cardRow}>
                <View style={styles.cardRowLeft}>
                  <Icon name="mail" size={24} color={t.colors.inkSoft} />
                  <Text variant="body" style={{ marginLeft: 12 }}>Correo registrado</Text>
                </View>
                <View style={styles.cardRowRight}>
                  <Text variant="body" tone="soft" style={{ flexShrink: 1, textAlign: 'right', marginRight: 8 }} numberOfLines={1}>
                    {profile?.email || 'Sin correo'}
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Application Section */}
          <View style={styles.section}>
            <Text variant="tiny" tone="soft" style={styles.sectionLabel}>APLICACIÓN</Text>
            <Card>
              <View style={styles.cardRow}>
                <View style={styles.cardRowLeft}>
                  <Icon name="info" size={24} color={t.colors.inkSoft} />
                  <View style={{ marginLeft: 12 }}>
                    <Text variant="body">Acerca de la aplicación</Text>
                    <Text variant="small" tone="soft">Recuerdo Vivo · Versión 1.0.0</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color={t.colors.inkFaint} />
              </View>
            </Card>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <Button 
              onPress={handleLogout} 
              variant="ghost" 
              block
            >
              Cerrar Sesión
            </Button>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionLabel: {
    marginBottom: 8,
    marginLeft: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  logoutContainer: {
    marginTop: 16,
  }
});
