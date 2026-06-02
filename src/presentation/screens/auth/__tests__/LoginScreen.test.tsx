import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';
import { useLoginViewModel } from '../../../viewModels/auth/useLoginViewModel';

// Mock theme and navigation
jest.mock('../../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: { background: '#FFF', primary: '#00F', line: '#EEE' },
    radius: { full: 999 },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

// Mock the ViewModel
jest.mock('../../../viewModels/auth/useLoginViewModel');

// Mock components to simplify tests
jest.mock('../../../components/AuthHeader', () => ({
  AuthHeader: ({ title, subtitle }: any) => {
    const { Text } = require('react-native');
    return <Text>{title} {subtitle}</Text>;
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
  Button: ({ title, onPress, disabled, loading }: any) => {
    const { Pressable, Text } = require('react-native');
    return (
      <Pressable testID={`button-${title}`} onPress={onPress} disabled={disabled || loading}>
        <Text>{loading ? 'Loading...' : title}</Text>
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

const mockViewModel = {
  email: '',
  setEmail: jest.fn(),
  pin: '',
  setPin: jest.fn(),
  isLoading: false,
  onLogin: jest.fn(),
  navigateToRegister: jest.fn(),
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLoginViewModel as jest.Mock).mockReturnValue(mockViewModel);
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<LoginScreen />);
    
    // AuthHeader strings
    expect(getByText('Bienvenido de nuevo Ingresa tus datos para continuar')).toBeTruthy();
    
    // Inputs
    expect(getByTestId('input-Correo electrónico')).toBeTruthy();
    expect(getByTestId('input-PIN de acceso')).toBeTruthy();
    
    // Button
    expect(getByTestId('button-Ingresar')).toBeTruthy();
  });

  it('calls setEmail when email input changes', () => {
    const { getByTestId } = render(<LoginScreen />);
    const emailInput = getByTestId('input-Correo electrónico');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(mockViewModel.setEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('calls setPin when pin input changes', () => {
    const { getByTestId } = render(<LoginScreen />);
    const pinInput = getByTestId('input-PIN de acceso');
    
    fireEvent.changeText(pinInput, '1234');
    expect(mockViewModel.setPin).toHaveBeenCalledWith('1234');
  });

  it('calls onLogin when button is pressed', () => {
    // Modify mock to allow button click
    (useLoginViewModel as jest.Mock).mockReturnValue({
      ...mockViewModel,
      email: 'a@a.com',
      pin: '1234',
    });
    
    const { getByTestId } = render(<LoginScreen />);
    const loginBtn = getByTestId('button-Ingresar');
    
    fireEvent.press(loginBtn);
    expect(mockViewModel.onLogin).toHaveBeenCalled();
  });

  it('disables login button if fields are incomplete', () => {
    (useLoginViewModel as jest.Mock).mockReturnValue({
      ...mockViewModel,
      email: '',
      pin: '',
    });
    
    const { getByTestId } = render(<LoginScreen />);
    const loginBtn = getByTestId('button-Ingresar');
    
    // Attempt to press
    fireEvent.press(loginBtn);
    expect(mockViewModel.onLogin).not.toHaveBeenCalled();
    expect(loginBtn.props.accessibilityState?.disabled).toBe(true);
  });

  it('navigates to Register when "Regístrate aquí" is pressed', () => {
    const { getByText } = render(<LoginScreen />);
    const registerLink = getByText('Regístrate aquí');
    
    fireEvent.press(registerLink);
    expect(mockViewModel.navigateToRegister).toHaveBeenCalled();
  });
});
