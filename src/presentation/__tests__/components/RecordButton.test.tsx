import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RecordButton } from '../../components/home/RecordButton';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('RecordButton', () => {
  it('renders correctly in idle phase', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <RecordButton phase="idle" onPress={mockOnToggle} />
    );

    const button = getByTestId('record-button');
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('renders correctly in rec phase', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <RecordButton phase="rec" onPress={mockOnToggle} />
    );

    const button = getByTestId('record-button');
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('renders correctly in proc phase and is disabled', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <RecordButton phase="proc" onPress={mockOnToggle} />
    );

    const button = getByTestId('record-button');
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(mockOnToggle).not.toHaveBeenCalled();
  });
});
