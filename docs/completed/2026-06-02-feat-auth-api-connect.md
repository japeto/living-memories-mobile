# [feat]: Connect mobile app to the real API (Auth — Register & Login)

## Summary
Replace the mocked authentication logic with real HTTP calls to `living-memories-api`. This establishes the full data layer for the auth domain in the mobile app: HTTP client configuration, domain repository + use cases, persistent session via `expo-secure-store`, and graceful error handling.

## Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Environment | Local (`http://localhost:8000`) | iOS Simulator can reach localhost directly |
| Scope | Register + Login | Both endpoints exist in the API (`/api/v1/auth/register`, `/api/v1/auth/login`) |
| HTTP Client | Axios | Interceptors, cancellation, common in RN ecosystem |
| Session Storage | `expo-secure-store` | Encrypted keychain storage for the `user_id` |
| Auto-login | Yes | If `user_id` exists in SecureStore, skip auth screens |
| Error handling | Inline screen messages | 409 → "Email ya registrado", 503 → "Servicio no disponible" |
| Token | None yet | API returns `authenticated: true` + `user_id` only. JWT in a future task. |

---

## Files to Create / Modify

### 1. Infrastructure — HTTP Client

#### [NEW] `src/data/network/apiClient.ts`
Axios instance configured with `baseURL` from Expo config and a 10-second timeout. A response interceptor normalizes API errors into typed `ApiError` objects.

#### [NEW] `app.config.js` (or update `app.json`)
Define `extra.apiBaseUrl` so the base URL is injected via Expo's config system and can be changed per environment without touching source code.

---

### 2. Domain — Auth Module

#### [NEW] `src/domain/auth/entities/User.ts`
```typescript
export interface User {
  userId: string;
}
```

#### [NEW] `src/domain/auth/repositories/IAuthRepository.ts`
```typescript
export interface IAuthRepository {
  register(name: string, email: string, pin: string): Promise<User>;
  login(userId: string, pin: string): Promise<User>;
  getStoredSession(): Promise<User | null>;
  saveSession(user: User): Promise<void>;
  clearSession(): Promise<void>;
}
```

#### [NEW] `src/domain/auth/useCases/RegisterUseCase.ts`
Orchestrates: validate + call `repository.register()` + call `repository.saveSession()`.

#### [NEW] `src/domain/auth/useCases/LoginUseCase.ts`
Orchestrates: call `repository.login()` + call `repository.saveSession()`.

#### [NEW] `src/domain/auth/useCases/RestoreSessionUseCase.ts`
Calls `repository.getStoredSession()` to check if a previous session exists on app start.

---

### 3. Data — Auth Repository Implementation

#### [NEW] `src/data/auth/repositories/AuthRepository.ts`
Concrete implementation of `IAuthRepository` inside the `auth` data module:
- `register()` → `POST /api/v1/auth/register` via Axios, maps to `User`
- `login()` → `POST /api/v1/auth/login` via Axios. **Note:** API currently expects `user_id` + PIN; backend will be updated to accept `email` + PIN. Until then, the Login flow will store the `user_id` returned by Register in SecureStore and forward it transparently.
- `getStoredSession()` / `saveSession()` / `clearSession()` → `expo-secure-store`
- `getStoredEmail()` / `saveEmail()` → `expo-secure-store` (so Login screen can pre-fill and reuse the email)

Catches Axios errors and maps HTTP status codes to user-friendly messages:
- `409` → `"El correo ya está registrado"`
- `503` → `"Servicio no disponible, intenta más tarde"`
- Network error → `"Sin conexión a internet"`

---

### 4. Dependency Injection

#### [MODIFY] `src/di/container.ts`
Register `IAuthRepository` → `AuthRepository` (from `src/data/auth/repositories/`). Register the three new use cases.

---

### 5. Presentation — Providers and ViewModels

#### [MODIFY] `src/presentation/providers/AuthProvider.tsx`
On mount, call `RestoreSessionUseCase`. While checking, show a loading state (the Splash screen can hold here). If a session exists, set `isAuthenticated = true` directly, bypassing the auth screens. Expose `userId` in the context for future use by other screens.

#### [MODIFY] `src/presentation/viewModels/auth/useRegisterViewModel.ts`
Replace the mock `setTimeout` + `login()` call with:
1. Call `RegisterUseCase` with `(name, email, pin)`
2. On success → `login()` (the `AuthProvider` saves the session, the `RootNavigator` reacts)
3. On error → set a `serverError` string state shown on screen

#### [MODIFY] `src/presentation/viewModels/auth/useLoginViewModel.ts`
Replace mock with `LoginUseCase(userId, pin)`. The Login screen shows **email + PIN** fields. After Register, the `user_id` is stored in SecureStore and forwarded transparently to the API's current `user_id`-based endpoint. Once the backend is updated to accept email + PIN, only this ViewModel and `IAuthRepository` need to change — the screen and UX remain identical.

---

### 6. Screens

#### [MODIFY] `src/presentation/screens/auth/RegisterScreen.tsx`
Render a `serverError` text below the register button if the ViewModel exposes one.

#### [MODIFY] `src/presentation/screens/auth/LoginScreen.tsx`
The screen already shows email + PIN fields. Confirm the email field is pre-filled from SecureStore (read-only) so the user only has to type their PIN on subsequent logins.

---

## Installation

```bash
npm install axios expo-secure-store
```

---

## Open Questions

> [!NOTE]
> **Login — email vs user_id strategy**
> The `POST /api/v1/auth/login` API currently expects `user_id` (UUID) + PIN. Since we want the UX to be email + PIN (Option B), the backend will be updated later. In the meantime, `AuthRepository.login()` will retrieve the stored `user_id` from SecureStore and send it to the current endpoint transparently. This is an internal implementation detail — the Login screen always shows email + PIN to the user.

> [!NOTE]
> **`expo-secure-store` availability**
> `expo-secure-store` does not work in Expo Go on iOS. Since you're using the iOS Simulator with a native build (`npx expo run:ios`), this is not a concern.

---

## Acceptance Criteria
- [ ] A new user can Register with name, email, and PIN. The data is sent to the real API.
- [ ] On successful Register, `user_id` is saved to SecureStore and the app navigates to Home.
- [ ] If the email is already registered (HTTP 409), a clear message appears on the Register screen.
- [ ] If the API is unreachable, a clear message appears on screen.
- [ ] A registered user can open the app again and go directly to Home (auto-login from SecureStore).
- [ ] A registered user can Login with their PIN (using the stored `user_id` transparently).
- [ ] Logging out clears SecureStore and returns to the Login screen.
