module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|axios)'
  ],
  moduleNameMapper: {
    '^expo-constants$': '<rootDir>/__mocks__/expo-constants.js',
    '^expo-secure-store$': '<rootDir>/__mocks__/expo-secure-store.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

