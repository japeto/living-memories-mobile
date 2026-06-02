import React from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';

import { AuthHeader } from '../../components/AuthHeader';
import { Field } from '../../components/Field';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';

import { useLoginViewModel } from '../../viewModels/auth/useLoginViewModel';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const navigation = useNavigation();
  const vm = useLoginViewModel(navigation);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 32,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title="Bienvenido de nuevo"
          subtitle="Ingresa tus datos para continuar"
        />

        <View style={{ gap: 20 }}>
          <Field
            label="Correo electrónico"
            icon="mail"
            value={vm.email}
            onChangeText={vm.setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="ejemplo@correo.com"
          />

          <Field
            label="PIN de acceso"
            icon="lock"
            value={vm.pin}
            onChangeText={vm.setPin}
            secureTextEntry={true}
            keyboardType="numeric"
            maxLength={4}
            placeholder="****"
          />

          <Button
            onPress={vm.onLogin}
            loading={vm.isLoading}
            disabled={vm.isLoading || !vm.email || vm.pin.length < 4}
            style={{ marginTop: 12 }}
          >
            Ingresar
          </Button>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
          <Text variant="body" tone="soft">
            ¿No tienes cuenta?{' '}
          </Text>
          <Text 
            variant="body" 
            style={{ color: t.colors.primary, fontWeight: '700' }}
            onPress={vm.navigateToRegister}
          >
            Regístrate aquí
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
