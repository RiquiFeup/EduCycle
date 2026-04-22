# Development Environment, Coding Standards and Guidelines

**Project:** EduCycle (Group T3)  
**Repository type:** Mobile application built with **React Native + Expo**, with **Firebase Auth** and **Firestore**.  
**Purpose of this document:** describe how a new team member can set up the development environment, understand the project infrastructure, and follow the team coding rules.

---

## 1. What this topic is asking for

This topic is asking the team to provide a **practical development guide** for the project.

In plain English, you are expected to document:

- which tools are needed to work on the project;
- how to install and run the project locally;
- what infrastructure and external services the project depends on;
- how code should be organised and written;
- how the team tests and validates changes before merging them.

This is not a feature implementation task. It is a **maintenance and onboarding document** so that another developer can clone the repository and start working without guesswork, which, for humans, is already an ambitious enough goal.

---

## 2. Project technology stack

The current repository is based on the following stack:

- **Frontend / Mobile app:** React Native with Expo
- **Language:** JavaScript / JSX
- **Authentication:** Firebase Authentication
- **Database:** Firebase Firestore
- **Local persistence:** AsyncStorage
- **Unit and component testing:** Jest + React Native Testing Library
- **End-to-end testing:** Maestro
- **Continuous Integration:** GitHub Actions
- **Package manager:** npm

### Relevant repository evidence

The project scripts defined in `package.json` include:

- `npm start` for Expo
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm test`
- `npm run test:coverage`
- `npm run e2e`

The CI workflow in `.github/workflows/ci.yml` runs on **Node.js 18.x**, installs dependencies with `npm ci --legacy-peer-deps`, and executes the coverage test suite.

> Important correction: the current main `README.md` still mentions **Flutter** in the architecture section, but the uploaded codebase is clearly an **Expo / React Native** project. This should be corrected to avoid inconsistency in the report.

---

## 3. Development environment setup

### 3.1 Prerequisites

Before running the project, the developer should install:

- **Node.js 18.x**
- **npm** (comes with Node.js)
- **Git**
- **Expo CLI tools** through `npx expo` usage
- One of the following execution environments:
  - **Expo Go** on a physical device, or
  - **Android Studio** with an Android emulator, or
  - **Xcode** with an iOS simulator on macOS

### 3.2 Clone and install

```bash
git clone <repository-url>
cd T3-development
npm ci --legacy-peer-deps
```

The use of `npm ci --legacy-peer-deps` is recommended because it matches the CI pipeline and ensures consistent dependency resolution.

### 3.3 Run the application

To start the Expo development server:

```bash
npm start
```

To run directly on Android:

```bash
npm run android
```

To run on iOS (macOS only):

```bash
npm run ios
```

To run the web preview:

```bash
npm run web
```

### 3.4 Test commands

Run the unit and component test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage:

```bash
npm run test:coverage
```

Run end-to-end flows with Maestro:

```bash
npm run e2e
```

---

## 4. Infrastructure and external services

### 4.1 Firebase

The project uses Firebase as its main backend support service.

Current integrations identified in the codebase:

- **Firebase Authentication** for account creation, login, logout and auth state subscription;
- **Firestore** for user profile storage and updates.

The Firebase application is initialised in `src/utils/firebase.js` and used through the service layer in `src/services/authService.js`.

### 4.2 Persistence and state

- Authentication persistence is configured with **AsyncStorage**.
- The application uses **React state and hooks** for screen navigation and local UI state.
- Shared user data is managed through a context in `src/contexts/UserContext.jsx`.

### 4.3 Continuous Integration

A GitHub Actions workflow is defined in `.github/workflows/ci.yml`.

The current pipeline:

1. checks out the repository;
2. sets up **Node.js 18.x**;
3. installs dependencies with `npm ci --legacy-peer-deps`;
4. runs `npm run test:coverage`.

This means every relevant change should keep the automated test suite green before merging.

---

## 5. Project structure

The repository follows a simple feature-oriented React Native structure:

```text
T3-development/
├── App.js
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── data/              # Mock/static data
│   ├── hooks/             # Custom hooks
│   ├── screens/           # Application screens
│   │   └── listing/       # Listing-specific screens and UI pieces
│   ├── services/          # External service access, e.g. Firebase auth
│   └── utils/             # Shared helpers, theme and validation
├── __tests__/             # Unit and screen tests
├── .maestro/flows/        # End-to-end test flows
├── assets/                # Icons and images
└── .github/workflows/     # CI configuration
```

### Structure rules

- Reusable visual elements belong in `src/components/`.
- Screen-level logic belongs in `src/screens/`.
- Communication with Firebase or other external services belongs in `src/services/`.
- Generic helpers and shared constants belong in `src/utils/`.
- Tests must be placed under `__tests__/` and grouped by type whenever possible.

---

## 6. Coding standards

The following coding standards should be followed across the repository.

### 6.1 Naming conventions

- **PascalCase** for React components and screen files  
  Example: `HomeScreen.jsx`, `ListingCard.jsx`
- **camelCase** for functions, variables and props  
  Example: `handleLoginSuccess`, `normalizeEmail`
- **UPPER_SNAKE_CASE** for exported constants  
  Example: `COLORS`, `SPACING`, `RADIUS`

### 6.2 Component design rules

- Prefer **functional components**.
- Use **React hooks** instead of class components.
- Keep components focused on a single responsibility.
- Pass behaviour through props rather than duplicating logic.
- Move reusable UI into shared components when the same pattern appears in more than one screen.

### 6.3 State and side effects

- Keep temporary UI state local to the screen/component.
- Put shared user-related state in context providers.
- Use `useEffect` only for actual side effects such as subscriptions, async initialisation or cleanup.
- Avoid embedding backend logic directly inside presentational components.

### 6.4 Services and Firebase access

- Firebase calls should be concentrated in the **service layer** whenever possible.
- UI components should call service functions instead of duplicating Firebase code.
- Error messages exposed to the user should be mapped to readable text, as already done in `authService.js`.

### 6.5 Styling rules

- Shared design tokens must be placed in `src/utils/theme.js`.
- Feature-specific styles can remain near the feature, for example `src/screens/listing/styles.js`.
- Prefer consistent spacing, border radius and colour usage based on shared constants.
- Avoid hardcoding new colours or spacing values if an equivalent token already exists.

### 6.6 Formatting rules

The codebase already follows a mostly consistent style. The team standard should be:

- use **single quotes**;
- end statements with **semicolons**;
- use **trailing commas** in multiline objects, arrays and argument lists;
- keep line length reasonable for readability;
- use descriptive variable and function names;
- remove unused imports, variables and dead code.

### 6.7 Testing rules

- Every relevant screen or utility change should include or update tests.
- Validation logic belongs in unit tests.
- Screen interactions should be covered with React Native Testing Library.
- Core user journeys should be covered with Maestro flows.
- New features should not reduce overall test reliability.

---

## 7. Development workflow guidelines

### 7.1 Branches

The repository CI is configured for `main` and `development`, so the recommended workflow is:

- `main` -> stable version
- `development` -> integration branch for ongoing work
- feature branches -> one branch per task or user story

Suggested branch naming:

- `feature/login-validation`
- `feature/new-listing-form`
- `fix/profile-update-error`
- `test/chat-screen`

### 7.2 Commits

Commits should be small, focused and descriptive.

Recommended commit message style:

- `feat: add listing details screen tests`
- `fix: prevent invalid email login submission`
- `refactor: move firebase auth logic to service layer`
- `docs: add development environment guide`

### 7.3 Pull requests

Before opening a pull request, the developer should:

1. pull the latest changes from the target branch;
2. run the full test suite locally;
3. verify that the app still launches correctly;
4. write a concise pull request description;
5. reference the related backlog item or user story.

---

## 8. Quality and maintenance rules

To keep the project maintainable over time, the team should follow these rules:

- do not mix unrelated refactors with feature changes;
- prefer incremental improvements over large uncontrolled rewrites;
- document any new dependency before merging it;
- keep the README and project report aligned with the actual stack;
- update tests whenever behaviour changes;
- avoid committing generated coverage output unless explicitly required by the course setup.

## 9. Recommended future tooling

The current environment works, but the following additions are recommended:

- **ESLint** for static analysis
- **Prettier** for automatic formatting
- **Husky + lint-staged** for pre-commit checks
- **Conventional Commits** for cleaner history

Suggested installation:

```bash
npm install -D eslint prettier eslint-config-expo eslint-plugin-react eslint-plugin-react-hooks husky lint-staged
```

These tools are not strictly required to run the current project, but they would make the development environment more robust.

---

## 10. Final team guideline summary

Every team member working on EduCycle should be able to:

1. install Node.js 18 and the project dependencies;
2. run the Expo app locally;
3. understand that Firebase Auth and Firestore are the core backend services currently in use;
4. follow the project folder structure;
5. write React Native code using functional components and shared utilities;
6. run tests before pushing code;
7. keep documentation aligned with the real implementation.

abstractions and shared utilities. The team standard is to use functional components, clear naming conventions, single quotes, semicolons, focused commits, tested changes and consistent theme usage.
