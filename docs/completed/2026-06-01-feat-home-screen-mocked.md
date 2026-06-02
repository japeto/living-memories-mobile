# feat: Home Screen (Mocked)

## Summary
Implement the main Home screen with an interactive recording interface ("Hero") and a list of today's memories. The logic and data will be fully mocked adhering to Clean Architecture, without connecting to the real backend yet.

## Scope
**In Scope:**
- Domain entities and contracts for `Memory`.
- Data layer with a mocked repository (`MockMemoryRepository`) that includes the seed data (`SEED`).
- Creation of a `MainNavigator` with Bottom Tabs (showing the "Inicio" tab and an inactive tab to fulfill requirements).
- Integration of `MainNavigator` in `App.js` to visualize the screen.
- Construction of detailed UI components (`HomeScreen`, `RecordingHero`, `RecordButton`, `MemoryCard`) using React Native Paper and visual design tokens (with attention to pixel-perfect details requested).
- ViewModel (`useHomeViewModel`) to manage recording phases (idle, rec, proc), timer (seconds), and processing animation (`layerStep`).

**Out of Scope:**
- Real integration with `living-memories-api` (REST API).
- Real native audio recording and processing logic.
- Navigation to other screens from inactive tabs.

## Files to Create / Modify
| File | Action | Description |
|------|--------|-------------|
| `src/domain/entities/Memory.ts` | Create | `Memory` interface with fields `id`, `time`, `day`, `text`, `topic`, `mood`, `reminder`. |
| `src/domain/repositories/IMemoryRepository.ts` | Create | Interface with `getTodayMemories(): Promise<Memory[]>` and `processNewMemory(): Promise<Memory>`. |
| `src/domain/useCases/home/GetTodayMemoriesUseCase.ts` | Create | Use case that invokes the repository to fetch memories. |
| `src/data/repositories/MockMemoryRepository.ts` | Create | Repository implementation injecting `SEED` and `NEW_QUEUE` data. |
| `src/di/container.ts` | Modify | Register `IMemoryRepository` to `MockMemoryRepository` using TSyringe. |
| `src/presentation/navigation/MainNavigator.tsx` | Create | `BottomTabNavigator` hosting `HomeScreen` ("Inicio"). |
| `App.js` | Modify | Temporarily replace `AuthNavigator` with `MainNavigator` or add it as the main app route to view the Home screen. |
| `src/presentation/screens/home/HomeScreen.tsx` | Create | Home screen with the provided design (Header with date, greeting and avatar; Recording Hero; "Hoy" list). |
| `src/presentation/viewModels/home/useHomeViewModel.ts` | Create | Hook exposing `memories`, `phase` ('idle'|'rec'|'proc'), `seconds`, `layerStep`, and `onToggleRecord()` functions. Consumes domain UseCases. |
| `src/presentation/components/home/RecordingHero.tsx` | Create | Component rendering the record button or the "Organizing your memory" state iterating over `LAYERS`. |
| `src/presentation/components/home/RecordButton.tsx` | Create | Animated floating record button adapted from the web JSX. |
| `src/presentation/components/home/MemoryCard.tsx` | Create | Visual card component to display text, topic, mood, and reminder. |

## Component & Data Contracts

**`src/domain/entities/Memory.ts`**
```typescript
export interface Memory {
  id: number;
  time: string;
  day: string;
  text: string;
  topic: string;
  mood: string;
  reminder?: string;
}
```

**`src/domain/repositories/IMemoryRepository.ts`**
```typescript
export interface IMemoryRepository {
  getTodayMemories(): Promise<Memory[]>;
  processNewMemory(): Promise<Memory>; // Simulates creation by taking from NEW_QUEUE
}
```

**`useHomeViewModel.ts` Signature**
```typescript
interface HomeViewModelState {
  memories: Memory[];
  phase: 'idle' | 'rec' | 'proc';
  seconds: number;
  layerStep: number;
  newId: number | null;
  onToggleRecord: () => void;
  isLoading: boolean;
}
export function useHomeViewModel(): HomeViewModelState;
```

**`RecordingHero` Props**
```typescript
interface RecordingHeroProps {
  phase: 'idle' | 'rec' | 'proc';
  seconds: number;
  onToggle: () => void;
  layerStep: number;
}
```

## Business Logic / Change Description
1. **Domain and Dependency Injection**: 
   - The domain layer will be created with the `Memory` entity and the repository interface.
   - In `src/data/repositories/MockMemoryRepository.ts`, `SEED` and `NEW_QUEUE` will be defined. The recording simulation will delay the process, emitting progress or resolving after a few seconds to mock the AI processing.
   - All this will be registered in `src/di/container.ts` using TSyringe.
2. **ViewModel (`useHomeViewModel`)**:
   - Manages an interval for the `seconds` counter when `phase === 'rec'`.
   - On stopping recording, transitions to `phase === 'proc'`.
   - Starts a fake interval to increment `layerStep` from 0 to 4 (iterating through `LAYERS`).
   - Upon completion, calls `processNewMemory()` (fetching from the mocked queue) and appends it to the `memories` list.
3. **Presentation (Pixel-Perfect UI)**:
   - Exact migration of inline styles and classes from the web React snippet to React Native `StyleSheet` and `@expo-google-fonts` typography.
   - Conversion of `<div>` and `<p>` to react-native `View` and `Text`.
   - Usage of `@expo/vector-icons` and `react-native-paper` components to ensure fidelity to the native ecosystem.
   - The processing hero will use `Animated` (or Reanimated) to simulate the "spinSlow" infinite animation.

## Acceptance Criteria
- [ ] The app displays the "Inicio" tab on startup (bypassing or rewriting the previous navigation).
- [ ] Correct rendering on iOS and Android of the Header ("Buenos días, Rosa", avatar, date).
- [ ] The large button in `RecordingHero` is pressable; when pressed, it starts counting seconds on screen and changes text to "Te escucho…".
- [ ] When pressed again to stop, it enters the processing state showing the circular loader and the 4 layers (`Sentimiento`, `Tema`, etc.) with progressive checkmarks.
- [ ] After processing, the new memory appears in the "Hoy" list and returns to the idle state.
- [ ] List renders `MemoryCard` items respecting the design, showing tags and reminders if they exist.

## Open Questions / Risk Alerts
- Currently, `App.js` loads the `AuthNavigator`. To visualize the Home screen quickly, the plan assumes temporarily overriding the initial navigation to mount `MainNavigator` directly, skipping the login screen. Do you agree with this temporary approach?
- Animations like `spinSlow 3s linear infinite` will require native `Animated.loop` to emulate the original CSS class provided in the web snippet.
