# Implementation Plan: Wellness API Integration (Mobile)

## Objective
Integrate the "Bienestar" (Wellness) feature in the React Native mobile app with the real FastAPI backend deployed on Render. Replace the mocked data in `useWellnessViewModel` with a full Clean Architecture flow (API Client -> Repository -> Use Case -> ViewModel).

## Architecture & Design
Follow the project's Clean Architecture approach (`src/domain/`, `src/data/`, `src/presentation/`):
1. **Environment Configuration**: Set up the `API_BASE_URL` in `.env` to point to the Render deployment, which gets mapped through `app.config.js`.
2. **Domain Layer**: Extract the `WellnessData` interface and define the repository contract and the use case.
3. **Data Layer**: Implement the network client to fetch the `/api/v1/wellness/current-week` endpoint, and create the concrete repository.
4. **Presentation Layer**: Update the ViewModel to execute the use case, managing `isLoading`, `data`, and `error` states. The `WellnessScreen` must be updated to reflect these states.

---

## Step-by-Step Implementation

### 1. Environment Configuration
*   **File**: `.env` and `.env.example`
*   **Action**: Add `API_BASE_URL=<RENDER_URL>` to both files (the specific URL will be configured by the developer or user locally). `app.config.js` is already set up to read `process.env.API_BASE_URL` and expose it as `extra.apiBaseUrl`.

### 2. Domain Layer
*   **File**: `src/domain/wellness/entities/WellnessData.ts`
    *   **Action**: Create this file and move the `WellnessData` interface (currently in `useWellnessViewModel.ts`) here.
*   **File**: `src/domain/wellness/repositories/IWellnessRepository.ts`
    *   **Action**: Create interface with method `getWeeklyWellness(): Promise<WellnessData>`.
*   **File**: `src/domain/wellness/useCases/GetWeeklyWellnessUseCase.ts`
    *   **Action**: Create the use case using `@injectable()`. Inject `'IWellnessRepository'` in the constructor and call the repository method inside an `execute()` function.

### 3. Data Layer
*   **File**: `src/data/network/wellnessApiClient.ts`
    *   **Action**: Create the network file. Use `apiClient.get<WellnessData>('/api/v1/wellness/current-week')` and return the data.
*   **File**: `src/data/repositories/WellnessRepository.ts`
    *   **Action**: Implement `IWellnessRepository`. Call the function from `wellnessApiClient.ts` and return the result.

### 4. Dependency Injection
*   **File**: `src/di/container.ts`
    *   **Action**: Register the new dependencies:
        ```typescript
        container.registerSingleton('IWellnessRepository', WellnessRepository);
        container.registerSingleton(GetWeeklyWellnessUseCase);
        ```

### 5. Presentation Layer
*   **File**: `src/presentation/viewModels/wellness/useWellnessViewModel.ts`
    *   **Action**: 
        *   Remove the hardcoded `data` payload.
        *   Add states: `data` (nullable), `isLoading` (boolean), `error` (string | null).
        *   Resolve `GetWeeklyWellnessUseCase` using `container.resolve()`.
        *   Implement a `fetchData()` method to execute the use case and update states. Call it inside a `useEffect` on mount.
        *   Return `{ data, isLoading, error, refetch: fetchData }`.
*   **File**: `src/presentation/screens/wellness/WellnessScreen.tsx`
    *   **Action**: Handle the new states from the ViewModel. Add an `ActivityIndicator` when `isLoading` is true. Render an error message and a retry button if `error` exists. Gracefully handle the case where `data` might be null while loading.

---

## Open Questions (/grill-me)
1. **Render URL**: What is the exact URL of the API deployed on Render so we can document it or set it in the `.env` instructions?
2. **Error Handling UI**: Would you like a specific UI component for errors (e.g., a Snackbar or a dedicated view with a "Retry" button) on the `WellnessScreen`?
3. **Empty States**: If the backend returns no data (e.g., the user hasn't recorded any memories this week), how should the screen behave? Should it display a fallback message encouraging the user to record memories?

> [!IMPORTANT]
> Por favor, revisa el plan a la izquierda y proporciona tus respuestas a las preguntas abiertas antes de aprobar.
