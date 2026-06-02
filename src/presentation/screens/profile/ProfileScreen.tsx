import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Button, useTheme, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useProfileViewModel } from '../../viewModels/profile/useProfileViewModel';

export function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { handleLogout } = useProfileViewModel();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Perfil" />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.header}>
          <Avatar.Icon size={80} icon="account" color="#407062" style={{ backgroundColor: '#E3EFEC' }} />
          <Text variant="headlineMedium" style={styles.name}>Rosa</Text>
        </View>
        
        <View style={styles.actions}>
          <Button 
            mode="contained" 
            onPress={handleLogout} 
            buttonColor={theme.colors.error}
            style={styles.logoutButton}
          >
            Cerrar Sesión
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 24,
  },
  name: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  actions: {
    width: '100%',
  },
  logoutButton: {
    paddingVertical: 4,
  }
});
