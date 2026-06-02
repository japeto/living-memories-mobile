import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AuthHeader } from '../AuthHeader';

jest.mock('../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: { ink: '#000' },
    radius: { full: 999 },
  }),
}));

jest.mock('../Text', () => ({
  Text: ({ children }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText>{children}</RNText>;
  },
}));

jest.mock('../Icon', () => ({
  Icon: () => {
    const { View } = require('react-native');
    return <View testID="icon" />;
  },
}));

describe('AuthHeader', () => {
  it('should render the title correctly', () => {
    const { getByText } = render(<AuthHeader title="Test Title" />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should render the subtitle if provided', () => {
    const { getByText } = render(
      <AuthHeader title="Test Title" subtitle="Test Subtitle" />
    );
    expect(getByText('Test Subtitle')).toBeTruthy();
  });

  it('should call onBack when the back button is pressed', () => {
    const onBackMock = jest.fn();
    // In React Native Testing Library, we can find the pressable by its parent or just finding the touchable.
    // The Pressable wraps the Icon. We'll add a testID to the mocked AuthHeader or just query by type.
    const { getByTestId } = render(
      <AuthHeader title="Test Title" onBack={onBackMock} />
    );
    const icon = getByTestId('icon');
    
    fireEvent.press(icon);
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });
});
