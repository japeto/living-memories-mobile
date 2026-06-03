import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProfileScreen } from '../../../screens/profile/ProfileScreen';
import { useNavigation } from '@react-navigation/native';
import { useProfileViewModel } from '../../../viewModels/profile/useProfileViewModel';
import { Provider as PaperProvider } from 'react-native-paper';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../../viewModels/profile/useProfileViewModel', () => ({
  useProfileViewModel: jest.fn(),
}));

jest.mock('../../../providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

describe('ProfileScreen', () => {
  const mockGoBack = jest.fn();
  const mockHandleLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      goBack: mockGoBack,
    });
    (useProfileViewModel as jest.Mock).mockReturnValue({
      handleLogout: mockHandleLogout,
    });
    const { useAuth } = require('../../../providers/AuthProvider');
    (useAuth as jest.Mock).mockReturnValue({
      userName: 'Rosa',
    });
  });

  const renderScreen = () => {
    return render(
      <PaperProvider>
        <ProfileScreen />
      </PaperProvider>
    );
  };

  it('should render correctly', () => {
    const { getByText, getByRole } = renderScreen();

    // Check header
    expect(getByText('Perfil')).toBeTruthy();
    // Check name
    expect(getByText('Rosa')).toBeTruthy();
    // Check logout button
    expect(getByText('Cerrar Sesión')).toBeTruthy();
  });

  it('should call goBack when back button is pressed', () => {
    const { getByLabelText } = renderScreen();

    // The Appbar.BackAction typically sets accessibilityLabel to "Back" or similar, 
    // but in RNTL it might just be found by testID or generic button. 
    // Appbar.BackAction usually has a default accessibility label 'Back'.
    const backButton = getByLabelText('Back');
    fireEvent.press(backButton);

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('should call handleLogout when logout button is pressed', () => {
    const { getByText } = renderScreen();

    const logoutButton = getByText('Cerrar Sesión');
    fireEvent.press(logoutButton);

    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });
});
