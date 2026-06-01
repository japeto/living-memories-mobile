import React from 'react';
import { render } from '@testing-library/react-native';
import { SplashScreen } from '../../src/presentation/screens/SplashScreen';
import { ThemeProvider } from '../../src/presentation/theme/ThemeProvider';

describe('SplashScreen', () => {
  it('renders correctly and matches the expected layout', () => {
    const { getByText } = render(
      <ThemeProvider>
        <SplashScreen />
      </ThemeProvider>
    );

    // Verify title is rendered
    expect(getByText('Mi Recuerdo')).toBeTruthy();
    expect(getByText('Vivo')).toBeTruthy();

    // Verify footer is rendered
    expect(getByText('Tu voz, guardada con cariño')).toBeTruthy();
  });
});
