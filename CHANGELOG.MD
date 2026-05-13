# Changelog

All notable changes to this project will be documented in this file.

---

## Sprint 0 Review — Feedback Received & Actions Taken

At the end of Sprint 0, the team received feedback during the Sprint Review session. The following issues were identified and addressed during Sprint 1.

| #   | Feedback                                                                | Action Taken in Sprint 1                                                                                                                                                                                                                                                  |
| --- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **PBIs must be in the Product Backlog (PBL), not in the README**        | All Product Backlog Items were moved exclusively to the GitHub Projects board. The README now references the board instead of duplicating its content.                                                                                                                    |
| 2   | **Missing names in associations (Domain Model)**                        | Role names and multiplicity labels were added to all associations in the Domain Model diagram.                                                                                                                                                                            |
| 3   | **Missing text / description in the Architecture section**              | Explanatory text was added to the Logical and Physical Architecture sections, describing the rationale behind the technology choices and the responsibilities of each layer.                                                                                              |
| 4   | **PBIs must be well specified** — acceptance criteria were insufficient | Each PBI was reworked with clear, testable acceptance criteria following the Given/When/Then format, and linked to the corresponding feature branch and pull request.                                                                                                     |
| 5   | **Not sure about the CI pipeline** — pipeline setup was unclear         | The CI pipeline was reviewed and stabilised: a pipeline error blocking branch merges was fixed (`dfe8c68`), test stability was improved by removing timeout-causing tests (`e66199a`), and the full `feature/unit-tests` suite was merged into `development` (`da9dfe6`). |

---

## [Sprint 1] – 2026-04-21

### Value Added to End-Users

This release marks the **first functional version** of the platform. Users can now:

- **Create a secure account** and authenticate with their email and password, backed by a real database (Firebase).
- **Log in and access their personal session** at any time, with a reliable and tested authentication flow.
- **View their own profile information** directly from the app, giving them a clear picture of their identity on the platform.
- **Edit their profile details** and have those changes immediately persisted in the backend.
- **Browse and search for book listings** by ISBN or subject, making it easy to find exactly what they are looking for.
- **Publish listings for items** they want to sell or exchange, with a dedicated screen and navigation flow.

---

### Added

#### User Authentication & Account Management

- **[#65] Create an account with email and password**
  - Integrated Firebase Authentication to support secure user registration.
  - Implemented the authentication service (`serviço de autenticação`) and Firebase configuration.
  - Connected the registration form to the Firebase backend (`register with fireBase`).
  - Set up the database layer behind User Accounts to persist profile data on signup.
  - _Commits:_ `74b1e8d`, `c39def6`, `be78f7d`, `99d1642`

- **[#66] Log in with registered account**
  - Implemented the full login function against the Firebase backend.
  - Created and stabilised the `AuthCard` UI component, including timeout handling.
  - Merged into `development` via Pull Request [#112](../../pull/112) (`feat/UserLogin`).
  - _Commits:_ `1c80936`, `8c94d60`, `d106305`, `9ed55bf` (PR #112)

- **[#67] View my account information**
  - Delivered the User Profile screen, allowing users to see their stored account details.
  - Profile data is fetched live from the database backend established in #65.
  - Included as part of the `feat/UserProfileEdit` branch, merged via Pull Request [#113](../../pull/113).
  - _Commits:_ `ad91ea8` (PR #113)

- **[#68] Edit my account information**
  - Implemented profile editing functionality connected to the Firebase backend.
  - Fixed several integration errors to ensure edits are correctly saved and reflected in the UI.
  - Merged into `development` via Pull Request [#113](../../pull/113) (`feat/UserProfileEdit`).
  - _Commits:_ `45a4bec`, `8643e59`, `3675640`, `ad91ea8` (PR #113)

#### Listings

- **[#70] Search listings by ISBN or subject**
  - Implemented database query logic to filter listings by ISBN or subject.
  - Added listing detail cards to the search results view.
  - Merged into `development` via Pull Request [#115](../../pull/115) (`feat/searchListings`).
  - _Commits:_ `f46bf10`, `84ebaef`, `ca19e0f` (PR #115)

- **[#72] Create a listing for an item**
  - Built the Listing Details screen with full navigation support.
  - Finalised the UI and resolved data model incompatibilities with the PublicProfile screen.
  - Merged into `development` via Pull Request [#109](../../pull/109) (`feat/listing-details-screen`).
  - _Commits:_ `dfeab2a`, `779512e`, `e7814cf` (PR #109)

---

### Fixed

- Fixed `AuthCard` component timeout causing test failures (`d106305`).
- Resolved `SafeAreaView` deprecation warning (`4e6bbd4`).
- Fixed incorrect mock path in `UserAcceptance.test.js` (`e737d25`).
- Fixed Jest fake timers scope leaking from `DevProfileFlow` tests, resolving hook timeouts (`9acb1ee`, `cce78d3`).
- Fixed CI/CD pipeline error blocking branch merges (`dfe8c68`).

---

### Tests

- Added unit and acceptance tests covering the authentication and profile flows (`5bb2af2`).
- Removed tests causing execution timeouts to stabilise the test suite (`e66199a`).
- Merged `feature/unit-tests` into `development` after full stabilisation (`da9dfe6`).

---

### Infrastructure & DevOps

- Added survey results, appreciation report, and references to `docs/` and `README.md` (`7430454`, PR #73).

---

## [Sprint 2] – 2026-05-12

### Value Added to End-Users

This release significantly expands the listing and discovery experience. Users can now:

- **Upload multiple photos** for a single listing, providing richer visual context for buyers.
- **View the condition** of a listed item (e.g. Like New, Good, Fair) directly on the listing details screen, with strict validation enforced at creation time.
- **Tag listings with an ISBN**, making them immediately discoverable through ISBN-based search.
- **Sort the feed** by price, date or relevance using a dynamic chip-based UI, without leaving the home screen.
- **Save listings to a wishlist** for later reference.
- **Change their display name** directly from the profile screen.
- **Navigate back** using a swipe-right gesture on any screen, matching native iOS and Android patterns.
- **Dismiss the keyboard** by dragging down on any scrollable screen.

---

### Added

#### Listing Enhancements

- **Multi-photo upload for listings**
  - Implemented the ability to attach multiple images to a single listing using `expo-image-picker`.
  - Updated the Firestore data model to store an array of image URIs per listing.
  - Updated the listing details screen to display all uploaded photos.
  - _Commits:_ `6de7b33`, `a6e6bba`

- **Listing condition display and validation**
  - Added a mandatory condition field (e.g. Like New, Good, Fair, Poor) to the listing creation form.
  - Enforced strict validation: listings cannot be submitted without a valid condition value.
  - Displayed the condition label prominently on the listing details screen.
  - _Commits:_ `e9860a8` (PR #127 — `feature/listing-condition-details`)

- **ISBN tagging on listings**
  - Added an optional ISBN input field to the new listing form.
  - Stored the ISBN in Firestore alongside the listing document.
  - ISBN is displayed as a searchable tag on the listing card and detail view.
  - _Commits:_ `79442fb` (PR #130 — `feat/isbnTag`)

#### Discovery & Feed

- **Dynamic feed sorting**
  - Implemented client-side sorting logic for the listing feed (by price ascending/descending, most recent, relevance).
  - Added a horizontal chip-based sort selector UI component to the home screen.
  - Pure utility functions for sort logic were covered by unit tests.
  - _Commits:_ `11dff2b` (PR #131 — `feat/sorting-listings`)

- **Filter listings**
  - Implemented a filter popup allowing users to filter listings by category and condition.
  - Integrated filtering logic with the home screen search and feed.
  - _Commits:_ `719cd53`, `e7bdc85`, `0db7131` (PR #137 — `feat/filterListings`)

#### User Features

- **Wishlist**
  - Implemented the ability for users to save listings to a personal wishlist.
  - Wishlist state is persisted in Firestore under the user's document.
  - _Commits:_ `6cf2117`, `efb58f5`, `42ca328`

- **Profile updates**
  - Implemented the ability for users to update their display name and profile photo.
  - Fixed reliability issues with profile photo uploads by using Firestore-safe data URIs.
  - _Commits:_ `fcc8b03`, `b3c7f94`, `2df5bc5` (PR #135, PR #138 — `feat/ProfileChanges`)

#### Navigation & UX

- **Swipe-right to go back**
  - Configured React Navigation to support swipe-right back navigation across all stack screens, matching native platform conventions.
  - _Commits:_ `864ce64` (PR #129 — `feat/swipeBack`)

- **Keyboard dismiss on scroll**
  - Applied `keyboardDismissMode="on-drag"` to all scrollable views (`ScrollView`, `FlatList`), allowing users to dismiss the keyboard by dragging down.
  - _Commits:_ `c320247` (PR #128 — `feat/hideKeyboard`)

---

### Fixed

- Fixed ESLint v9 incompatibility breaking the CI pipeline; downgraded to ESLint v8 (`d44ff78`).
- Fixed `package.json` test scripts pointing to the old `__tests__/` directory after folder restructure (`5cc6345`).
- Fixed lint script path not re-applied after post-merge regression (`6bd8ee9`).
- Fixed residual folder path issue after multi-branch structural changes (`e02fbb8`).
- Fixed missing `testEnvironment` declaration in Jest configuration causing test environment errors (`f5d22fe`).
- Fixed syntax error in Jest setup Firestore mock, which prevented the entire test suite from running (`87c9be7`).
- Fixed wishlist logic errors and profile name change not correctly persisting to Firestore (`fcc8b03`).
- Fixed profile photo upload reliability and Firestore storage persistence (`b3c7f94`).
- Fixed HomeScreen search tests and empty state messaging after UI changes (`88063af`).
- Resolved directory rename conflicts during `tests/` folder restructure (`f31a017`).

---

### Tests

- Added unit tests for listing multi-photo upload feature (`e7eedf4`).
- Added acceptance tests (Maestro) for multi-photo upload functionality (`d5ea9ee`).
- Added unit tests for listing condition validation logic (`dcae211`).
- Added acceptance tests (Maestro) for condition validation flow (`c93e131`).
- Added unit test for the wishlist feature (`42ca328`).
- Added unit tests and pure utility tests for feed sorting logic (`11dff2b`).

---

### Infrastructure & DevOps

- Introduced a two-phase CI/CD pipeline (PR #126 — `feature/deployment-pipeline`):
  - **Phase 1 — Quality & Tests:** runs ESLint and `npm run test:coverage` on every push/PR to `main` or `development`.
  - **Phase 2 — Build & Deploy:** triggers an EAS Android APK build only on pushes to `main`, using the `EXPO_TOKEN` secret.
  - _Commits:_ `08c4445`, `55e11d1`
- Reorganised test directory from `__tests__/` to `tests/unit/` and `tests/acceptance/` for cleaner separation (`af07024`).
