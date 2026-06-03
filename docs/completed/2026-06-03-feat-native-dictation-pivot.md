# Audio Recording & Native S2T (Mi Recuerdo Vivo)

**Status:** 🟡 Request Review

## Findings & Investigation

1. **Why `expo-audio` failed:** The code in `useRecordingViewModel.ts` was calling `setAudioModeAsync({ allowsRecordingIOS: true })`. `allowsRecordingIOS` is a legacy property from `expo-av`. The new `expo-audio` (SDK 52+) expects `allowsRecording: true`. Because the property was invalid, the iOS audio session was never set to record mode, resulting in `RecordingDisabledException: Recording not allowed on iOS`.
2. **User Expectation ("Dictado"):** The user expects a live dictation experience where text appears as they speak (like the iOS Messages app). `expo-audio` only records an audio file; it cannot do live transcription by itself. To achieve a true "dictado" experience, we need to pivot to a package that hooks directly into iOS `SFSpeechRecognizer` / Android `SpeechRecognizer`.

## Proposed Architectural Pivot: Live Dictation

We propose pivoting entirely to a native Speech-to-Text package (e.g., `@react-native-voice/voice` or `expo-speech-recognition`) for on-device live transcription. 

**Architectural Shifts:**
- **No Audio File:** We will drop `expo-audio` and the requirement to save a physical `.m4a` file. The app will only capture the transcribed text.
- **Backend Simplification:** Since we only send text, we eliminate the need to upload heavy audio files to Supabase Storage, completely bypassing the Render Free Tier timeout limits!
- **Live Feedback:** The UI will show the text as the user speaks.

> [!IMPORTANT]
> **Custom Dev Client Required**: Using native S2T requires native modules that are **not included in Expo Go**. We must install this plugin and compile a Custom Dev Client (`expo run:android` / `expo run:ios`).

## Implementation Steps

---

### Mobile App (`living-memories-mobile`)

#### [MODIFY] `package.json`
- Remove `expo-audio` and `whisper.rn` if they are no longer needed.
- Install `@react-native-voice/voice` (and add its config plugin in `app.json` for microphone and speech recognition permissions).

#### [MODIFY] `app.json`
- Add `@react-native-voice/voice` to the plugins array.
- Configure iOS `NSSpeechRecognitionUsageDescription` and `NSMicrophoneUsageDescription`.

#### [MODIFY] `src/data/network/memoriesApiClient.ts`
- Change `uploadMemory` to send a JSON payload with `transcribedText` (no `multipart/form-data` needed since there is no audio file).

#### [MODIFY] `src/domain/memories/useCases/RecordMemoryUseCase.ts`
- Update the signature to accept only the transcribed text string instead of `(uri, transcribedText)`.

#### [MODIFY] `src/presentation/viewModels/home/useRecordingViewModel.ts`
- Replace `expo-audio` with `@react-native-voice/voice`.
- Implement `Voice.onSpeechResults` and `Voice.onSpeechPartialResults` to get live dictation updates.
- Export a new `liveText` state to the UI.

#### [MODIFY] `src/presentation/components/home/RecordButton.tsx` (or new UI)
- Connect to the new ViewModel.
- Display the `liveText` on the screen so the user can see what they are dictating in real-time.

---

### Backend API (`living-memories-api`)

#### [MODIFY] `app/features/memories/schemas.py`
- Pydantic models for the memory creation request to accept `transcribed_text` as a JSON body.

#### [MODIFY] `app/features/memories/router.py`
- Change `POST /api/v1/memories/upload` to receive JSON instead of `UploadFile` + `Form`.

#### [MODIFY] `app/features/memories/service.py`
- **1. Storage**: Remove Supabase Storage upload logic.
- **2. Processing**: Extract tags and a title from the `transcribed_text`.
- **3. Database**: Save the entity in Supabase DB without an `audio_url`.

#### [MODIFY] `app/features/memories/repository.py`
- Remove `audio_url` from the database insertion logic.

## Verification Plan

### Automated Tests
- **Mobile**: Update unit tests (Jest) for the ViewModel, mocking `Voice` events (`onSpeechResults`).
- **API**: Update unit tests to test the JSON endpoint.

### Manual Verification
- **Physical Device**: Run the app on a physical device using `npx expo run:ios --device`.
- Tap "Dictate", speak a phrase, and verify the text appears live on the screen.
- Stop dictation and verify the text is successfully saved to the backend database.
