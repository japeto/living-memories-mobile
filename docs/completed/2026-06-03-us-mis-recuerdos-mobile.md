# Implementación: Pantalla "Mis Recuerdos" (US)

Este plan abarca las modificaciones necesarias tanto en el backend (`living-memories-api`) como en el frontend (`living-memories-mobile`) para implementar la pantalla de "Mis Recuerdos" según el diseño proporcionado, utilizando la arquitectura de cada repositorio.

## User Review Required
> [!IMPORTANT]
> El plan asume que la agrupación por día (HOY, AYER, FECHA) y el filtrado por "Categorías" se realizará de manera local en el dispositivo móvil (ViewModel), dado que el volumen actual de memorias permite traerlas todas de una vez y procesarlas en el cliente.
> Además, se adaptarán las categorías en el prompt de la IA del backend para que coincidan exactamente con el diseño UI (Familia, Salud, Lecturas, Bienestar, Cotidiano).

## Proposed Changes

---

### Backend (`living-memories-api`)

#### [MODIFY] `app/features/ai_analysis/gemini_service.py`
- Actualizar el `PROMPT_TEMPLATE` para que las clasificaciones de tema correspondan exactamente al frontend: `Familia`, `Salud`, `Lecturas`, `Bienestar`, `Cotidiano`.
- Actualizar el valor fallback de `topic` (en caso de que no haya API key) a `"Familia"` en lugar de `"Familia y Amigos"`.

---

### Mobile (`living-memories-mobile`)

#### [NEW] `src/domain/entities/Memory.ts`
- Definir la interfaz de la entidad `Memory` basándose en el esquema de la API (`id`, `text`, `topic`, `mood`, `reminder_text`, `created_at`).

#### [NEW] `src/domain/repos/IMemoryRepository.ts`
- Declarar la interfaz para el repositorio: `getMemories(): Promise<Memory[]>`.

#### [NEW] `src/domain/useCases/GetMemoriesUseCase.ts`
- Caso de uso inyectable que encapsula la llamada al repositorio para obtener las memorias.

#### [NEW] `src/data/repos/MemoryRepositoryImpl.ts`
- Implementación de `IMemoryRepository` que realiza la llamada `GET /memories` usando el cliente HTTP configurado.

#### [MODIFY] `src/di/container.ts`
- Registrar `IMemoryRepository` a `MemoryRepositoryImpl` y `GetMemoriesUseCase`.

#### [NEW] `src/presentation/viewModels/useMemoriesViewModel.ts`
- Hook que maneja el estado de `loading`, `error`, `memories` (originales), `filter` (Todos o un TopicKey) y `groupedMemories` (transformación de lista plana a formato para `SectionList` con secciones como "HOY", "AYER", "12 DE MAYO").

#### [NEW] `src/presentation/components/CategoryPills.tsx`
- Componente de UI para el selector horizontal de filtros (Todos, Familia, Salud, etc.).

#### [NEW] `src/presentation/components/MemoryCard.tsx`
- Componente visual de tarjeta estilo álbum. Deberá usar `resolveTopic` y `resolveMood` del `taxonomy.ts` para renderizar colores de fondo, íconos y textos según la taxonomía.

#### [NEW] `src/presentation/screens/home/MemoriesScreen.tsx`
- Pantalla principal que utiliza `SectionList` para renderizar las agrupaciones por día, y coloca `CategoryPills` como header de la lista o debajo del título "Mis Recuerdos".

#### [MODIFY] `src/presentation/navigation/MainNavigator.tsx`
- Cambiar la pestaña "Historial" (Placeholder) por "Recuerdos" mapeando a `MemoriesScreen`.
- Actualizar el icono a uno tipo libro (`book` o `book-open-outline`).

## Verification Plan

### Automated Tests
**Backend:**
- `python -m pytest tests/` confirmará que los tests de la API sigan pasando tras modificar el fallback y el prompt (no debería romper schemas a menos que haya assertions fijos).
**Mobile:**
- Escribir tests para `GetMemoriesUseCase` en `src/domain/__tests__/`.
- Escribir tests de integración de mock para `MemoryRepositoryImpl`.
- Probar `useMemoriesViewModel` verificando la correcta agrupación por día y el filtrado local.

### Manual Verification
- Levantar backend `uvicorn main:app` y mobile `npx expo start`.
- Acceder a la segunda pestaña (Recuerdos) y verificar visualmente que las memorias se ven como en el diseño (bordes, fuentes, colores pastel).
- Probar presionar un Pill y comprobar que se filtran las tarjetas adecuadamente.
