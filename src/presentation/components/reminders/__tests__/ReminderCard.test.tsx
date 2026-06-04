import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { ReminderCard } from '../ReminderCard';
import { Provider as PaperProvider } from 'react-native-paper';
import { Reminder } from '../../../../domain/reminders/entities/Reminder';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('../../../../utils/date', () => ({
  formatReminderDate: jest.fn(() => 'lun. 10:00'),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<PaperProvider>{component}</PaperProvider>);
};

describe('ReminderCard', () => {
  const mockReminder: Reminder = {
    id: '1',
    memory_id: 'm1',
    title: 'Tomar medicina',
    description: 'Pastilla para la presión',
    due_date: '2026-06-03T10:00:00Z',
    is_done: false,
  };

  const mockOnToggle = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders reminder details correctly when not done', () => {
    const { getByText } = renderWithTheme(
      <ReminderCard reminder={mockReminder} onToggle={mockOnToggle} />
    );

    // Title and formatted date
    expect(getByText('Tomar medicina · lun. 10:00')).toBeTruthy();
    
    // Description
    expect(getByText('Pastilla para la presión')).toBeTruthy();
  });

  it('applies strikethrough styles when reminder is done', () => {
    const doneReminder = { ...mockReminder, is_done: true };
    const { getByText } = renderWithTheme(
      <ReminderCard reminder={doneReminder} onToggle={mockOnToggle} />
    );

    const titleElement = getByText('Tomar medicina · lun. 10:00');
    expect(StyleSheet.flatten(titleElement.props.style).textDecorationLine).toBe('line-through');

    const descriptionElement = getByText('Pastilla para la presión');
    expect(StyleSheet.flatten(descriptionElement.props.style).textDecorationLine).toBe('line-through');
  });

  it('calls onToggle when icon button is pressed', () => {
    // We can find the button by its testID or role, but react-native-paper IconButton 
    // is often tested by finding the accessibility role 'button'
    const { getByRole } = renderWithTheme(
      <ReminderCard reminder={mockReminder} onToggle={mockOnToggle} />
    );

    const button = getByRole('button');
    fireEvent.press(button);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });
});
