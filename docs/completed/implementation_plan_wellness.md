# Implementation Plan: "Bienestar" Screen (Mocked)

## 1. Context and Goals
Implement the new "Mi Bienestar" (Wellness) screen for the mobile application by porting the provided React web mockup to React Native. 
The screen will use **only mocked data** for now and must adhere to the project's *Clean Architecture* and Design System (using `Text`, `Card`, `Icon`, and mappings from `taxonomy.ts`).

## 2. Affected Files

*   **`src/presentation/viewModels/wellness/useWellnessViewModel.ts`** (New)
*   **`src/presentation/components/wellness/MoodChart.tsx`** (New)
*   **`src/presentation/components/wellness/TopicDistribution.tsx`** (New)
*   **`src/presentation/screens/wellness/WellnessScreen.tsx`** (New)
*   **`src/presentation/navigation/MainNavigator.tsx`** (Modify)

## 3. Implementation Details

### 3.1. ViewModel (`useWellnessViewModel.ts`)
*   Create a custom hook to encapsulate the state and data layer logic.
*   Initially, it will return the requested mocked data: `week`, `h` (mood values), and `dist` (topic distribution).
*   This establishes the architectural boundary for when we integrate with the Domain Use Cases and Data Repositories later.

### 3.2. Modular Components
*   **`MoodChart.tsx`**: A reusable component extracting the bar charts for the "Ánimo de la semana" section.
*   **`TopicDistribution.tsx`**: A reusable component extracting the progress bars for the "De qué hablas más" section.

### 3.3. UI Screen (`WellnessScreen.tsx`)
*   **Main Container:** Use `ScrollView` to replace the `div` with the `scroll` class.
*   **Typography:** Replace HTML tags with the existing `<Text>` component. E.g., `<h1 className="t-h1">` → `<Text variant="h1">`, and `<p className="t-body muted">` → `<Text variant="body" tone="soft">`.
*   **Cards:** Use the existing `<Card>` component.
*   **Theme & Colors:** 
    *   Import `useTheme` to retrieve spacing and palette tokens.
    *   Use `resolveMood` and `resolveTopic` from `src/presentation/theme/taxonomy.ts` to map colors dynamically based on the active theme.
    *   The "ESTA SEMANA" card will use a solid background color (`secondarySoft`) instead of a linear gradient for this iteration.
*   **Charts (Bars & Progress):** Include the modular `MoodChart` and `TopicDistribution` components.

### 3.4. Navigation (`MainNavigator.tsx`)
*   Import `WellnessScreen` and add it to the existing `BottomNavigation` from `react-native-paper` without modifying the current existing tabs architecture.
*   Add the route to the navigation state with the key `wellness`, title "Bienestar", and a relevant icon (e.g., `heart` or `leaf`).

---

## 4. Design Decisions (/grill-me resolution)
The following architectural decisions have been confirmed by the user:
1.  **Mocks & ViewModel:** Mocked data will be exposed via the custom hook `useWellnessViewModel`.
2.  **UI Modularity:** Charts will be built as reusable components (`MoodChart` and `TopicDistribution`).
3.  **Linear Gradient:** We will use a solid color for this iteration instead of adding new dependencies.
4.  **Bottom Navigation:** We will keep the current `BottomNavigation` from `react-native-paper` and simply append the new tab.

## Acceptance Criteria
- [ ] `WellnessScreen` renders correctly with mocked data without throwing errors.
- [ ] Tab navigation works, and the "Bienestar" tab directs to the new screen.
- [ ] `npx jest --passWithNoTests` passes.
- [ ] Components adhere to the Design System tokens and typography.

> [!IMPORTANT]
> User Review Required: Please review the updated plan with your decisions incorporated. If everything looks good, approve the plan so we can proceed with the implementation.
