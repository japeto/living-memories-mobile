import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../../screens/home/HomeScreen';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { useHomeViewModel } from '../../viewModels/home/useHomeViewModel';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('../../viewModels/home/useHomeViewModel');

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../../providers/AuthProvider', () => ({
  useAuth: () => ({
    userName: 'Rosa',
  }),
}));

const NO_SPEECH_MESSAGE = 'No se detectó voz. Intenta de nuevo.';

const buildVmReturn = (overrides: Partial<ReturnType<typeof useHomeViewModel>> = {}) => ({
  memories: [],
  phase: 'idle' as const,
  seconds: 0,
  layerStep: 0,
  liveText: '',
  newId: null,
  onToggleRecord: jest.fn(),
  isLoading: false,
  errorMessage: null,
  dismissError: jest.fn(),
  ...overrides,
});

describe('HomeScreen', () => {
  const mockUseHomeViewModel = useHomeViewModel as jest.MockedFunction<typeof useHomeViewModel>;

  it('renders loading state when isLoading is true', () => {
    mockUseHomeViewModel.mockReturnValue(buildVmReturn({ isLoading: true }));

    const { getByTestId } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders header, hero, and memories list', () => {
    mockUseHomeViewModel.mockReturnValue(buildVmReturn({
      memories: [
        { id: '1', text: 'Test memory', time: '10:00', day: 'Hoy', topic: 'Familia', mood: 'Feliz', status: 'completed' as const },
      ],
    }));

    const { getByText } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );

    expect(getByText('Rosa')).toBeTruthy();
    expect(getByText('Hoy')).toBeTruthy();
    expect(getByText('Test memory')).toBeTruthy();
    expect(getByText('Toca para grabar un recuerdo')).toBeTruthy();
  });

  it('calls onToggleRecord when record button is pressed', () => {
    const mockOnToggleRecord = jest.fn();
    mockUseHomeViewModel.mockReturnValue(buildVmReturn({ onToggleRecord: mockOnToggleRecord }));

    const { getByTestId } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('record-button'));
    expect(mockOnToggleRecord).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when there are no memories', () => {
    mockUseHomeViewModel.mockReturnValue(buildVmReturn());

    const { getByText } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );

    expect(getByText('No tienes notas, guarda tu primer recuerdo')).toBeTruthy();
  });

  it('should render Snackbar with errorMessage when present', () => {
    mockUseHomeViewModel.mockReturnValue(buildVmReturn({
      errorMessage: NO_SPEECH_MESSAGE,
    }));

    const { getByText } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );

    expect(getByText(NO_SPEECH_MESSAGE)).toBeTruthy();
  });

  it('should call dismissError when Snackbar action is pressed', () => {
    const mockDismissError = jest.fn();
    mockUseHomeViewModel.mockReturnValue(buildVmReturn({
      errorMessage: NO_SPEECH_MESSAGE,
      dismissError: mockDismissError,
    }));

    const { getByText } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );

    fireEvent.press(getByText('Cerrar'));
    expect(mockDismissError).toHaveBeenCalled();
  });
});
