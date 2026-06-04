import React from 'react';
import { render } from '@testing-library/react-native';
import { TopicDistribution } from '../TopicDistribution';
import { ThemeProvider } from '../../../theme/ThemeProvider';

describe('TopicDistribution', () => {
  const mockData = [
    { name: 'Familia', percentage: 45 },
    { name: 'Salud', percentage: 25 }
  ];

  it('should render topic names and percentages correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TopicDistribution data={mockData} />
      </ThemeProvider>
    );

    expect(getByText('Familia')).toBeTruthy();
    expect(getByText('45%')).toBeTruthy();
    expect(getByText('Salud')).toBeTruthy();
    expect(getByText('25%')).toBeTruthy();
  });
});
