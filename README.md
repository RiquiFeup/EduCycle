<div align="center">
  <h1>EduCycle</h1>
  <p><strong>Your campus. Your materials. Circular.</strong></p>
  <p>A student marketplace giving school and university materials a second life.</p>

  <p>
    <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native">
    <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo">
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License: MIT"></a>
  </p>

  <p>
    <img src="docs/imgs/mockups/WelcomePage.png" alt="EduCycle welcome screen mockup" width="230">
    <img src="docs/imgs/mockups/ItemPage.png" alt="Academic material listing mockup" width="230">
    <img src="docs/imgs/mockups/ChatPage.png" alt="Student chat and swap proposal mockup" width="230">
  </p>
  <p><em>Original interface mockups: welcome, item details and direct messaging.</em></p>

  <p>
    <a href="#about-the-project">About</a> ·
    <a href="#interface-gallery">Interface gallery</a> ·
    <a href="#getting-started">Getting started</a> ·
    <a href="#architecture-and-design">Architecture</a> ·
    <a href="docs/development-report.md">Development report</a>
  </p>
</div>

## About the Project

**EduCycle** is a mobile application developed for **Engenharia de Software (ES)** at **FEUP**. It helps students, families and educators discover and reuse school and academic materials, organised around the academic journey.

The product vision is simple: make educational materials **more affordable, accessible and sustainable**. Instead of leaving textbooks and supplies unused after a semester, students can find them a new home through a marketplace built for their needs.

This repository presents the team's **React Native + Expo** implementation, backed by **Firebase Authentication and Firestore**, together with the original mockups, architecture diagrams and course documentation.

## Features

- **Accounts and profiles:** email registration, sign-in and editable user profiles.
- **Listing creation:** add photos, describe an item and specify its condition and academic category.
- **Discovery:** browse listings, search, filter and sort the feed.
- **Wishlist:** save listings to revisit later.
- **Direct messaging:** communicate with other users about materials and purchase arrangements.
- **Shopping cart and purchase requests:** collect items and initiate a purchase request.
- **Light and dark themes:** switch the application's appearance.

The broader product vision includes selling, swapping and lending materials, institution communities, payments and shipping integrations. The [development report](docs/development-report.md) records that scope and the team's sprint work.

## Interface Gallery

These are the **original UI mockups** created during the design phase. They illustrate the intended flows and may differ from the implemented screens.

### Welcome and Authentication

<p align="center">
  <img src="docs/imgs/mockups/WelcomePage.png" alt="Welcome page mockup" width="230">
  <img src="docs/imgs/mockups/LoginPage.png" alt="Login page mockup" width="230">
  <img src="docs/imgs/mockups/CreateAccountPage.png" alt="Create account page mockup" width="230">
</p>

### Browsing and Discovery

<p align="center">
  <img src="docs/imgs/mockups/HomePage.png" alt="Home feed and search filters mockup" width="520">
  <img src="docs/imgs/mockups/ItemPage.png" alt="Item details mockup showing condition, price and seller" width="230">
</p>

### Listings and Shopping

<p align="center">
  <img src="docs/imgs/mockups/ListingPage.png" alt="New listing form mockup" width="250">
  <img src="docs/imgs/mockups/ShoppingCartPage.png" alt="Shopping cart mockup" width="250">
</p>

### Community and Chat

<p align="center">
  <img src="docs/imgs/mockups/HubPage.png" alt="Faculty community hubs mockup" width="250">
  <img src="docs/imgs/mockups/ChatPage.png" alt="Direct messaging and swap proposal mockup" width="250">
</p>

### Profiles

<p align="center">
  <img src="docs/imgs/mockups/EditProfilePage.png" alt="Edit profile mockup" width="250">
  <img src="docs/imgs/mockups/ProfileViewPage.png" alt="Profile view and published listings mockup" width="250">
</p>

## Built With

| Technology | Role |
|---|---|
| **React Native + React** | Mobile interface and component architecture |
| **Expo** | Development tooling and platform builds |
| **Firebase Authentication** | User accounts and sign-in |
| **Cloud Firestore** | Application data |
| **Jest + React Native Testing Library** | Unit and component tests |
| **Maestro** | Acceptance test flows |
| **ESLint** | Static code analysis |
| **GitHub Actions + EAS** | Test pipeline and Android build workflow |

## Getting Started

### Prerequisites

- Node.js and npm; the repository's CI uses **Node.js 20**.
- Expo Go on a physical device, an Android development environment, or Xcode on macOS for iOS development.
- Access to the Firebase project configured in `src/utils/firebase.js`, or your own Firebase project configuration.

### Installation

```sh
git clone https://github.com/RiquiFeup/EduCycle.git
cd EduCycle
npm ci --legacy-peer-deps
npm start
```

The Expo CLI is included with the project; no global Expo CLI installation is needed.

### Run on a Platform

```sh
# Android emulator or connected device
npm run android

# iOS simulator (macOS with Xcode)
npm run ios

# Web development server
npm run web
```

## Testing

```sh
# Unit and component tests
npm test

# Coverage report
npm run test:coverage

# Lint source files and tests
npm run lint

# Acceptance flows (requires Maestro and a running app)
npm run e2e
```

## Architecture and Design

The diagrams below preserve the team's original design documentation. Some planned components and integrations extend beyond the current implementation.

### Domain Model

The domain model describes the relationships between users, listings, organisations, conversations and transactions.

<p align="center">
  <a href="docs/imgs/Domain.png"><img src="docs/imgs/Domain.png" alt="EduCycle domain model" width="850"></a>
</p>

### Logical Architecture

<p align="center">
  <a href="docs/imgs/Logical.drawio.png"><img src="docs/imgs/Logical.drawio.png" alt="Original EduCycle logical architecture diagram" width="850"></a>
</p>

### Physical Architecture

<p align="center">
  <a href="docs/imgs/Physical.drawio.png"><img src="docs/imgs/Physical.drawio.png" alt="Original EduCycle physical architecture diagram" width="850"></a>
</p>

### Project Structure

```text
EduCycle/
├── App.js                   # Application entry and navigation
├── assets/                  # App icons and splash assets
├── src/
│   ├── components/          # Reusable interface elements
│   ├── contexts/            # User and theme state
│   ├── data/                # Sample listing and conversation data
│   ├── screens/             # Authentication, listings, chat and profiles
│   ├── services/            # Authentication and application data operations
│   └── utils/               # Firebase setup, validation, sorting and theme
├── tests/                   # Automated tests and acceptance flows
├── docs/
│   ├── imgs/                # Mockups, diagrams and sprint boards
│   ├── development-report.md
│   └── report_survey_results.md
└── .github/workflows/       # CI and Android build pipeline
```

## Development Documentation

- [Full development report](docs/development-report.md): product vision, requirements, mockups, sprint boards and retrospectives.
- [User survey and backlog prioritisation](docs/report_survey_results.md).
- [Development guidelines](DEVELOPMENT_GUIDELINES.md).
- [Changelog](CHANGELOG.MD).
- [Original course repository](https://github.com/LEIC-ES-2025-26-2LEIC02/T3).

## Team

Developed for **LEIC-ES · FEUP · 2025/2026**, group **T3**.

- Afonso Cabral
- Artur Ferro
- Guilherme Nunes
- Henrique Pereira
- João Leppanen

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

GitHub: [@RiquiFeup](https://github.com/RiquiFeup)
