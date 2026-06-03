import 'reflect-metadata';

jest.mock('@react-native-voice/voice', () => ({
  start: jest.fn().mockResolvedValue(true),
  stop: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
  removeAllListeners: jest.fn(),
}));
