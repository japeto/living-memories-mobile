# [feat]: Connect AuthNavigator and MainNavigator with mocked auth state

## Summary
Establish the main navigation flow by introducing an authentication state, connecting the application from `Splash` to `Login/Register`, and finally to `Home`. We will use a mocked authentication Context to trigger the transition.

## Scope
- **In scope**: Creating an `AuthContext` to hold the mocked authentication state, creating a `RootNavigator` to switch between authenticated and unauthenticated flows, modifying `AuthNavigator` to include the `SplashScreen`, and updating view models to trigger the state change on button press.
- **Out of scope**: Actual API connection, persistent storage (SecureStore/AsyncStorage) of the auth token.

## Files to Create / Modify
| File | Action | Description |
|------|--------|-------------|
| `src/presentation/providers/AuthProvider.tsx` | Create | Simple React Context providing `isAuthenticated`, `login()`, and `logout()` functions. |
| `src/presentation/navigation/RootNavigator.tsx` | Create | Wrapper navigator that conditionally renders `MainNavigator` (if authenticated) or `AuthNavigator` (if unauthenticated). |
| `src/presentation/navigation/AuthNavigator.tsx` | Modify | Add `Splash` as `initialRouteName`. Render `SplashScreen` and pass `onDone={() => navigation.replace('Login')}`. |
| `App.js` | Modify | Remove the manual `showSplash` state. Wrap the app with `<AuthProvider>` and render `<RootNavigator>`. |
| `src/presentation/viewModels/auth/useLoginViewModel.ts` | Modify | Consume `AuthContext` and call `login()` upon successful mock validation instead of doing nothing. |
| `src/presentation/viewModels/auth/useRegisterViewModel.ts` | Modify | Consume `AuthContext` and call `login()` upon successful mock registration instead of doing nothing. |

## Component & Data Contracts

**AuthContext**
```typescript
export interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}
```

## Business Logic / Change Description
1. **State Management**: Introduce `AuthProvider` which maintains the `isAuthenticated` boolean state.
2. **Root Routing**: `RootNavigator` will observe `isAuthenticated`. If false, it renders `AuthNavigator`. If true, it renders `MainNavigator`. This perfectly aligns with React Navigation best practices for authentication flows.
3. **Splash Flow**: `AuthNavigator` will start at the `Splash` screen. After its 2.6s animation completes, it triggers `onDone`, replacing the screen with `Login`. (Using `.replace` prevents the user from going back to the splash screen).
4. **Mock Login/Register**: `useLoginViewModel` and `useRegisterViewModel` will use `useContext(AuthContext)`. When the user successfully validates their data and passes the mock loading delay, they call `login()`, setting `isAuthenticated = true`.
5. **Auto-Navigation**: Setting the auth state to true automatically unmounts `AuthNavigator` and mounts `MainNavigator`, landing the user in the Home screen.

## Acceptance Criteria
- [ ] App starts with native splash screen, then transitions to JS `SplashScreen`.
- [ ] JS `SplashScreen` finishes animation and automatically replaces itself with the `Login` screen.
- [ ] User can freely navigate between Login and Register screens.
- [ ] Submitting valid mock forms in either Login or Register changes the auth state and correctly mounts `Home`.
- [ ] The app structure cleanly separates authenticated and unauthenticated navigation boundaries.

## Open Questions / Risk Alerts
- Currently the authentication is purely in-memory. In a subsequent task, we will need to connect this to an actual API and persist the JWT token so the user stays logged in across sessions.
