import React from 'react';
import { render } from '@testing-library/react-native';
import { MemoryCard } from '../../components/home/MemoryCard';
import { ThemeProvider } from '../../theme/ThemeProvider';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('MemoryCard', () => {
  const defaultMemory = {
    id: 1,
    time: '12:00',
    day: 'Hoy',
    text: 'Fui a pasear con mi nieto al parque.',
    topic: 'Familia',
    mood: 'Feliz',
  };

  it('renders memory text and basic tags correctly', () => {
    const { getByText, queryByText } = render(
      <ThemeProvider>
        <MemoryCard memory={defaultMemory} />
      </ThemeProvider>
    );

    expect(getByText('Fui a pasear con mi nieto al parque.')).toBeTruthy();
    expect(getByText('Familia')).toBeTruthy();
    expect(getByText('Feliz')).toBeTruthy();
    expect(getByText('12:00')).toBeTruthy();
    
    // Reminder shouldn't be there
    expect(queryByText('Recordatorio')).toBeNull();
  });

  it('renders reminder tag when memory has a reminder', () => {
    const memoryWithReminder = {
      ...defaultMemory,
      reminder: 'Llamar a mi nieto mañana',
    };

    const { getByText } = render(
      <ThemeProvider>
        <MemoryCard memory={memoryWithReminder} />
      </ThemeProvider>
    );

    expect(getByText('Llamar a mi nieto mañana')).toBeTruthy();
  });
});
