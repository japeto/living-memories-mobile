# feature: Design System Integration & Splash Screen

## Summary

Integrate the custom design system provided ("Recuerdo Vivo RN") into the mobile app's architecture. The system will be simplified to support a single light mode ("album") as requested. We will copy the foundation (tokens, taxonomy) and core components, adapt them to interoperate cleanly with `react-native-paper`, and finally build and display the Splash Screen as the initial verification.

## Scope

- **In Scope**:
  - Migrate and simplify `tokens.ts` and `ThemeProvider.tsx` to support only the `album` theme.
  - Migrate all custom components (`Button`, `Card`, `Chip`, `Field`, `Icon`, `MemoryCard`, `RecordButton`, `TabBar`, `Text`) to `src/presentation/components/`.
  - Migrate `taxonomy.ts` to `src/domain/constants/` or `src/presentation/theme/`.
  - Install necessary UI dependencies: `react-native-svg` (for the custom Icon component) and `expo-font` (to load Nunito/Lora).
  - Create the `SplashScreen` component matching the provided UI design.
  - Update `App.js` to initialize fonts, provide the theme, and render the `SplashScreen`.
- **Out of Scope**:
  - Full React Navigation setup (to be done in a subsequent task).
  - Dark mode or dynamic theme switching.

## Files to Create / Modify

| File | Action | Description |
| ---- | ------ | ----------- |
| `package.json` | Modify | Add `react-native-svg`, `expo-font`, and `expo-splash-screen`. |
| `src/presentation/theme/tokens.ts` | Create | Simplified tokens with only the `album` palette, `radius`, `spacing`, `type`, `fonts`, `shadow`, and `easing`. |
| `src/presentation/theme/ThemeProvider.tsx` | Create | Context provider for the theme, hardcoded to the single mode. Integrates `react-native-paper`'s `Provider`. |
| `src/presentation/components/*.tsx` | Create | Port all 9 component files from the raw design system folder. |
| `src/presentation/theme/taxonomy.ts` | Create | Topic and Mood definitions with resolved single-theme colors. |
| `src/presentation/screens/SplashScreen.tsx` | Create | New screen component reproducing the provided splash design (circles, logo, subtitle). |
| `App.js` | Modify | Wrap with ThemeProvider, load fonts (`Nunito`, `Lora`), and render `SplashScreen`. |

## Business Logic / Change Description

1. **Tokens & Theme Provider**:
   We will extract the `album` palette from the raw `tokens.ts`. The `ThemeProvider` will be a simple context provider that also wraps its children in `PaperProvider` from `react-native-paper`, mapping our primary/secondary colors to MD3 tokens so Paper components (if used later) look natively integrated.

2. **Components**:
   The custom components provided by the designer (Claude) capture the exact "wow" aesthetic (soft shadows, pill buttons, rounded typography, specific Lucide-like SVG paths). We will use them directly rather than overriding Paper for these specific elements, respecting the "Use Material Design 3 components" rule *only* as a fallback for missing complex components (like Dialogs, Menus).

3. **Splash Screen Construction**:
   The splash screen will use the `album` theme:
   - `backgroundColor`: `theme.colors.bg` (#f4ece0)
   - Concentric circles using absolute positioning to preserve distinct opacity layers (`ringOuter`, `ringMiddle`, `ringInner`, `core`).
   - Title using `Lora_500` and `Lora_500_Italic`.
   - Subtitle using `variant="body"` and `tone="soft"`.

## Acceptance Criteria

- [x] `react-native-svg` and `expo-font` are installed.
- [x] Single-mode `ThemeProvider` wraps the app.
- [x] All custom components are successfully imported without TypeScript errors.
- [x] `SplashScreen` renders perfectly, matching the provided screenshot aesthetics.
- [x] Custom fonts (Nunito, Lora) load successfully before rendering the UI.
