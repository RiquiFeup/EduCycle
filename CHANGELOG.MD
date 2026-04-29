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
