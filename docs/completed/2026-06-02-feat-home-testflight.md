# Implementation Plan

## 1. Context and Scope
The goal is to complete two tasks for `living-memories-mobile`:
1. Display the actual user's name on the `HomeScreen` instead of a hardcoded placeholder.
2. Prepare the iOS configuration for a TestFlight v0.1.0 release.

## 2. Analysis & Open Questions
- **API Support**: The backend PR #14 has been merged/created, which ensures `display_name` is returned in the login and refresh payloads. We no longer need the local `SecureStore` workaround.

## 3. Step-by-Step Implementation

### Phase 1: User Name on Home Screen

1. **Update Data Transfer Objects (`src/data/auth/dtos/LoginResponse.ts` or similar)**
   - Ensure the API response interface expects `display_name: string`.

2. **Update Domain Entity (`src/domain/auth/entities/User.ts`)**
   - Add an optional `displayName?: string` property to the `User` interface.

3. **Update Auth Repository (`src/data/auth/repositories/AuthRepository.ts`)**
   - Ensure the `login` and `restoreSession` methods properly map the `display_name` from the API payload into the domain `User` entity, and store it alongside the token if using local caching for the session object.

4. **Update Auth Context (`src/presentation/providers/AuthProvider.tsx`)**
   - Add `userName: string | null` to `AuthContextType`.
   - Update the internal state and map `user.displayName` to `userName` upon successful login/restore.

5. **Update Home Screen (`src/presentation/screens/home/HomeScreen.tsx`)**
   - Import `useAuth` hook from the auth provider.
   - Extract `userName` from `useAuth()`.
   - Replace the hardcoded string `"Rosa"` with `{userName || 'Usuario'}`.

### Phase 2: TestFlight v0.1.0 Preparation

1. **Create EAS Configuration (`eas.json` at repo root)**
   - Create the file with a production profile configured for iOS App Store distribution.
   - Enable `autoIncrement: true` for automated build numbers.

2. **Update Expo Configuration (`app.json`)**
   - Ensure `version` remains `"0.1.0"`.
   - Under the `ios` node, add `"buildNumber": "1"`.
   - Under the `ios.infoPlist` node, add `"NSMicrophoneUsageDescription": "Recuerdo Vivo necesita acceso al micrófono para grabar tus memorias."` to preemptively comply with Apple's requirements for microphone usage.
