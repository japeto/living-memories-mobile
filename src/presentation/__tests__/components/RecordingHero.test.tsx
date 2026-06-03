import React from 'react';
import { render } from '@testing-library/react-native';
import { RecordingHero } from '../../components/home/RecordingHero';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('RecordingHero', () => {
  it('renders RecordButton and greeting when idle', () => {
    const { getByText, queryByText } = render(
      <RecordingHero phase="idle" seconds={0} onToggle={jest.fn()} />
    );

    expect(getByText('Toca para grabar un recuerdo')).toBeTruthy();
    expect(queryByText('Organizando tu recuerdo...')).toBeNull();
  });

  it('renders processing state when phase is proc', () => {
    const { getByText } = render(
      <RecordingHero phase="proc" seconds={0} onToggle={jest.fn()} />
    );

    expect(getByText('Organizando tu recuerdo...')).toBeTruthy();
  });
});
