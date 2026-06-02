# fix: Auth Screens UI and Styling Adjustments

## Summary
Fix aesthetic and styling issues in the authentication flow screens (`LoginScreen`, `RegisterScreen`, `AuthHeader`, and `Button`), including incorrect background colors, invalid text variants, missing graphics, and improper button text color mapping.

## Scope
- `LoginScreen.tsx` and `RegisterScreen.tsx`: Fix the background color token.
- `AuthHeader.tsx`: Correct the title text variant and add the simplified concentric circles graphic (logo).
- `Button.tsx`: Update the color mapping to pass literal keys (`tone`) to the `Text` component instead of direct hex values.
- *Out of scope*: Functional changes to the authentication logic or other components outside the described UI issues.

## Files to Create / Modify
| File | Action | Description |
|------|--------|-------------|
| `src/presentation/screens/auth/LoginScreen.tsx` | Modify | Update `backgroundColor` in `KeyboardAvoidingView` to use `t.colors.bg` instead of `t.colors.background`. |
| `src/presentation/screens/auth/RegisterScreen.tsx` | Modify | Update `backgroundColor` in `KeyboardAvoidingView` to use `t.colors.bg` instead of `t.colors.background`. |
| `src/presentation/components/AuthHeader.tsx` | Modify | Change the title's `Text` variant from `heading` to `h1`. Duplicate a simplified version of the concentric circles logo (from `SplashScreen`) at the top of the header. |
| `src/presentation/components/Button.tsx` | Modify | Change color mapping to map variants to `Tone` string literals (`'onPrimary'`, `'ink'`, `'primary'`). Update `<Text>` to use the `tone={...}` prop, and `<Icon>` to compute the hex color from `t.colors[labelTone]`. |

## Component & Data Contracts
No changes to external props or backend API data contracts.

- `Button.tsx` internal changes:
  ```typescript
  const labelTone: Record<Variant, 'onPrimary' | 'ink' | 'primary'> = {
    primary: 'onPrimary',
    ghost: 'ink',
    soft: 'ink',
    text: 'primary',
  };
  ```

## Business Logic / Change Description
1. **Background Color Fix**: `tokens.ts` defines the default background as `bg`. We will replace `t.colors.background` (which breaks the UI) with `t.colors.bg` in the `KeyboardAvoidingView` of both `LoginScreen` and `RegisterScreen`.
2. **AuthHeader Typography**: The `<Text variant="heading">` does not exist in the typography scale defined in `tokens.ts`. We will switch it to the correct `variant="h1"`.
3. **AuthHeader Logo**: We will insert a `View` above the back button/title containing the 4 overlapping circular views (`ringOuter`, `ringMiddle`, `ringInner`, `core`) mapped to the theme colors `accent`, `secondary`, and `primary` (matching `SplashScreen.tsx`). The graphic will be scaled down slightly (e.g., width/height 48px) to fit aesthetically within the header.
4. **Button Text Color**: We will refactor the internal mapping in `Button` from returning raw hex colors from the theme to returning `Tone` literal strings. These string literals will be safely passed to the `<Text tone={...}>` component. Since `<Icon>` expects a direct hex color, we will dynamically extract it using `t.colors[labelTone[variant]]`.

## Acceptance Criteria
- [ ] Both `LoginScreen` and `RegisterScreen` render correctly without background color errors.
- [ ] `AuthHeader` title renders with the correct `h1` typography token.
- [ ] `AuthHeader` displays the concentric circles logo graphic above the title.
- [ ] `Button` text renders in the correct color (white/`onPrimary` for primary buttons, `ink` for soft/ghost buttons).

## Open Questions / Risk Alerts
- **Logo Reusability**: Duplicating the logo logic in `AuthHeader` is the fastest fix, but we should consider extracting it to a `<LogoGraphic size={...} />` component in the future if this graphic appears on more screens.
