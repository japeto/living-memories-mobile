import React from 'react';
import { render } from '@testing-library/react-native';
import { MoodChart } from '../MoodChart';
import { ThemeProvider } from '../../../theme/ThemeProvider';

describe('MoodChart', () => {
  const mockData = [
    { day: 'L', level: 0.8, label: 'Alegría' },
    { day: 'M', level: 0.5, label: 'Cansancio' }
  ];

  it('should render the correct number of bars based on data', () => {
    const { getByText } = render(
      <ThemeProvider>
        <MoodChart data={mockData} />
      </ThemeProvider>
    );

    expect(getByText('L')).toBeTruthy();
    expect(getByText('M')).toBeTruthy();
  });
});
