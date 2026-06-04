import React from 'react';
import { render } from '@testing-library/react-native';
import { WellnessScreen } from '../WellnessScreen';
import { ThemeProvider } from '../../../theme/ThemeProvider';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('../../../viewModels/wellness/useWellnessViewModel', () => ({
  useWellnessViewModel: () => ({
    data: {
      week: 'Del 12 al 18 de Octubre',
      moods: [
        { day: 'L', level: 0.8, label: 'Alegría' },
      ],
      topics: [
        { name: 'Familia', percentage: 45 },
      ]
    }
  })
}));

describe('WellnessScreen', () => {
  it('should render the wellness screen with mocked data correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <WellnessScreen />
      </ThemeProvider>
    );

    expect(getByText('Mi Bienestar')).toBeTruthy();
    expect(getByText('ESTA SEMANA')).toBeTruthy();
    expect(getByText('Del 12 al 18 de Octubre')).toBeTruthy();
    expect(getByText('Ánimo de la semana')).toBeTruthy();
    expect(getByText('De qué hablas más')).toBeTruthy();
  });
});
