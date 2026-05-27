# AI Tooling — Usage Disclosure

This document describes how the **EduCycle** development team (Group T3, LEIC-ES-2025-26) used Artificial Intelligence tools during the project lifecycle.

---

## Overview

As part of the software engineering course and in alignment with the Faculty's guidelines on responsible use of AI-assisted development, the team adopted a set of AI tools as **development assistants** throughout the project. These tools were used to accelerate non-critical tasks, improve documentation quality, and reduce time spent on boilerplate work — not to replace design decisions, architectural reasoning, or the team's own understanding of the codebase.

---

## Tools Used

| Tool | Provider | Primary Use Cases |
|---|---|---|
| **Claude** (Sonnet / Claude.ai) | Anthropic | Code generation, test scaffolding, architecture clarification |
| **Gemini** (Gemini Advanced / Antigravity) | Google DeepMind | Documentation writing, bug analysis, commit-driven reporting |

---

## Sprint 2: AI Usage

### 1. Code Generation — Boilerplate and Scaffolding
AI tools were used to generate initial boilerplate code for screens, components and service functions. Examples include:
- Generating the initial structure of screen components (e.g. `NewListingScreen`, `ProfileScreen`) following the established component pattern.
- Scaffolding Firebase service functions (e.g. CRUD operations for Firestore listings) from a described interface.
- Generating initial versions of React hook wrappers and context providers.

All AI-generated code was reviewed, tested, and integrated by the team. No AI-generated output was merged without human inspection and contextual adaptation.

### 2. Test Generation — Unit and Acceptance Tests
AI tools assisted in writing tests across two testing layers:
- **Unit tests (Jest + React Native Testing Library):** AI-generated test cases for validation logic (e.g. condition validation, ISBN format checks) and service functions, which were then reviewed for correctness against the actual implementation.
- **Acceptance tests (Maestro):** AI-generated YAML flow scripts for end-to-end scenarios such as login, listing creation, wishlist interaction, and back navigation gestures.

### 3. Architecture and Integration Clarification
When the team faced uncertainties around architecture or integration patterns, AI tools were used as a first point of reference:
- Clarifying React Navigation stack configuration and gesture handler setup.
- Understanding Firebase Firestore data model trade-offs (flat documents vs. subcollections).
- Explaining Expo EAS Build profiles and CI/CD integration patterns.
- Reviewing ESLint configuration conflicts and peer dependency resolution strategies.

---

## Sprint 3: AI Usage

### 1. Code Generation — Boilerplate and Scaffolding
During Sprint 3, AI tools provided support in expanding existing features and building new flows:
- **Dark Mode Implementation:** Assisted in refactoring components to consume the `useTheme()` context and structuring the light/dark color palettes.
- **Shopping Cart & Chat:** Scaffolding the initial UI and state management logic for the Shopping Cart screen, as well as extending the Chat functionalities.
- **UI & Icons Transition:** Helped with quick refactors to replace emoji and text arrows with `Ionicons` components across multiple screens.

### 2. Test Generation — Unit and Acceptance Tests
- **Test Maintenance:** AI was used to identify missing assertions and fix failing tests after UI changes (e.g., changes to Safe Area handling, new Ionicons, and Dark Mode wrapping).
- **New Coverage:** Helped generate initial test suites for the Shopping Cart operations (add/remove) and Dropdown Subject selection.

### 3. Architecture, UI/UX and Debugging
- **SafeArea & UI Positioning:** AI provided solutions to fix bottom safe area insets and navbar positioning issues (e.g., navbar going behind phone OS functions).
- **Pipeline Debugging:** Assisted in understanding and resolving CI pipeline errors, specifically adapting the test coverage scripts (swapping `--forceExit` for `--detectOpenHandles`) and updating Node.js versions for EAS CLI compatibility.

---

## Principles Followed

- **AI as an assistant, not an author:** All design decisions, acceptance criteria, and architectural choices were made by the team. AI accelerated execution, not decision-making.
- **Human review of all AI output:** No AI-generated code, test, or documentation was accepted without human review and approval.
- **Transparency:** This document exists to be transparent with course staff and future contributors about the role of AI in the project.
- **No use for assessment avoidance:** AI was not used to answer coursework questions, produce deliverables the team did not understand, or circumvent any explicit prohibition.

---

## References

- [Anthropic Claude](https://www.anthropic.com/claude)
- [Google Gemini](https://gemini.google.com)
- [Faculty guidelines on AI use in academic work](https://sigarra.up.pt)
