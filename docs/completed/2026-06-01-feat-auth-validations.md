# feat: Auth Form Validations

## Summary
Add native validation rules for the Login and Register forms without using third-party libraries. This includes modifying the `Field` component to display validation errors and updating the ViewModels to handle state and validation logic on submit and on blur.

## Scope
- **In scope:**
  - Adding an `error` color token to the app's `Palette`.
  - Enhancing `Field` component with an `error` prop (red border, helper text).
  - Native regex/logic validations in `useLoginViewModel` and `useRegisterViewModel`.
  - Validation rules: Email (strict regex), PIN (4 digits, block weak sequences), Name (min 2 chars, no numbers).
  - Triggering validations on form submit and on field blur.
- **Out of scope:**
  - Refactoring existing auth logic or navigation flow.
  - Adding third-party validation libraries (e.g., `zod`, `yup`, `react-hook-form`).

## Files to Create / Modify
| File | Action | Description |
|------|--------|-------------|
| `src/presentation/theme/tokens.ts` | Modify | Add `error` to `Palette` interface and define a value (e.g., `#B3261E`) for `album`, `sereno`, and `atardecer` themes. |
| `src/presentation/components/Field.tsx` | Modify | Add `error?: string` to `FieldProps`. If `error` is present, use `t.colors.error` for the border. Render `<Text>` below the input with the error message. |
| `src/presentation/viewModels/auth/useLoginViewModel.ts` | Modify | Add `emailError`, `pinError` state. Add `validateEmail`, `validatePin` functions. Call them in `onLogin` and expose them for `onBlur`. |
| `src/presentation/screens/auth/LoginScreen.tsx` | Modify | Pass `error={vm.emailError}` and `onBlur={vm.validateEmail}` to the email Field. Repeat for the PIN field. |
| `src/presentation/viewModels/auth/useRegisterViewModel.ts` | Modify | Add `nameError`, `emailError`, `pinError` state. Add `validateName`, `validateEmail`, `validatePin` functions. Call them in `onRegister` and expose them for `onBlur`. |
| `src/presentation/screens/auth/RegisterScreen.tsx` | Modify | Pass `error` and `onBlur` handlers to Name, Email, and PIN `Field` components. |

## Component & Data Contracts

### 1. `FieldProps` (src/presentation/components/Field.tsx)
```typescript
export interface FieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  icon?: IconName;
  secureTextEntry?: boolean;
  error?: string; // NEW
}
```

### 2. `LoginViewModel` (src/presentation/viewModels/auth/useLoginViewModel.ts)
```typescript
export interface LoginViewModel {
  // ... existing props
  emailError: string;
  pinError: string;
  validateEmail: () => boolean;
  validatePin: () => boolean;
}
```

### 3. `RegisterViewModel` (src/presentation/viewModels/auth/useRegisterViewModel.ts)
```typescript
export interface RegisterViewModel {
  // ... existing props
  nameError: string;
  emailError: string;
  pinError: string;
  validateName: () => boolean;
  validateEmail: () => boolean;
  validatePin: () => boolean;
}
```

## Business Logic / Change Description

1. **Theme Update**:
   - In `tokens.ts`, add `error: string` to `Palette`. Set it to a standard red color (like `#B3261E` or slightly tweaked per theme to match tone).

2. **Field Component Updates**:
   - Update `borderColor` logic: if `error` exists, border is `t.colors.error`. Otherwise, fallback to focus/default logic.
   - If `error` is passed, render a `<Text variant="small">` directly under the input wrapper, colored `t.colors.error`.

3. **Validation Logic**:
   - **Email Regex**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - **Name Regex**: `/^[^0-9]{2,}$/` (Minimum 2 characters, rejecting any digits).
   - **PIN Logic**: Must be exactly 4 characters. Compare against a blocklist of weak PINs: `["0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999", "1234", "4321", "1212"]`.
   - **Validation Functions**:
     - `validateX`: reads the current state, updates the `xError` state with a friendly Spanish error message if invalid, or clears it if valid. Returns a `boolean`.
   - **On Submit**:
     - Call all validation functions (`const isEmailValid = validateEmail(); ...`).
     - Only proceed if all are valid.

4. **Screen Integration**:
   - In `LoginScreen` and `RegisterScreen`, map the ViewModel's errors to the `Field`'s `error` prop.
   - Bind `onBlur={() => vm.validateX()}` so users get immediate feedback when leaving the field.
   - (Optional but recommended) In `onChangeText` / `setX`, if an error is already present, clear it so it doesn't linger while the user fixes it.

## Acceptance Criteria
- [ ] Theme palette correctly includes an `error` token.
- [ ] `Field` component displays a red border and helper text when the `error` prop is provided.
- [ ] Leaving an empty required field triggers a validation error message on blur.
- [ ] Submitting the form with invalid data blocks the action and shows all applicable errors.
- [ ] "1234", "1111", and "1212" are rejected as PINs.
- [ ] Names con números (e.g., "Juan123") or less than 2 chars are rejected.
- [ ] Invalid email strings (e.g., "test@.com") are rejected.

## Open Questions / Risk Alerts

> [!TIP]
> **Form Clearing:** To prevent the red error border from lingering while the user fixes their mistake, we will clear the error state inside `onChangeText` (`setXError('')`). The field will re-validate upon `onBlur` or when attempting to submit again.
