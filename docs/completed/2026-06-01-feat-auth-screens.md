# feat: HU-1 Login and Registration Screens (Mocked)
# Types: feat

## Summary
Implement the mocked Login and Registration screens for User Story 1 (HU-1). Ensure separation of concerns by following Clean Architecture and using ViewModels (Hooks) for the presentation logic. State and authentication flows will be entirely mocked.

## Scope
- Setup and configure React Navigation (`@react-navigation/native` and `@react-navigation/native-stack`) to manage screen transitions.
- Create an `AuthNavigator` to host the Login and Registration screens.
- Create `LoginScreen` and `RegisterScreen` in the presentation layer.
- Create `useLoginViewModel` and `useRegisterViewModel` to encapsulate form state (email, 4-digit PIN) and mocked authentication actions.
- Create a reusable `AuthHeader` component for authentication screens.
- Adapt the provided reference web design to the existing design system using native components (`Field`, `Button`, `Text`) with React Native compatible styling.
- Authentication uses a 4-digit PIN instead of a standard password.
- Mock login and registration events using a simulated delay (`setTimeout`).
- *Out of scope*: Real API integration, persistent token storage.

## Files to Create / Modify
| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add dependencies for React Navigation and React Native Screens. |
| `App.js` | Modify | Wrap the app with `NavigationContainer` and include the new `AuthNavigator`. |
| `src/presentation/navigation/AuthNavigator.tsx` | Create | Stack Navigator defining routes for `Login` and `Register` screens. |
| `src/presentation/components/AuthHeader.tsx` | Create | Reusable component for the title and subtitle on Auth screens. |
| `src/presentation/viewModels/auth/useLoginViewModel.ts` | Create | Hook to handle state (`email`, `pin`, `isLoading`) and simulated login. |
| `src/presentation/viewModels/auth/useRegisterViewModel.ts` | Create | Hook to handle registration state (`name`, `email`, `pin`, `isLoading`) and simulated creation. |
| `src/presentation/screens/auth/LoginScreen.tsx` | Create | Login interface using `KeyboardAvoidingView`, `ScrollView`, and existing design system components. |
| `src/presentation/screens/auth/RegisterScreen.tsx` | Create | Registration interface following the same UI pattern as the Login screen. |

## Component & Data Contracts

### ViewModels

```typescript
// useLoginViewModel.ts
export interface LoginViewModel {
  email: string;
  setEmail: (email: string) => void;
  pin: string;
  setPin: (pin: string) => void;
  isLoading: boolean;
  onLogin: () => Promise<void>;
  navigateToRegister: () => void;
}

// useRegisterViewModel.ts
export interface RegisterViewModel {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  pin: string;
  setPin: (pin: string) => void;
  agree: boolean;
  setAgree: (agree: boolean) => void;
  isLoading: boolean;
  onRegister: () => Promise<void>;
  navigateToLogin: () => void;
  goBack: () => void;
}
```

### Components

```typescript
// AuthHeader.tsx
export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}
```

## Business Logic / Change Description
1. **Navigation Setup**:
   - Install `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, and `react-native-safe-area-context`.
   - Configure a native stack in `AuthNavigator.tsx`.
   - Update `App.js` to render the navigation container instead of hardcoding the `SplashScreen`.
2. **ViewModels (`useLoginViewModel`, `useRegisterViewModel`)**: 
   - Control form inputs via `useState`.
   - The `pin` field will only accept up to 4 characters.
   - Implement asynchronous functions to mock authentication (e.g., `await new Promise(r => setTimeout(r, 1500))`).
   - Manage an `isLoading` state passed to UI buttons to disable them and show visual feedback.
3. **Screens (`LoginScreen`, `RegisterScreen`)**:
   - Use `SafeAreaView` or insets to avoid overlapping with system bars.
   - Wrap in `KeyboardAvoidingView` and `ScrollView` to ensure the keyboard does not overlap input `Field` components.
   - UI mappings from the provided pseudocode:
     - The Biometric login button is completely removed.
     - `Button`, `Field`, and `Text` from `src/presentation/components` are prioritized to respect the current local design system integrated with `ThemeProvider`.
     - The "Crea una contraseña" field in the Register design **MUST** be converted to a "Crea un PIN" field (4 digits), ignoring the "Mínimo 6 caracteres" placeholder and enforcing the `numeric` keyboard.
     - The Terms and Privacy "Checkbox" in the Register design will be implemented using a native `Pressable` wrapping an `Icon` component, mimicking the checked/unchecked visual states provided in the web design.
   - Input properties:
     - "Email" `Field`: `keyboardType="email-address"` and `autoCapitalize="none"`.
     - "PIN" `Field`: `keyboardType="numeric"`, `secureTextEntry={true}`, `maxLength={4}`.

## Acceptance Criteria
- [ ] React Navigation is correctly installed and allows transitions between Login and Register screens.
- [ ] Login screen renders properly on both iOS and Android devices, adapting to smaller screens without UI breakage.
- [ ] Registration screen renders consistently with the design.
- [ ] Inputs trigger the correct keyboard layouts (email for email, numeric pad for PIN).
- [ ] The PIN input is obfuscated (`secureTextEntry`) and limited to exactly 4 digits.
- [ ] The Biometric login button is entirely absent from the UI.
- [ ] The keyboard does not overlap input fields due to the use of `KeyboardAvoidingView`.
- [ ] Views reactively reflect ViewModel states (inputs update properly, buttons disable on `isLoading`).

## Open Questions / Risk Alerts
- **React Navigation Setup**: React Navigation often requires additional configuration steps in `app.json` or native code if not running via Expo. Since this project uses Expo (`app.json` is present), installing standard Expo dependencies via `npx expo install` should suffice without requiring manual linking or AppDelegate modifications.
