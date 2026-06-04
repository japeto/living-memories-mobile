import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../providers/AuthProvider';
import { useProfileViewModel } from '../../viewModels/profile/useProfileViewModel';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { Field } from '../../components/Field';
import { Chip } from '../../components/Chip';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { formatMonthYear } from '../../../utils/date';

export function ProfileScreen() {
  const t = useTheme();
  const navigation = useNavigation();
  const { user, preferredNameInput, setPreferredNameInput, handleLogout } = useProfileViewModel();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const memberSince = formatMonthYear(user?.createdAt);

  return (
    <View style={[styles.container, { backgroundColor: t.colors.bg }]}>
      <Appbar.Header style={{ backgroundColor: t.colors.bg, elevation: 0 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color={t.colors.ink} />
        <Appbar.Content title="Mi perfil" titleStyle={{ color: t.colors.ink, fontFamily: t.fonts.sans, fontWeight: '700' }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header (Avatar & Basic Info) */}
        <View style={styles.header}>
          <Avatar.Text 
            size={80} 
            label={getInitials(user?.displayName)} 
            color={t.colors.primary} 
            style={{ backgroundColor: t.colors.primarySoft }} 
          />
          <Text variant="h2" style={{ marginTop: 16 }}>{user?.displayName || 'Usuario'}</Text>
          <Text variant="body" tone="soft" style={{ marginTop: 4 }}>{user?.email || 'correo@ejemplo.com'}</Text>
          
          <Chip 
            icon="leaf" 
            color={t.colors.accent}
            soft={t.colors.accentSoft}
            style={{ marginTop: 12 }}
          >
            {`Miembro desde ${memberSince}`}
          </Chip>
        </View>

        {/* Preferred Name Section */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>¿Cómo quieres que te llamemos?</Text>
          <Field 
            icon="user"
            value={preferredNameInput}
            onChangeText={setPreferredNameInput}
            placeholder="Tu nombre preferido"
          />
          <Text variant="small" tone="soft" style={{ marginTop: 8, paddingHorizontal: 4 }}>
            Así te saludaremos cada mañana — por ejemplo, "Buenos días, {preferredNameInput || 'Rosa'}".
          </Text>
        </View>

        {/* Account Data Section */}
        <View style={styles.section}>
          <Text variant="tiny" tone="soft" style={styles.sectionLabel}>DATOS DE TU CUENTA</Text>
          <Card>
            {/* Row 1: Name */}
            <View style={styles.cardRow}>
              <View style={styles.cardRowLeft}>
                <Icon name="user" size={24} color={t.colors.inkSoft} />
                <Text variant="body" style={{ marginLeft: 12 }}>Nombre completo</Text>
              </View>
              <Text variant="body" tone="soft" style={{ flexShrink: 1, textAlign: 'right' }} numberOfLines={1}>
                {user?.displayName || 'Usuario'}
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
                  {user?.email || 'correo@ejemplo.com'}
                </Text>
                {user?.isEmailVerified && (
                  <Chip icon="check" color={t.colors.secondary} soft={t.colors.secondarySoft}>
                    Verificado
                  </Chip>
                )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
