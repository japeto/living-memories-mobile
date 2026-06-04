import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WellnessScreen } from '../WellnessScreen';
import { useWellnessViewModel } from '../../../viewModels/wellness/useWellnessViewModel';
import { ThemeProvider } from '../../../theme/ThemeProvider';

jest.mock('../../../viewModels/wellness/useWellnessViewModel', () => ({
  useWellnessViewModel: jest.fn()
}));

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('WellnessScreen', () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state when isLoading is true and no data', () => {
    (useWellnessViewModel as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });

    const { getByText, getByTestId } = renderWithTheme(<WellnessScreen />);
    
    expect(getByText('Cargando tu bienestar...')).toBeTruthy();
  });

  it('should render error state and call refetch when retry button is pressed', () => {
    (useWellnessViewModel as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Hubo un error de red',
      refetch: mockRefetch,
    });

    const { getByText } = renderWithTheme(<WellnessScreen />);
    
    expect(getByText('Ups, algo salió mal')).toBeTruthy();
    expect(getByText('Hubo un error de red')).toBeTruthy();
    
    const retryButton = getByText('Reintentar');
    fireEvent.press(retryButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should render empty state when data has no moods and no topics', () => {
    (useWellnessViewModel as jest.Mock).mockReturnValue({
      data: {
        week: 'Semana vacía',
        moods: [],
        topics: []
      },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { getByText } = renderWithTheme(<WellnessScreen />);
    
    expect(getByText('Aún no hay datos')).toBeTruthy();
    expect(getByText('Parece que no has grabado memorias esta semana. ¡Anímate a compartir lo que piensas para generar tu resumen de bienestar!')).toBeTruthy();
    
    const refreshButton = getByText('Actualizar');
    fireEvent.press(refreshButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should render the wellness data when available', () => {
    (useWellnessViewModel as jest.Mock).mockReturnValue({
      data: {
        week: 'Semana de Prueba',
        moods: [{ day: 'L', level: 0.8, label: 'Alegría' }],
        topics: [{ name: 'Familia', percentage: 50 }]
      },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { getByText } = renderWithTheme(<WellnessScreen />);
    
    expect(getByText('Mi Bienestar')).toBeTruthy();
    expect(getByText('Semana de Prueba')).toBeTruthy();
    expect(getByText('Ánimo de la semana')).toBeTruthy();
    expect(getByText('De qué hablas más')).toBeTruthy();
    expect(getByText('Familia')).toBeTruthy();
  });
});
