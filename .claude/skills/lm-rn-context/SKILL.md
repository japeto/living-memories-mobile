---
name: lm-rn-context
description: Loads the React Native Clean Architecture + MVVM + DI conventions for the LivingMemories Mobile project. Inherited by lm_architect and lm_developer.
---

# lm-rn-context — React Native Conventions Context (Mobile)

ROLE: React Native Context Provider for the LivingMemories Mobile project
PURPOSE: This skill loads the authoritative Clean Architecture + MVVM + DI conventions using `tsyringe`.

---

## Core Principles

### 1. Clean Architecture Layers

```
src/
├── domain/        # The CORE. Pure logic. No UI, no external frameworks.
│   ├── entities/  # Business objects (e.g., User, AudioMemo)
│   ├── repos/     # Interfaces (e.g., IAuthRepository)
│   └── useCases/  # Application logic (e.g., LoginUseCase)
├── data/          # The INFRASTRUCTURE. Implements domain repos.
│   ├── repos/     # RepositoryImpl (implements IAuthRepository)
│   ├── network/   # API Clients, Axios/fetch setup
│   └── dtos/      # Data Transfer Objects
├── presentation/  # The UI. React Native code.
│   ├── viewModels/# Custom hooks (e.g., useAuthViewModel)
│   ├── screens/   # UI Views
│   ├── components/# Reusable UI elements
│   └── theme/     # react-native-paper theme
└── di/            # Dependency Injection
    └── container.ts
```

### 2. Dependency Rule

- `Domain` knows NOTHING about `Data` or `Presentation`.
- `Data` knows about `Domain` (it implements its interfaces and returns its Entities).
- `Presentation` knows about `Domain` (to execute Use Cases).

### 3. Dependency Injection (tsyringe)

Use `tsyringe` to decouple layers.

- Decorate implementations with `@injectable()`.
- Use tokens to inject interfaces: `@inject('IAuthRepository') authRepo: IAuthRepository`.
- Register dependencies in `src/di/container.ts`.

### 4. MVVM with Hooks

ViewModels are implemented as Custom Hooks. They resolve Use Cases from the DI container and expose state to the View.

```javascript
// src/presentation/viewModels/useFeatureViewModel.ts
import { useState } from 'react';
import { container } from 'tsyringe';
import { DoSomethingUseCase } from '../../domain/useCases/DoSomethingUseCase';

export function useFeatureViewModel() {
  const [data, setData] = useState(null);

  // Resolve dependency locally
  const doSomethingUseCase = container.resolve(DoSomethingUseCase);

  const load = async () => {
    const result = await doSomethingUseCase.execute();
    setData(result);
  };

  return { data, load };
}
```

### 5. Screens bind to ViewModels

Screens should contain minimal to no logic. They delegate everything to the ViewModel.

```javascript
// src/presentation/screens/FeatureScreen.tsx
import { useFeatureViewModel } from '../viewModels/useFeatureViewModel';

export function FeatureScreen() {
  const { data, load } = useFeatureViewModel();
  // UI rendering only
}
```

### 6. react-native-paper Usage

Always prefer Paper components over raw React Native primitives when an equivalent exists.

---

## Do NOT Use

- Feature-slice folders (`src/features/...`) — we use layered architecture now.
- `fetch` directly inside Presentation. All network calls go in Data.
- Business logic inside ViewModels or Screens. Put it in Domain Use Cases.
