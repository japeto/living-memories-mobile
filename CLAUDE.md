# Living Memories Mobile — Claude Code Project Context

## What is this project?
**Mi Recuerdo Vivo** is a mobile application for elderly users that uses AI to transform voice messages into a structured memory diary and wellness summaries.

This repository contains the **React Native + Expo mobile client** that consumes the living-memories-api REST backend.

## Tech Stack
- **Framework**: React Native 0.81 + Expo ~54
- **Language**: JavaScript / TypeScript
- **UI Library**: react-native-paper (Material Design 3)
- **Icons**: @expo/vector-icons
- **Architecture**: Clean Architecture (Domain, Data, Presentation) + MVVM + DI
- **DI Library**: tsyringe + reflect-metadata
- **Tests**: Jest + React Native Testing Library (RNTL)
- **Package Manager**: npm
- **Backend**: living-memories-api (FastAPI REST)

## Repository Structure
```
living-memories-mobile/
├── index.js
├── App.js
├── app.json
├── package.json
├── tsconfig.json
├── src/
│   ├── domain/        # Entities, Repository Interfaces, Use Cases
│   ├── data/          # Repository Implementations, API Clients, DTOs
│   ├── presentation/  # UI (Screens, Components), ViewModels (Custom Hooks)
│   └── di/            # Dependency Injection container setup
└── assets/
```

## Language Rule (CRITICAL)
**Everything inside this repository must be written in technically correct English:**
- All code, comments, and JSDoc annotations
- All Markdown files (CLAUDE.md, implementation_plan.md, task.md, README.md)
- All skill instructions and agent plans
- PR titles, descriptions, and commit messages

The **only exception** is the external knowledge base (the Obsidian vault), which is the exclusive domain of the optional `lm_writer` skill and is written in Spanish.

## Session Behavior: Human-on-the-Loop Model
Before writing any code, always:
1. Act as `lm_architect`: read the existing code, analyze context, and present a plan
2. Wait for explicit user approval
3. Act as `lm_developer`: implement following the approved plan
4. Act as `lm_qa`: write and run tests
5. Act as `lm_git`: create the branch and conventional commit
6. **(Optional)** Act as `lm_writer`: log the session in the external knowledge base (Spanish)

## Available Skills
| Skill | When to use |
|-------|-------------|
| `/lm-architect` | Technical analysis, implementation plan generation |
| `/lm-developer` | Domain, Data, Presentation layers implementation |
| `/lm-qa` | Writing and running Jest/RNTL tests |
| `/lm-git` | Branches, conventional commits, Pull Requests |
| `/lm-rn-context` | React Native Clean Arch context (inherited by architect/developer) |
| `/lm-writer` | *(Optional)* Session logging in the external knowledge base (Spanish) |

## Agent Security Boundaries
- **Only lm_developer** writes JavaScript/TypeScript code in `src/`
- **Only lm_qa** writes tests in `__tests__/` or `*.test.{js,ts}` files
- **Only lm_git** performs Git operations (and archives the plan into `docs/completed/`)
- **Only lm_writer** writes to the external knowledge base (in Spanish) — if installed
- **lm_architect** is READ-ONLY on all repo files; only writes `implementation_plan.md`

## Code Conventions
- **Dependency Rule**: Presentation and Data depend on Domain. Domain depends on nothing.
- **Dependency Injection**: Use `tsyringe`. Domain interfaces are injected into Use Cases, and Use Cases are injected into ViewModels.
- **MVVM Pattern**: ViewModels are implemented as Custom Hooks (`useViewModel`). They manage state and resolve dependencies.
- **Functional Components**: No class components.
- **API Integration**: Data layer handles all API calls and maps responses to Domain Entities.
