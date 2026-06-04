# fix: Unstick recording UI when no speech is detected or recording fails

## Summary

The recording flow on the Home screen gets permanently stuck on the
"Organizando tu recuerdo..." state when the user taps Record, stays silent,
and taps Stop. The same dead-end occurs whenever the recording flow exits
through any error path. Root cause: `phase` (owned by `useHomeViewModel`)
is only reset by an `onMemoryRecorded` callback that fires exclusively on
the happy path. This fix guarantees the UI always returns to `idle` and
surfaces failures with a visible Snackbar message.

## Scope

**In scope**

- Robust state reset across all exit paths in `useRecordingViewModel.stopRecording`
  and `useHomeViewModel.stopRecording`.
- User-visible feedback (Snackbar) when recording cannot be saved.
- Recovery of the captured transcription when Android STT auto-ends due to
  silence (the `if (!isRecording) return;` early-exit currently discards data).
- Test coverage for the three error exit paths that are currently uncovered
  (no-speech, API failure, auto-end race).

**Out of scope**

- `RECORD_AUDIO` permission flow (separate concern; will be tracked as an
  Open Question below).
- Happy-path behavior of the recording animation (`layerStep` sequence,
  `simulateProcessingUI`) — unchanged.
- Backend (`living-memories-api`) — no changes.

## Current Flow Analysis

### File: `src/presentation/viewModels/home/useRecordingViewModel.ts`

`stopRecording` has three exit paths that never signal completion to the
caller:

1. **Line 100 — `if (!isRecording) return;`**
   When Android's native speech recognizer auto-ends on silence,
   `Voice.onSpeechEnd` fires and sets `isRecording = false` (line 37).
   If the user then taps Stop, this guard returns early, discarding the
   transcription already captured in `finalLiveTextRef.current`.

2. **Line 111 — `if (!transcribedText) { setError(...); return; }`**
   When no text was captured (the user stayed silent), the error state is
   set locally but the parent is never notified. This is the bug the user
   reported.

3. **Line 123 — `catch (err) { setError(...); }`**
   When `recordMemoryUseCase.execute` rejects (e.g. API error), the error
   is captured locally but the parent is never notified.

The `finally` block (line 126) only resets the local viewModel
(`setIsProcessing(false)`, `setRecordingSeconds(0)`); it does not invoke
the parent callback.

### File: `src/presentation/viewModels/home/useHomeViewModel.ts`

`stopRecording` (line 79) sets `phase = 'proc'` before awaiting the
recording viewModel. Phase is only returned to `'idle'` from inside
`onMemoryRecorded` (line 29), which the recording viewModel calls only on
the happy path. If any of the three error paths above is taken, `phase`
remains `'proc'` indefinitely.

### File: `src/presentation/screens/home/HomeScreen.tsx`

The screen currently exposes no UI for recording errors. The
`useRecordingViewModel.error` field exists but is never consumed.

### Existing tests

`src/presentation/viewModels/home/__tests__/useRecordingViewModel.test.ts`
already includes a test "should set an error if speech stops with no
transcribed text" (line 146) but it **does not assert** whether
`onMemoryRecorded` was called. That missing assertion is what allowed
this bug to ship.

## Fix Design

### 1. Change `useRecordingViewModel.stopRecording` to return a result

Refactor the public signature so the caller can deterministically branch
on outcome:

```ts
type StopRecordingResult =
  | { ok: true }
  | { ok: false; reason: 'no_speech' | 'api_error' | 'unknown'; message: string };

stopRecording: () => Promise<StopRecordingResult>;
```

Behavior changes:

- **Remove the `if (!isRecording) return;` guard.** Replace it with an
  idempotency guard against double-invocation: a local `isStoppingRef` so
  that re-entrant calls return the existing promise.
- **Always attempt to process `finalLiveTextRef.current`**, regardless of
  the current `isRecording` flag. This recovers the transcription when
  STT has auto-ended.
- **Move the parent notification into `finally`** so it is reached on
  every code path. The callback now receives the result:
  `onRecordingFinished?(result: StopRecordingResult)`.
- Keep `onMemoryRecorded?(): void` (existing happy-path callback) for
  backward compatibility — invoke it only inside the success branch.

### 2. Make `useHomeViewModel.stopRecording` react to the result

Wrap the entire `recordingVM.stopRecording()` await in a `try/finally`
guaranteed to either:

- **On `ok: true`** — run the existing animation:
  `setLayerStep(4)` → `setTimeout(... setPhase('idle'))`.
- **On `ok: false`** — reset `phase` to `'idle'` immediately,
  reset `layerStep` to `0`, clear `simulateProcessingUI`'s interval, and
  set a new `errorMessage` state.
- **On thrown exception** — same as `ok: false` with a generic message.

Expose new viewModel surface:

```ts
errorMessage: string | null;
dismissError: () => void;
```

### 3. Add Snackbar to `HomeScreen`

Use `react-native-paper`'s `Snackbar` component (already available, M3).
Wire it to `vm.errorMessage` / `vm.dismissError`. Position it above the
bottom navigation; auto-dismiss after 4 seconds with a "Cerrar" action.

Messages:

- `no_speech` → `"No se detectó voz. Intenta de nuevo."`
- `api_error` → `"No pudimos guardar tu recuerdo. Intenta de nuevo en un momento."`
- `unknown` → `"Ocurrió un error procesando la grabación."`

## Files to Create / Modify

| File | Action | Description |
| ---- | ------ | ----------- |
| `src/presentation/viewModels/home/useRecordingViewModel.ts` | Modify | Refactor `stopRecording` to return `StopRecordingResult`; move parent notification into `finally`; remove `!isRecording` early-exit; add re-entrancy guard. |
| `src/presentation/viewModels/home/useHomeViewModel.ts` | Modify | Wrap `recordingVM.stopRecording()` in `try/finally`; branch on result; clear `layerIntervalRef` on failure; expose `errorMessage` + `dismissError`. |
| `src/presentation/screens/home/HomeScreen.tsx` | Modify | Render `<Snackbar>` bound to `vm.errorMessage` / `vm.dismissError`. |
| `src/presentation/viewModels/home/__tests__/useRecordingViewModel.test.ts` | Modify | Update existing tests to assert the new result shape; add tests for no-speech, API failure, and STT-auto-end-race paths. |
| `src/presentation/__tests__/viewModels/useHomeViewModel.test.ts` | Modify | Update the mock for `useRecordingViewModel` to honor the new `stopRecording: Promise<StopRecordingResult>` contract; add tests for phase reset on failure and `errorMessage` surfacing. |
| `src/presentation/__tests__/screens/HomeScreen.test.tsx` | Create or Modify | Verify Snackbar renders when `errorMessage` is set and is dismissed when `dismissError` runs. |

## Component & Data Contracts

```ts
// useRecordingViewModel.ts (new exports)
export type StopRecordingResult =
  | { ok: true }
  | { ok: false; reason: 'no_speech' | 'api_error' | 'unknown'; message: string };

export interface RecordingViewModelState {
  isRecording: boolean;
  isProcessing: boolean;
  recordingSeconds: number;
  liveText: string;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<StopRecordingResult>; // ← changed
  error: string | null;
}

// useRecordingViewModel hook signature
export function useRecordingViewModel(
  onMemoryRecorded?: () => void,
): RecordingViewModelState;

// useHomeViewModel.ts (new exports)
export interface HomeViewModelState {
  memories: Memory[];
  phase: 'idle' | 'rec' | 'proc';
  seconds: number;
  layerStep: number;
  newId: string | null;
  onToggleRecord: () => void;
  isLoading: boolean;
  liveText: string;
  errorMessage: string | null;        // ← new
  dismissError: () => void;            // ← new
}
```

## Business Logic / Change Description

**`useRecordingViewModel.stopRecording` (refactored)**

```
1. If isStoppingRef.current is true → return previous promise (idempotency).
2. Clear timerRef.
3. setIsRecording(false); setIsProcessing(true).
4. try:
     a. await Voice.stop().
     b. text = finalLiveTextRef.current.trim().
     c. If text is empty → result = { ok:false, reason:'no_speech',
          message:'No se detectó voz.' }.
     d. Else:
          i. await recordMemoryUseCase.execute(text).
          ii. onMemoryRecorded?.().
          iii. result = { ok:true }.
   catch (err):
     result = { ok:false, reason:'api_error' (if recordMemoryUseCase failed)
                          or 'unknown', message: ... }.
5. finally:
     a. setIsProcessing(false); setRecordingSeconds(0).
     b. setError(result.ok ? null : result.message).
     c. isStoppingRef.current = false.
6. return result.
```

**`useHomeViewModel.stopRecording` (refactored)**

```
1. setPhase('proc'); setLayerStep(0); setNewId(null); simulateProcessingUI().
2. try:
     result = await recordingVM.stopRecording().
     if result.ok:
       (existing happy-path: onMemoryRecorded already executed inside the
        recording VM → setLayerStep(4) + setTimeout → fetchMemories +
        setPhase('idle') + setLayerStep(0)).
     else:
       clearInterval(layerIntervalRef.current).
       setLayerStep(0).
       setPhase('idle').
       setErrorMessage(result.message).
   finally:
     // Safety net: any unexpected throw must not leave UI in 'proc'.
     if phase still 'proc' after micro-task → setPhase('idle').
3. (Reuse existing onMemoryRecorded callback for the happy-path animation.)
```

## API Integration

No backend changes. The error path `api_error` is detected by catching
the rejection of `recordMemoryUseCase.execute`. Any HTTP error mapping
already happens in `data/network/apiClient` and is propagated as a
JS Error.

## Test Plan

### `useRecordingViewModel.test.ts`

Add or update assertions to cover all four exit paths:

1. **Happy path (update existing)** — text captured, API succeeds:
   - `Voice.stop` called
   - `recordMemoryUseCase.execute` called with text
   - `onMemoryRecorded` called
   - returns `{ ok: true }`
   - `error` is `null`, `isProcessing` is `false`, `recordingSeconds` is `0`

2. **No speech (update existing)** — no text, no API call:
   - `Voice.stop` called
   - `recordMemoryUseCase.execute` **not** called
   - `onMemoryRecorded` **not** called (existing behavior preserved)
   - returns `{ ok: false, reason: 'no_speech', message: 'No se detectó voz.' }`
   - `error` is `'No se detectó voz.'`, `isProcessing` is `false`

3. **API failure (new)** — text captured, `recordMemoryUseCase` throws:
   - `Voice.stop` called
   - `recordMemoryUseCase.execute` called
   - returns `{ ok: false, reason: 'api_error', message: ... }`
   - `error` is set; `isProcessing` is `false`

4. **STT auto-end race (new)** — `Voice.onSpeechEnd` fires before user
   taps stop, but `finalLiveTextRef` has text:
   - simulate: `onSpeechResults` then `onSpeechEnd` then `stopRecording()`
   - Even though `isRecording` was `false`, `recordMemoryUseCase.execute`
     IS called with the captured text (regression test for BUG 1)
   - returns `{ ok: true }`

5. **Re-entrancy (new)** — two concurrent `stopRecording()` calls:
   - `Voice.stop` is called exactly once
   - both calls resolve to the same result

### `useHomeViewModel.test.ts`

Update the existing mock for `useRecordingViewModel` so `stopRecording`
returns `Promise<StopRecordingResult>`. Add:

1. **Phase reset on failure (new)** — `stopRecording` resolves
   `{ ok: false, reason: 'no_speech', message: 'No se detectó voz.' }`:
   - After flushing microtasks, `phase` is `'idle'`
   - `layerStep` is `0`
   - `errorMessage` equals `'No se detectó voz.'`
   - `memories` is not refetched

2. **Phase reset on thrown exception (new)** — mock `stopRecording`
   rejects with `new Error('boom')`:
   - `phase` is `'idle'`
   - `errorMessage` is the generic unknown-error message

3. **`dismissError` clears errorMessage (new)** —
   - set errorMessage via a failed stop, then call `dismissError`
   - `errorMessage` becomes `null`

### `HomeScreen.test.tsx`

1. **Snackbar visible when `errorMessage` is set** — render with VM mock
   that exposes `errorMessage: 'No se detectó voz.'`; assert the text is
   visible.

2. **Snackbar dismissed by user** — fire the Snackbar's `onDismiss`;
   `dismissError` is called.

## Acceptance Criteria

- [ ] Tap Record → stay silent → tap Stop → UI returns to `idle` and a
      Snackbar shows `"No se detectó voz. Intenta de nuevo."`.
- [ ] Tap Record → speak briefly → wait 3+ seconds → tap Stop:
      transcription is processed and memory saved (no data lost despite
      Android STT auto-ending).
- [ ] Tap Record → speak → tap Stop while the API is offline: UI returns
      to `idle` with `"No pudimos guardar tu recuerdo..."` Snackbar.
- [ ] Happy-path animation (`layerStep` 0 → 4 → idle) is preserved.
- [ ] All new tests pass; existing happy-path test in
      `useRecordingViewModel.test.ts` still passes after the contract
      change.
- [ ] No regressions in `useHomeViewModel.test.ts` happy path.

## Open Questions / Risk Alerts

1. **RECORD_AUDIO permission (deferred)**
   The emulator confirmed `RECORD_AUDIO: granted=false` and the app does
   not request it before starting recording. On real devices Expo's auto
   permission may have covered this so far. Out of scope for this fix
   but should be tracked as a follow-up.

2. **Backend timeout vs `api_error`**
   `apiClient` may rethrow non-Error objects in some timeout paths.
   `useRecordingViewModel` will coerce non-Error rejections to the
   `unknown` reason to be safe.

3. **Snackbar z-order on Android**
   `react-native-paper` Snackbar uses an absolute-positioned `Surface`.
   We must render it inside the `SafeAreaView`, after `FlatList`, so it
   sits above content. To verify on first run on the emulator.

4. **Re-entrancy ref vs StrictMode double-invocation**
   The new `isStoppingRef` must reset in the `finally`; otherwise dev
   mode (or rapid double-taps) could leave the hook unable to stop a
   subsequent recording.

## Commit / Branch Suggestion

- Branch: `fix/recording-stuck-in-processing`
- Commit (Conventional Commits):
  `fix(home): unstick recording UI when no speech is detected`
- PR title: `fix(home): unstick recording UI on silent-record and error paths`
