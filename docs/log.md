# Bug & Fix Log — Sprint 2

This document records the bugs and infrastructure issues encountered during **Sprint 2** of EduCycle, how they were identified, and how they were resolved. Entries are derived from the git commit history between the `sprint-1` tag and the current `HEAD` of `development`.

---

## Summary Table

| # | Bug / Issue | Commit(s) | Status |
|---|---|---|---|
| 1 | CI pipeline broken after ESLint v9 incompatibility | `d44ff78` | ✅ Fixed |
| 2 | Tests path in `package.json` scripts pointing to old `__tests__` directory | `5cc6345` | ✅ Fixed |
| 3 | Directory rename conflicts during test folder restructure | `f31a017` | ✅ Fixed |
| 4 | Lint script path not re-applied after merge | `6bd8ee9` | ✅ Fixed |
| 5 | Folder path issue after post-merge structure changes | `e02fbb8` | ✅ Fixed |
| 6 | Jest environment not declared, causing test failures | `f5d22fe` | ✅ Fixed |
| 7 | Syntax error in Jest setup Firestore mock | `87c9be7` | ✅ Fixed |
| 8 | Wishlist errors and profile name change not working correctly | `fcc8b03` | ✅ Fixed |
| 9 | Profile photo upload fails or does not persist correctly | `b3c7f94` | ✅ Fixed |
| 10 | HomeScreen search tests failing after UI changes | `88063af` | ✅ Fixed |

---

## Detailed Entries

---

### Bug 1 — ESLint v9 incompatibility breaks CI pipeline

**Identified in:** `fix/downgrade-eslint` branch (PR #134)  
**Commits:** `d44ff78`

**Description:**  
After ESLint was introduced as a code quality step in the CI pipeline (commit `08c4445`), the pipeline started failing because ESLint v9 introduced a new flat config format that is incompatible with the legacy `.eslintrc.js` configuration used by the project and by the `eslint-plugin-react` family. This caused the `npm run lint` step to crash on every CI run.

**Resolution:**  
Downgraded ESLint from v9 to v8 (`eslint@^8.57.1`), which supports the `.eslintrc.js` format. The `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-native` plugins are only compatible with ESLint v8, so the downgrade also resolved latent plugin compatibility warnings.

---

### Bug 2 — Test scripts pointing to old `__tests__` directory

**Identified in:** `fix/downgrade-eslint` branch  
**Commits:** `5cc6345`

**Description:**  
After the test folder was restructured from `__tests__/` to `tests/unit/` and `tests/acceptance/` (commit `af07024`), the `jest.testMatch` pattern and the `e2e` script in `package.json` were not updated. This caused `npm test` to find zero test files and `npm run e2e` to reference a non-existent path.

**Resolution:**  
Updated `package.json` scripts and `jest.testMatch` to point to the new `tests/` directory layout. The lint script path was also corrected after a post-merge regression (see Bug 4).

---

### Bug 3 — Directory rename conflicts during test folder restructure

**Identified in:** `fix/downgrade-eslint` branch  
**Commits:** `f31a017`

**Description:**  
When the test folders were reorganised from `__tests__/` to `tests/unit/` and `tests/acceptance/`, merge conflicts arose because different branches had files at both the old and new paths simultaneously. Git's rename detection did not automatically reconcile the concurrent structural changes.

**Resolution:**  
Manually resolved conflicts by moving test files to the correct target paths under the new `tests/` structure, then committed the resolved state.

---

### Bug 4 — Lint script path not re-applied after merge

**Identified in:** `fix/downgrade-eslint` branch  
**Commits:** `6bd8ee9`

**Description:**  
After merging branches with conflicting `package.json` modifications, the `lint` script reverted to an earlier version that referenced `src/` and `__tests__/` instead of `src/` and `tests/`. This caused `npm run lint` to skip the test files.

**Resolution:**  
Re-applied the correct lint script path (`eslint src/ tests/`) in `package.json`.

---

### Bug 5 — Folder path issue after post-merge structure changes

**Identified in:** `fix/downgrade-eslint` branch  
**Commits:** `e02fbb8`

**Description:**  
After merging multiple branches that each modified the project folder structure, a residual path inconsistency was left in the repository where one or more files referenced folders that no longer existed at those paths.

**Resolution:**  
Identified and corrected the stale path references, restoring a consistent folder layout.

---

### Bug 6 — Jest test environment not declared

**Identified in:** `fix/downgrade-eslint` branch  
**Commits:** `f5d22fe`

**Description:**  
Certain test files were failing with environment-related errors because the Jest configuration did not explicitly specify the `testEnvironment`. In some setups this defaulted to `node` instead of `jsdom`, causing React Native Testing Library utilities to behave unexpectedly.

**Resolution:**  
Added the `testEnvironment` declaration to the Jest configuration in `package.json`.

---

### Bug 7 — Syntax error in Jest setup Firestore mock

**Identified in:** `fix/downgrade-eslint` branch  
**Commits:** `87c9be7`

**Description:**  
The Jest global setup file (`tests/setup/jest.setup.js`) contained a syntax error in the Firestore mock definition. This caused the entire test suite to fail at the setup phase before any individual test could run, producing a cryptic error message that obscured the root cause.

**Resolution:**  
Corrected the syntax error in the Firestore mock definition within `jest.setup.js`.

---

### Bug 8 — Wishlist errors and profile name change not reflecting correctly

**Identified in:** `feat/ProfileChanges` branch (PR #135)  
**Commits:** `fcc8b03`

**Description:**  
Two related issues were found during the integration of wishlist and profile features: (a) the wishlist feature had logic errors causing incorrect state updates or missing data, and (b) the profile name change form was not correctly persisting or reflecting changes in the UI after submission.

**Resolution:**  
Corrected the wishlist logic errors and implemented the profile name change flow, ensuring that name updates are persisted to Firestore and reflected in the UI immediately after the user submits the form.

---

### Bug 9 — Profile photo upload fails or does not persist correctly

**Identified in:** `feat/ProfileChanges` branch (PR #138)  
**Commits:** `b3c7f94`, `2df5bc5`

**Description:**  
The initial implementation of profile photo uploads using Firebase Storage was unreliable and occasionally failed to return a valid download URL, or the URL was not correctly persisted to the user's Firestore document.

**Resolution:**  
Refactored the `uploadProfilePhoto` service to convert the selected image into a Firestore-safe data URI (base64). Added size validation to ensure the data URI fits within Firestore's document size limits. This simplified the persistence logic and improved reliability.

---

### Bug 10 — HomeScreen search tests failing after UI changes

**Identified in:** `feat/filterListings` branch (PR #137)  
**Commits:** `88063af`

**Description:**  
After implementing the filtering system and updating the empty state messaging, the unit tests for `HomeScreen` started failing because they were looking for the old "No results found for" text. Additionally, some async state updates in the search bar were not being correctly wrapped in `act()`.

**Resolution:**  
Updated the `HomeScreen` tests to match the new empty state text ("No results found for your filters") and wrapped the search text change events in `act()` to ensure all state updates are processed before assertions.

---

## Infrastructure Changes (Not Bugs, But Notable)

| Change | Commit(s) | Notes |
|---|---|---|
| Added ESLint code quality step to CI pipeline | `08c4445` | Part of deployment pipeline PR #126 |
| Reorganised test folders to `tests/unit/` and `tests/acceptance/` | `af07024` | Cleaner separation of test types |
| Configured EAS Build in CI for Android APK generation | `55e11d1` (PR #126) | Build step only triggers on `main` pushes |
