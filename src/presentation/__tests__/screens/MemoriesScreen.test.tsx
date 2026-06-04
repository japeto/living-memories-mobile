import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MemoriesScreen } from '../../screens/memories/MemoriesScreen';
import { useMemoriesViewModel } from '../../viewModels/memories/useMemoriesViewModel';

// Mocks
jest.mock('../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      bg: '#fff',
      primary: '#000',
      error: '#f00',
    },
  }),
}));

jest.mock('../../viewModels/memories/useMemoriesViewModel');

jest.mock('../../components/CategoryPills', () => ({
  CategoryPills: ({ topics, onSelectTopic }: any) => {
    const { View, TouchableOpacity, Text } = require('react-native');
    return (
      <View testID="category-pills">
        <TouchableOpacity onPress={() => onSelectTopic('')}>
          <Text>Todos</Text>
        </TouchableOpacity>
        {topics.map((t: string) => (
          <TouchableOpacity key={t} onPress={() => onSelectTopic(t)}>
            <Text>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  },
}));

jest.mock('../../components/MemoryCard', () => ({
  MemoryCard: ({ m }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="memory-card">
        <Text>{m.text}</Text>
      </View>
    );
  },
}));

describe('MemoriesScreen', () => {
  const mockToggleTopicFilter = jest.fn();
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useMemoriesViewModel as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      sections: [],
      availableTopics: [],
      selectedTopic: null,
      toggleTopicFilter: mockToggleTopicFilter,
      refetch: mockRefetch,
    });
  });

  it('renderiza loader cuando está cargando y no hay secciones', () => {
    (useMemoriesViewModel as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      sections: [],
      availableTopics: [],
      selectedTopic: null,
      toggleTopicFilter: mockToggleTopicFilter,
      refetch: mockRefetch,
    });

    const { getByTestId } = render(<MemoriesScreen />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renderiza mensaje de error si ocurre una falla', () => {
    (useMemoriesViewModel as jest.Mock).mockReturnValue({
      isLoading: false,
      error: 'Error de prueba',
      sections: [],
      availableTopics: [],
      selectedTopic: null,
      toggleTopicFilter: mockToggleTopicFilter,
      refetch: mockRefetch,
    });

    const { getByText } = render(<MemoriesScreen />);
    expect(getByText('Error de prueba')).toBeTruthy();
  });

  it('renderiza la lista vacía cuando no hay recuerdos', () => {
    const { getByText } = render(<MemoriesScreen />);
    expect(getByText('Recuerdos')).toBeTruthy(); // Título
    expect(getByText('No se encontraron recuerdos.')).toBeTruthy();
  });

  it('renderiza secciones y tarjetas de recuerdos', () => {
    (useMemoriesViewModel as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      sections: [
        {
          title: 'Hoy',
          data: [
            { id: '1', text: 'Recuerdo 1' }
          ]
        }
      ],
      availableTopics: ['Familia'],
      selectedTopic: null,
      toggleTopicFilter: mockToggleTopicFilter,
      refetch: mockRefetch,
    });

    const { getByText, getAllByTestId, getByTestId } = render(<MemoriesScreen />);
    
    expect(getByText('Hoy')).toBeTruthy(); // Section Header
    expect(getByText('Recuerdo 1')).toBeTruthy(); // Memory text
    expect(getAllByTestId('memory-card').length).toBe(1);
    expect(getByTestId('category-pills')).toBeTruthy();
  });

  it('llama a toggleTopicFilter al seleccionar un tópico en CategoryPills', () => {
    (useMemoriesViewModel as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      sections: [],
      availableTopics: ['Familia', 'Amigos'],
      selectedTopic: null,
      toggleTopicFilter: mockToggleTopicFilter,
      refetch: mockRefetch,
    });

    const { getByText } = render(<MemoriesScreen />);
    
    fireEvent.press(getByText('Familia'));
    expect(mockToggleTopicFilter).toHaveBeenCalledWith('Familia');
  });

  it('llama a toggleTopicFilter con el topic actual si se selecciona "Todos" y había un filtro', () => {
    (useMemoriesViewModel as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      sections: [],
      availableTopics: ['Familia'],
      selectedTopic: 'Familia', // Hay un filtro seleccionado
      toggleTopicFilter: mockToggleTopicFilter,
      refetch: mockRefetch,
    });

    const { getByText } = render(<MemoriesScreen />);
    
    fireEvent.press(getByText('Todos')); // Mapeado a string vacío
    expect(mockToggleTopicFilter).toHaveBeenCalledWith('Familia');
  });
});
