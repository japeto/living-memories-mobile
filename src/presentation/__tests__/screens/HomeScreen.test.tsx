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

describe('HomeScreen', () => {
  const mockUseHomeViewModel = useHomeViewModel as jest.MockedFunction<typeof useHomeViewModel>;

  it('renders loading state when isLoading is true', () => {
    mockUseHomeViewModel.mockReturnValue({
      memories: [],
      phase: 'idle',
      seconds: 0,
      layerStep: 0,
      newId: null,
      onToggleRecord: jest.fn(),
      isLoading: true,
    });

    const { getByTestId } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );

    // It should render ActivityIndicator, let's just check for general structure
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders header, hero, and memories list', () => {
    mockUseHomeViewModel.mockReturnValue({
      memories: [
        { id: 1, text: 'Test memory', time: '10:00', day: 'Hoy', topic: 'Familia', mood: 'Feliz' },
      ],
      phase: 'idle',
      seconds: 0,
      layerStep: 0,
      newId: null,
      onToggleRecord: jest.fn(),
      isLoading: false,
    });

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
    mockUseHomeViewModel.mockReturnValue({
      memories: [],
      phase: 'idle',
      seconds: 0,
      layerStep: 0,
      newId: null,
      onToggleRecord: mockOnToggleRecord,
      isLoading: false,
    });

    const { getByTestId } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('record-button'));
    expect(mockOnToggleRecord).toHaveBeenCalledTimes(1);
  });
});
