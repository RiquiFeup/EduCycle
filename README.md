<div align="center">
  <h1>EduCycle</h1>
  <p>Peer-to-peer academic marketplace — buy, sell, trade and lend educational materials.</p>

  [![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)](https://expo.dev/)
  [![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
  [![GitHub stars](https://img.shields.io/github/stars/RiquiFeup/EduCycle?style=social)](https://github.com/RiquiFeup/EduCycle)

  <!-- TODO: add images/logo.png -->
  <!-- TODO: add images/screenshot.png -->
</div>

---

## About The Project

**EduCycle** is a mobile-first peer-to-peer marketplace built exclusively for students, families, and educators. It enables users to buy, sell, trade, and lend used school and academic materials — organised by education level, discipline, and institution.

Unlike general second-hand platforms, EduCycle is designed around the academic journey:

- Listings are categorised by **school level** (Básica, Secundária, Faculdade).
- Private **community spaces** can be created and joined via invite code for specific schools.
- **Escrow-backed payments** (card, MB Way, Multibanco) protect both parties until delivery is confirmed.
- **Direct messaging** between buyers and sellers is built in for negotiation and coordination.

The app is built with React Native and Expo for cross-platform support (Android & iOS), backed by Firebase for real-time data and authentication.

---

## Features

| Feature | Description |
|---|---|
| **SELL** | List individual items or packs with photos, condition rating and price |
| **TRADE** | Propose item-for-item trades with no monetary exchange |
| **LEND** | Make items available for a defined loan period |
| **SCHOOL LEVELS** | Browse by Básica (1st–9th), Secundária (10th–12th), or Faculdade |
| **ORGANISATIONS** | Private community spaces for specific schools via invite code |
| **CHAT** | Direct messaging between buyer and seller |
| **WISHLIST** | Save items and receive alerts when matching listings appear |
| **PACKS & DISCOUNTS** | Bundle multiple items or apply percentage discounts |
| **FILTERS & SEARCH** | Search by title, ISBN, author, subject; filter by level, condition, price, location |
| **PAYMENTS & ESCROW** | Secure payments held in escrow until delivery confirmation |
| **RATINGS & REVIEWS** | Rate and review after each completed transaction |
| **SHIPPING** | Pre-paid shipping label generation and native delivery tracking |

---

## Built With

[![React Native](https://img.shields.io/badge/React_Native-61DAFB?logo=react&logoColor=white&style=for-the-badge)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white&style=for-the-badge)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black&style=for-the-badge)](https://firebase.google.com/)
[![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white&style=for-the-badge)](https://jestjs.io/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white&style=for-the-badge)](https://eslint.org/)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- For Android: [Android Studio](https://developer.android.com/studio) with an emulator or a physical device
- For iOS: Xcode (macOS only)

### Installation

```bash
# Clone the repo
git clone https://github.com/RiquiFeup/EduCycle.git
cd EduCycle

# Install dependencies
npm install
```

### Running the App

```bash
# Start Expo dev server (scan QR with Expo Go app)
npm start

# Run on Android emulator / device
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Run in web browser
npm run web
```

---

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run end-to-end acceptance tests (requires Maestro)
npm run e2e

# Lint source files
npm run lint
```

---

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## Contact

GitHub: [@RiquiFeup](https://github.com/RiquiFeup)

---

[react-native-shield]: https://img.shields.io/badge/React_Native-0.81.5-61DAFB?logo=react&logoColor=white
[expo-shield]: https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white
[firebase-shield]: https://img.shields.io/badge/Firebase-11-FFCA28?logo=firebase&logoColor=black
[license-shield]: https://img.shields.io/badge/License-MIT-yellow.svg
[stars-shield]: https://img.shields.io/github/stars/RiquiFeup/EduCycle?style=social
