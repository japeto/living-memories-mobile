import React from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';

import { AuthHeader } from '../../components/AuthHeader';
import { Field } from '../../components/Field';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';

import { useRegisterViewModel } from '../../viewModels/auth/useRegisterViewModel';

export function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const navigation = useNavigation();
  const vm = useRegisterViewModel(navigation);

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
          title="Crear cuenta"
          subtitle="Comienza a guardar tus memorias hoy"
          onBack={vm.goBack}
        />

        <View style={{ gap: 20 }}>
          <Field
            label="Nombre completo"
            icon="user"
            value={vm.name}
            onChangeText={vm.setName}
            autoCapitalize="words"
            placeholder="Juan Pérez"
          />

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
            label="Crea un PIN (4 dígitos)"
            icon="lock"
            value={vm.pin}
            onChangeText={vm.setPin}
            secureTextEntry={true}
            keyboardType="numeric"
            maxLength={4}
            placeholder="****"
          />

          <Pressable 
            onPress={() => vm.setAgree(!vm.agree)}
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 }}
          >
            <View 
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: vm.agree ? t.colors.primary : t.colors.line,
                backgroundColor: vm.agree ? t.colors.primary : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {vm.agree && <Icon name="check" size={16} color="#fff" />}
            </View>
            <Text variant="body" tone="soft" style={{ flex: 1 }}>
              Acepto los términos y condiciones y política de privacidad
            </Text>
          </Pressable>

          <Button
            title="Registrarme"
            onPress={vm.onRegister}
            loading={vm.isLoading}
            disabled={vm.isLoading || !vm.name || !vm.email || vm.pin.length < 4 || !vm.agree}
            style={{ marginTop: 12 }}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
          <Text variant="body" tone="soft">
            ¿Ya tienes cuenta?{' '}
          </Text>
          <Text 
            variant="body" 
            style={{ color: t.colors.primary, fontWeight: '700' }}
            onPress={vm.navigateToLogin}
          >
            Inicia sesión
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
