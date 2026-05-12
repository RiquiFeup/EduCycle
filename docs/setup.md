# EduCycle — Setup Guide

This guide explains how to install, configure and run the **EduCycle** React Native / Expo project locally.

---

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

| Tool | Version | Notes |
|---|---|---|
| **Node.js** | 18.x | Exact version used by the CI pipeline |
| **npm** | bundled with Node.js | Used as the package manager |
| **Git** | any recent version | |
| **Expo CLI** | via `npx expo` | No global install needed |

You also need **one** of the following runtime environments to run the app:

- **Expo Go** app on a physical Android or iOS device (quickest option), or
- **Android Studio** with a configured Android emulator, or
- **Xcode** with an iOS Simulator (macOS only)

---

## 1. Clone the Repository

```bash
git clone https://github.com/LEIC-ES-2025-26-2LEIC02/T3.git
cd T3
```

---

## 2. Install Dependencies

Use `npm ci` with the `--legacy-peer-deps` flag. This matches the CI pipeline exactly and avoids peer dependency conflicts introduced by Expo and React 19.

```bash
npm ci --legacy-peer-deps
```

> **Do not use `npm install`** — it may resolve dependency versions differently from the lockfile and break the pipeline.

---

## 3. Firebase Configuration

The app uses **Firebase Authentication** and **Firebase Firestore**. The Firebase client is initialised in `src/utils/firebase.js`.

No additional `.env` file is required — the Firebase configuration is embedded directly in `src/utils/firebase.js`. If you are onboarding onto a different Firebase project (e.g. a staging environment), update that file with the corresponding Firebase config object from the Firebase Console.

---

## 4. Run the Application

### Start the Expo development server (recommended)

```bash
npm start
```

This opens the Expo Dev Tools in your browser. You can then:

- Press `a` to open on an Android emulator or connected device.
- Press `i` to open on an iOS Simulator (macOS only).
- Scan the QR code with **Expo Go** on your phone.

### Run directly on Android

```bash
npm run android
```
---

## 5. Run the Test Suite

### Run all unit tests

```bash
npm test
```

### Run tests in watch mode (reruns on file change)

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

### Run static code analysis (linting)

```bash
npm run lint
```

### Run end-to-end acceptance tests with Maestro

Requires the **Maestro** CLI to be installed. See [maestro.mobile.dev](https://maestro.mobile.dev) for installation instructions.

```bash
npm run e2e
```

---

## 6. Build a Distribution APK (EAS Build)

The project is configured with **Expo Application Services (EAS)** for remote builds. Builds are normally triggered automatically by the CI/CD pipeline on pushes to `main`, but you can trigger them manually:

### Install EAS CLI

```bash
npm install -g eas-cli
```

### Log in to your Expo account

```bash
eas login
```

### Build a preview APK (Android)

```bash
eas build --platform android --profile preview --non-interactive
```

Available EAS build profiles (defined in `eas.json`):

| Profile | Distribution | Notes |
|---|---|---|
| `development` | Internal | Requires Expo Dev Client |
| `preview` | Internal APK | Used for testing and review |
| `production` | Store | For production releases |

---

## 7. Continuous Integration

Every push or pull request to `main` or `development` triggers the **GitHub Actions** pipeline defined in `.github/workflows/ci.yml`. The pipeline runs in two phases:

1. **Quality & Tests** — runs `npm run lint` and `npm run test:coverage` on Node.js 18.x.
2. **Build & Deploy** (only on `main` pushes) — triggers an EAS build for the Android `preview` APK using the `EXPO_TOKEN` secret.

Make sure your branch passes the test suite before opening a pull request.
