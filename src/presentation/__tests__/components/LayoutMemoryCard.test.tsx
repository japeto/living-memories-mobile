import React from 'react';
import { render } from '@testing-library/react-native';
import { MemoryCard } from '../../components/MemoryCard';

jest.mock('../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      primary: '#000',
      primarySoft: '#aaa',
      surface: '#fff',
      surface2: '#f0f0f0',
      line: '#ddd',
    },
    radius: {
      pill: 99,
      lg: 16,
    },
    shadow: {
      card: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
    },
  }),
}));

jest.mock('../../theme/taxonomy', () => ({
  resolveTopic: (topic: string) => ({
    color: '#123456',
    soft: '#abcdef',
    icon: 'star',
  }),
  resolveMood: (mood: string) => ({
    color: '#654321',
  }),
}));

describe('MemoryCard (Layouts)', () => {
  const mockMemory = {
    id: '1',
    text: 'Texto del recuerdo',
    topic: 'Familia',
    mood: 'Feliz',
    time: '12:00',
    date: new Date().toISOString(),
    summary: 'Resumen',
    tags: [],
    audioUrl: null,
  };

  it('renderiza correctamente en layout "galeria"', () => {
    const { getByText } = render(<MemoryCard m={mockMemory} layout="galeria" />);
    
    expect(getByText('"Texto del recuerdo"')).toBeTruthy();
    expect(getByText('Familia')).toBeTruthy();
    expect(getByText('Feliz')).toBeTruthy();
    expect(getByText('12:00')).toBeTruthy();
  });

  it('renderiza recordatorio si existe en layout "galeria"', () => {
    const memoryWithReminder = { ...mockMemory, reminder: 'Recordatorio test' };
    const { getByText } = render(<MemoryCard m={memoryWithReminder} layout="galeria" />);
    
    expect(getByText('Recordatorio')).toBeTruthy(); // Chip contains generic 'Recordatorio' in gallery layout
  });

  it('renderiza correctamente en layout "compacto"', () => {
    const { getByText } = render(<MemoryCard m={mockMemory} layout="compacto" />);
    
    expect(getByText('Texto del recuerdo')).toBeTruthy(); // No quotes in compact
    expect(getByText('Familia')).toBeTruthy();
    expect(getByText('12:00')).toBeTruthy();
  });

  it('renderiza recordatorio si existe en layout "compacto"', () => {
    const memoryWithReminder = { ...mockMemory, reminder: 'Llamar a Juan' };
    const { getByText } = render(<MemoryCard m={memoryWithReminder} layout="compacto" />);
    
    expect(getByText('Llamar a Juan')).toBeTruthy(); // Compact layout renders the reminder text
  });

  it('renderiza correctamente en layout "diario" (por defecto)', () => {
    const { getByText } = render(<MemoryCard m={mockMemory} />);
    
    expect(getByText('"Texto del recuerdo"')).toBeTruthy(); // Quotes in diario
    expect(getByText('Familia')).toBeTruthy();
    expect(getByText('Feliz')).toBeTruthy();
    expect(getByText('12:00')).toBeTruthy();
  });
});
