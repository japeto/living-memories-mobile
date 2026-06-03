# Implementation Plan: UI Adjustments

## 1. Header Name Wrapping (`HomeScreen.tsx`)
- **Location**: `src/presentation/screens/home/HomeScreen.tsx`
- **Changes**: 
  - In `renderHeader`, locate the `View` containing the date and the greeting text.
  - Add `style={{ flex: 1, marginRight: 16 }}` to this `View` so it takes the available space and allows the user's name to wrap to a new line without pushing the `Avatar` off the screen.

## 2. Empty State (`HomeScreen.tsx`)
- **Location**: `src/presentation/screens/home/HomeScreen.tsx`
- **Changes**: 
  - Import `MaterialCommunityIcons` from `@expo/vector-icons`.
  - Add the `ListEmptyComponent` prop to the `FlatList`.
  - Create an empty state layout featuring a centered container with the `notebook-outline` icon (size 48) and the text "No tienes notas, guarda tu primer recuerdo".
  - Add `emptyContainer` (with `alignItems: 'center'`, `justifyContent: 'center'`, `paddingVertical: 48`) and `emptyText` (with `textAlign: 'center'`, `marginTop: 16`) to the `StyleSheet`.

## 3. Reminder Card Padding (`MemoryCard.tsx`)
- **Location**: `src/presentation/components/home/MemoryCard.tsx`
- **Changes**: 
  - Update the `reminderText` style in the `StyleSheet` by adding `flex: 1`. This guarantees that long reminder texts will wrap properly inside the pink notification box and won't be cut off on the right edge.

## 4. Remove Bullets Animation (`RecordingHero.tsx`)
- **Location**: `src/presentation/components/home/RecordingHero.tsx`
- **Changes**: 
  - Inside the `procContent` view, delete the `layersContainer` `View` and the mapping of the steps (`Voz a texto`, `Sentimiento`, `Tema`, `Resumen`).
  - Delete the `LAYERS` constant array from the file.
  - Remove the `layerStep` property from the `RecordingHeroProps` interface.
  - In `HomeScreen.tsx`, remove the `layerStep={vm.layerStep}` prop where `<RecordingHero />` is instanced to avoid TypeScript errors.
