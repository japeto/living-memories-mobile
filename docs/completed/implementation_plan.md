# Implementation Plan: User Profile API Integration

## 1. Summary
The goal is to remove the mocked user profile data (email, creation date, preferred name) from the global authentication state and fetch the real user profile data directly from the backend API (`/api/v1/auth/me`). We will implement this following Clean Architecture principles by creating a dedicated Profile feature layer.

## 2. Scope
- Clean up the `AuthProvider` state to stop injecting mocked values upon session restore and login.
- Create a `UserProfile` entity and its corresponding repository contract in the domain layer.
- Implement `ProfileRepository` in the data layer to fetch the profile from the `/api/v1/auth/me` endpoint.
- Create a `GetProfileUseCase` for the presentation layer to consume.
- Register the new repository and use case in the Dependency Injection container.
- Update `useProfileViewModel` to use the new use case and expose `profile`, `isLoading`, and `error` states.
- Update `ProfileScreen` to use the dynamically fetched data instead of relying on the globally mocked data. Elements depending on data not currently provided by the backend (like `createdAt` and `isEmailVerified`) should gracefully handle `undefined` values.
- Update any related test mocks for the `ProfileScreen` and `useProfileViewModel` to account for the new data loading states.

## 3. Files to Create or Modify

### Create
- `src/domain/profile/entities/UserProfile.ts`
  - Define `UserProfile` interface with `userId`, `email`, `displayName` (and optional placeholders for future fields).
- `src/domain/profile/repositories/IProfileRepository.ts`
  - Define contract `getProfile(): Promise<UserProfile>`.
- `src/domain/profile/useCases/GetProfileUseCase.ts`
  - Standard use case invoking `repository.getProfile()`.
- `src/data/profile/repositories/ProfileRepository.ts`
  - Implementation using `apiClient.get<UserProfileDTO>('/api/v1/auth/me')`.

### Modify
- `src/di/container.ts`
  - Register `IProfileRepository` and `GetProfileUseCase` as singletons.
- `src/presentation/providers/AuthProvider.tsx`
  - **Remove** the mock data injection (e.g., hardcoded `email`, `createdAt`, `preferredName`, `isEmailVerified`) in the `restoreSession` promise resolution and the `login` function.
- `src/presentation/viewModels/profile/useProfileViewModel.ts`
  - Add `useEffect` to fetch profile data via `GetProfileUseCase` on mount.
  - Expose `profile`, `isLoading`, and `error` along with existing functions.
- `src/presentation/screens/profile/ProfileScreen.tsx`
  - Read display name and email from the `profile` object (falling back to `user.displayName` if profile is loading or using loading text/placeholders).
  - Conditionally render "Member since" and "Verified" chips only if the data exists.
- `src/presentation/__tests__/screens/profile/ProfileScreen.test.tsx` (and any view model tests)
  - Update mocks to provide `profile`, `isLoading: false`, etc.

## 4. Component Contracts
- `IProfileRepository`:
  - `getProfile(): Promise<UserProfile>`
- `GetProfileUseCase`:
  - `execute(): Promise<UserProfile>`
- `useProfileViewModel`:
  - Hook Return Signature: `{ user, profile, isLoading, error, preferredNameInput, setPreferredNameInput, handleLogout }`

## 5. Business Logic & Error Handling
- **Loading State:** While the profile is being fetched, `ProfileScreen` should ideally display a subtle loading state (e.g., "Cargando correo..." or skeleton loaders) instead of throwing an error.
- **Error Handling:** If `apiClient` rejects the call (e.g., network error), `useProfileViewModel` should set `error` state. The UI could display a toast or a placeholder string. It must not crash.
- **Null Safety:** Missing `createdAt` or `isEmailVerified` (which are omitted by the current backend DTO) should silently hide their respective UI elements (Chips) in `ProfileScreen` instead of showing "undefined".

## 6. API Integration
- **Endpoint:** `GET /api/v1/auth/me`
- **Method:** GET
- **Headers:** Inherited from `apiClient` (Authorization: Bearer <token>)
- **Response Mapping:**
  ```json
  {
    "user_id": "string",
    "email": "user@example.com",
    "display_name": "string"
  }
  ```
  Mapped to: `UserProfile { userId, email, displayName }`.

## 7. Acceptance Criteria
- [ ] User logs into the app, navigates to "Perfil", and sees their actual registered email and name fetched from the backend, not "rosa.mendez@correo.com".
- [ ] Profile screen does not crash if `createdAt` or `isEmailVerified` is missing.
- [ ] Mocked data is entirely removed from `AuthProvider`.
- [ ] Architecture complies with the feature-based clean architecture guidelines.
- [ ] Automated tests pass with the new ViewModel structure.
