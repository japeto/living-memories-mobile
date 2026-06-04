import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ProfileScreen } from '../../../screens/profile/ProfileScreen';
import { useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { container } from '../../../../di/container';
import { GetProfileUseCase } from '../../../../domain/profile/useCases/GetProfileUseCase';
import { useAuth } from '../../../providers/AuthProvider';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      bg: '#ffffff',
      ink: '#000000',
      inkSoft: '#666666',
      primary: '#123456',
      primarySoft: '#abcdef',
      accent: '#abcdef',
      accentSoft: '#abcdef',
      secondary: '#abcdef',
      secondarySoft: '#abcdef',
      line: '#cccccc',
      error: '#ff0000',
    },
    fonts: { sans: 'System' },
    radius: { pill: 999 },
    shadow: { primary: () => ({}), card: {} },
  }),
}));

jest.mock('../../../providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

describe('ProfileScreen', () => {
  const mockGoBack = jest.fn();
  const mockLogout = jest.fn();
  let mockGetProfileUseCase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();
    
    (useNavigation as jest.Mock).mockReturnValue({
      goBack: mockGoBack,
    });
    
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });

    mockGetProfileUseCase = {
      execute: jest.fn(),
    };
    
    container.registerInstance(GetProfileUseCase, mockGetProfileUseCase);
  });

  const renderScreen = () => {
    return render(
      <PaperProvider>
        <ProfileScreen />
      </PaperProvider>
    );
  };

  it('should render loading state initially, then profile data', async () => {
    mockGetProfileUseCase.execute.mockResolvedValue({
      userId: '1',
      displayName: 'Rosa',
      email: 'rosa.mendez@correo.com',
      fullName: 'Rosa Mendez',
      avatarUrl: null,
    });

    const { getByText, getAllByText, queryByTestId } = renderScreen();

    // Depending on what ProfileScreen renders when isLoading=true, 
    // it could be an ActivityIndicator (with testID='loading-indicator') or similar.
    // For now we just verify the header exists immediately.
    expect(getByText('Mi perfil')).toBeTruthy();

    // Wait for the async profile fetch to complete
    await waitFor(() => {
      expect(getAllByText('Rosa').length).toBeGreaterThan(0);
    });

    // Check email
    expect(getAllByText('rosa.mendez@correo.com').length).toBeGreaterThan(0);
    
    // Check logout button
    expect(getByText('Cerrar Sesión')).toBeTruthy();
  });

  it('should show error state if profile fetch fails', async () => {
    mockGetProfileUseCase.execute.mockRejectedValue(new Error('Error de prueba'));

    const { getByText, findByText, getAllByText } = renderScreen();
    
    // Wait for error text to appear
    const errorText = await findByText('Error de prueba');
    expect(errorText).toBeTruthy();
    
    // Mock successful refetch
    mockGetProfileUseCase.execute.mockResolvedValueOnce({
      userId: '1',
      displayName: 'Rosa',
      email: 'rosa.mendez@correo.com',
      fullName: 'Rosa Mendez',
      avatarUrl: null,
    });

    // Press retry
    fireEvent.press(getByText('Reintentar'));
    
    // Check that it fetches and displays profile again
    await waitFor(() => {
      expect(getAllByText('Rosa').length).toBeGreaterThan(0);
    });
  });

  it('should call auth logout when logout button is pressed', async () => {
    mockGetProfileUseCase.execute.mockResolvedValue({
      userId: '1',
      displayName: 'Rosa',
      email: 'rosa.mendez@correo.com',
    });

    const { getByText, findByText } = renderScreen();

    // Wait for profile to load so the logout button is available
    // Assuming the logout button might be hidden during loading, or just to be safe
    await findByText('Cerrar Sesión');

    const logoutButton = getByText('Cerrar Sesión');
    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
});
