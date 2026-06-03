import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CategoryPills } from '../../components/CategoryPills';

// Mock del theme
jest.mock('../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      primary: '#000',
      surface: '#fff',
      surface2: '#f0f0f0',
      ink: '#333',
      line: '#ddd',
    },
  }),
}));

// Mock de resolveTopic
jest.mock('../../theme/taxonomy', () => ({
  resolveTopic: (topic: string) => ({
    color: '#123456',
  }),
}));

describe('CategoryPills', () => {
  const mockTopics = ['Familia', 'Amigos', 'Salud'];
  const mockOnSelectTopic = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar la píldora "Todos" y las opciones proporcionadas', () => {
    const { getByText } = render(
      <CategoryPills
        topics={mockTopics}
        selectedTopic={null}
        onSelectTopic={mockOnSelectTopic}
      />
    );

    expect(getByText('Todos')).toBeTruthy();
    expect(getByText('Familia')).toBeTruthy();
    expect(getByText('Amigos')).toBeTruthy();
    expect(getByText('Salud')).toBeTruthy();
  });

  it('debería llamar a onSelectTopic al presionar una píldora de categoría', () => {
    const { getByText } = render(
      <CategoryPills
        topics={mockTopics}
        selectedTopic={null}
        onSelectTopic={mockOnSelectTopic}
      />
    );

    fireEvent.press(getByText('Familia'));
    expect(mockOnSelectTopic).toHaveBeenCalledWith('Familia');
  });

  it('debería llamar a onSelectTopic con string vacío al presionar "Todos"', () => {
    const { getByText } = render(
      <CategoryPills
        topics={mockTopics}
        selectedTopic={'Familia'}
        onSelectTopic={mockOnSelectTopic}
      />
    );

    fireEvent.press(getByText('Todos'));
    expect(mockOnSelectTopic).toHaveBeenCalledWith('');
  });
});
