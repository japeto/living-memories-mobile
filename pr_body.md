## Description
This PR pivots the application from using `expo-audio` to a native S2T approach (Speech-to-Text) to enable a true live "dictation" experience for the user. It removes the previous audio file recording logic, implements `@react-native-voice/voice` for live transcription, and updates the `useRecordingViewModel` and `memoriesApiClient` to send the real-time transcribed text payload directly to the API, bypassing audio file handling.

## Related Issue(s)
N/A

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [x] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Chore / Maintenance

## Checklist
- [x] My code follows the React Native / Expo context and architecture guidelines of this project.
- [x] I have performed a self-review of my own code.
- [x] I have added tests that prove my fix is effective or that my feature works.
- [x] New and existing unit tests pass locally with my changes (`npx jest` passes).
- [x] Linting and formatting checks pass.
- [x] The app boots successfully in Expo (`npx expo start`).
