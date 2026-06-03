## Description

This PR introduces the processing state for memories and implements a polling mechanism to reflect asynchronous AI evaluation from the backend. 

Key changes include:
- **Memory Model Update:** Added `status` (`processing` | `completed` | `failed`) and `title` to the `Memory` domain entity and `MemoryResponse` DTO. Handled the mapping for `reminder_text`.
- **UI Enhancements (`MemoryCard`):** Displays a specific "Analizando con IA..." (Analyzing with AI) loading indicator when the memory status is `processing`. Tags and reminders are hidden during this state. 
- **Background Polling (`useHomeViewModel`):** Implemented a 3-second polling mechanism that activates automatically when there are memories currently in the `processing` state.
- **Silent Loading:** Updated `fetchMemories` to support a silent background fetch (`showLoader` flag) to prevent full-screen loading indicators from interrupting the user experience during polling.

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
