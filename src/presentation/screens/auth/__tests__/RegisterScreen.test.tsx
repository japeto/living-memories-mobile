import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RegisterScreen } from '../RegisterScreen';
import { useRegisterViewModel } from '../../../viewModels/auth/useRegisterViewModel';

// Mock theme and navigation
jest.mock('../../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: { background: '#FFF', primary: '#00F', line: '#EEE' },
    radius: { full: 999 },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

// Mock the ViewModel
jest.mock('../../../viewModels/auth/useRegisterViewModel');

// Mock components
jest.mock('../../../components/AuthHeader', () => ({
  AuthHeader: ({ title, subtitle, onBack }: any) => {
    const { Text } = require('react-native');
    return <Text onPress={onBack}>{title} {subtitle}</Text>;
  },
}));

jest.mock('../../../components/Field', () => ({
  Field: ({ label, value, onChangeText, placeholder, ...props }: any) => {
    const { TextInput } = require('react-native');
    return (
      <TextInput
        testID={`input-${label}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...props}
      />
    );
  },
}));

jest.mock('../../../components/Button', () => ({
  Button: ({ children, title, onPress, disabled, loading }: any) => {
    const { Pressable, Text } = require('react-native');
    const label = children || title;
    return (
      <Pressable testID={`button-${label}`} onPress={onPress} disabled={disabled || loading}>
        <Text>{loading ? 'Loading...' : label}</Text>
      </Pressable>
    );
  },
}));

jest.mock('../../../components/Text', () => ({
  Text: ({ children, onPress }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText onPress={onPress}>{children}</RNText>;
  },
}));

jest.mock('../../../components/Icon', () => ({
  Icon: () => null,
}));

const mockViewModel = {
  name: '',
  setName: jest.fn(),
  email: '',
  setEmail: jest.fn(),
  pin: '',
  setPin: jest.fn(),
  agree: false,
  setAgree: jest.fn(),
  isLoading: false,
  onRegister: jest.fn(),
  navigateToLogin: jest.fn(),
  goBack: jest.fn(),
};

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRegisterViewModel as jest.Mock).mockReturnValue(mockViewModel);
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<RegisterScreen />);
    
    expect(getByText('Crear cuenta Comienza a guardar tus memorias hoy')).toBeTruthy();
    expect(getByTestId('input-Nombre completo')).toBeTruthy();
    expect(getByTestId('input-Correo electrónico')).toBeTruthy();
    expect(getByTestId('input-Crea un PIN (4 dígitos)')).toBeTruthy();
    expect(getByTestId('button-Registrarme')).toBeTruthy();
  });

  it('updates fields when typed', () => {
    const { getByTestId } = render(<RegisterScreen />);
    
    fireEvent.changeText(getByTestId('input-Nombre completo'), 'Juan');
    expect(mockViewModel.setName).toHaveBeenCalledWith('Juan');

    fireEvent.changeText(getByTestId('input-Correo electrónico'), 'juan@a.com');
    expect(mockViewModel.setEmail).toHaveBeenCalledWith('juan@a.com');

    fireEvent.changeText(getByTestId('input-Crea un PIN (4 dígitos)'), '1234');
    expect(mockViewModel.setPin).toHaveBeenCalledWith('1234');
  });

  it('toggles terms agreement checkbox', () => {
    const { getByText } = render(<RegisterScreen />);
    const termsPressable = getByText('Acepto los términos y condiciones y política de privacidad');
    
    fireEvent.press(termsPressable);
    expect(mockViewModel.setAgree).toHaveBeenCalledWith(true);
  });

  it('disables register button if form is invalid', () => {
    const { getByTestId } = render(<RegisterScreen />);
    const btn = getByTestId('button-Registrarme');
    
    fireEvent.press(btn);
    expect(mockViewModel.onRegister).not.toHaveBeenCalled();
    expect(btn.props.accessibilityState?.disabled).toBe(true);
  });

  it('calls onRegister when valid', () => {
    (useRegisterViewModel as jest.Mock).mockReturnValue({
      ...mockViewModel,
      name: 'Juan',
      email: 'juan@a.com',
      pin: '1234',
      agree: true,
    });
    
    const { getByTestId } = render(<RegisterScreen />);
    const btn = getByTestId('button-Registrarme');
    
    fireEvent.press(btn);
    expect(mockViewModel.onRegister).toHaveBeenCalled();
  });

  it('navigates to Login when "Inicia sesión" is pressed', () => {
    const { getByText } = render(<RegisterScreen />);
    const loginLink = getByText('Inicia sesión');
    
    fireEvent.press(loginLink);
    expect(mockViewModel.navigateToLogin).toHaveBeenCalled();
  });

  it('goes back when AuthHeader back is pressed', () => {
    const { getByText } = render(<RegisterScreen />);
    const backBtn = getByText('Crear cuenta Comienza a guardar tus memorias hoy'); // because we mocked AuthHeader as clickable title
    
    fireEvent.press(backBtn);
    expect(mockViewModel.goBack).toHaveBeenCalled();
  });
});
