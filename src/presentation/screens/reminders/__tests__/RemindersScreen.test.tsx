import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RemindersScreen } from '../RemindersScreen';
import { useRemindersViewModel } from '../../../viewModels/reminders/useRemindersViewModel';
import { Provider as PaperProvider } from 'react-native-paper';

// Mocks
jest.mock('../../../viewModels/reminders/useRemindersViewModel');

// We mock the ReminderCard since we're unit testing the screen
jest.mock('../../../components/reminders/ReminderCard', () => ({
  ReminderCard: ({ reminder, onToggle }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="reminder-card">
        <Text>{reminder.title}</Text>
        <TouchableOpacity testID={`toggle-${reminder.id}`} onPress={onToggle}>
          <Text>Toggle</Text>
        </TouchableOpacity>
      </View>
    );
  },
}));



const renderWithTheme = (component: React.ReactElement) => {
  return render(<PaperProvider>{component}</PaperProvider>);
};

describe('RemindersScreen', () => {
  const mockToggleReminderDone = jest.fn();
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRemindersViewModel as jest.Mock).mockReturnValue({
      reminders: [],
      isLoading: false,
      error: null,
      toggleReminderDone: mockToggleReminderDone,
      refetch: mockRefetch,
    });
  });

  it('renders loading indicator when isLoading is true and there are no reminders', () => {
    (useRemindersViewModel as jest.Mock).mockReturnValue({
      reminders: [],
      isLoading: true,
      error: null,
      toggleReminderDone: mockToggleReminderDone,
      refetch: mockRefetch,
    });

    const { getByRole } = renderWithTheme(<RemindersScreen />);
    
    // React Native Paper's ActivityIndicator typically has the 'progressbar' role
    expect(getByRole('progressbar')).toBeTruthy();
  });

  it('renders empty message when there are no reminders', () => {
    const { getByText } = renderWithTheme(<RemindersScreen />);
    
    // Header
    expect(getByText('Recordatorios')).toBeTruthy();
    expect(getByText('Creados solos, a partir de tu voz.')).toBeTruthy();

    // Empty message
    expect(getByText('No tienes recordatorios.')).toBeTruthy();
  });

  it('renders a list of ReminderCards', () => {
    const mockReminders = [
      { id: '1', title: 'Tomar medicina', is_done: false },
      { id: '2', title: 'Llamar al médico', is_done: true },
    ];

    (useRemindersViewModel as jest.Mock).mockReturnValue({
      reminders: mockReminders,
      isLoading: false,
      error: null,
      toggleReminderDone: mockToggleReminderDone,
      refetch: mockRefetch,
    });

    const { getByText, getAllByTestId } = renderWithTheme(<RemindersScreen />);
    
    // Header is present
    expect(getByText('Recordatorios')).toBeTruthy();

    // List items are present
    expect(getAllByTestId('reminder-card').length).toBe(2);
    expect(getByText('Tomar medicina')).toBeTruthy();
    expect(getByText('Llamar al médico')).toBeTruthy();
  });

  it('calls toggleReminderDone when a card is toggled', () => {
    const mockReminders = [
      { id: '1', title: 'Tomar medicina', is_done: false },
    ];

    (useRemindersViewModel as jest.Mock).mockReturnValue({
      reminders: mockReminders,
      isLoading: false,
      error: null,
      toggleReminderDone: mockToggleReminderDone,
      refetch: mockRefetch,
    });

    const { getByTestId } = renderWithTheme(<RemindersScreen />);
    
    const toggleButton = getByTestId('toggle-1');
    fireEvent.press(toggleButton);

    expect(mockToggleReminderDone).toHaveBeenCalledTimes(1);
    expect(mockToggleReminderDone).toHaveBeenCalledWith(mockReminders[0]);
  });
});
