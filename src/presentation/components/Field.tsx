/* ============================================================
   Field — .field / .input-wrap port (TextInput)
   Usage: <Field label="Correo" icon="mail" value={v} onChangeText={...} />
        <Field label="Clave" icon="lock" secureTextEntry ... />
   ============================================================ */
import React, { useState } from 'react';
import { View, TextInput, Pressable, TextInputProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

export interface FieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  icon?: IconName;
  secureTextEntry?: boolean;   // shows the eye toggle
  error?: string;
}

export function Field({ label, icon, secureTextEntry, error, ...rest }: FieldProps) {
  const t = useTheme();
  const [focus, setFocus] = useState(false);
  const [show, setShow] = useState(false);
  const isPw = !!secureTextEntry;

  return (
    <View style={{ gap: 8 }}>
      {label && (
        <Text variant="label" tone="soft" style={{ paddingLeft: 4, fontSize: 16 }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          height: 62,
          paddingHorizontal: 18,
          borderRadius: t.radius.md,
          backgroundColor: t.colors.surface,
          borderWidth: focus ? 2.5 : 2,
          borderColor: error ? t.colors.error : focus ? t.colors.primary : t.colors.line,
        }}
      >
        {icon && (
          <Icon name={icon} size={23} color={focus ? t.colors.primary : t.colors.inkFaint} />
        )}
        <TextInput
          {...rest}
          secureTextEntry={isPw && !show}
          onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
          placeholderTextColor={t.colors.inkFaint}
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            fontFamily: t.fonts.sans,
            fontSize: 19,
            fontWeight: '600',
            color: t.colors.ink,
          }}
        />
        {isPw && (
          <Pressable onPress={() => setShow((s) => !s)} hitSlop={8} style={{ padding: 4 }}>
            <Icon name={show ? 'eyeoff' : 'eye'} size={22} color={t.colors.inkFaint} />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text variant="small" style={{ color: t.colors.error, paddingLeft: 4 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
