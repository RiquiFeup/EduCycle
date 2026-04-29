// Aqui no futuro vamos poder adicionar mocks globais para:
// - AsyncStorage
// - React Navigation
// - Outros módulos nativos

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
process.env.RNTL_SKIP_AUTO_CLEANUP = 'true';
jest.setTimeout(30000);
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mocks globais do Firebase. Sem "requireActual". Tudo falso.
jest.mock('firebase/app', () => ({ initializeApp: jest.fn() }));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(), // A função que estava a dar "not a function"
  orderBy: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) })),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mock-id' })),
  setDoc: jest.fn(() => Promise.resolve()),
  serverTimestamp: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(() => Promise.resolve()),
  getDownloadURL: jest.fn(() => Promise.resolve('https://mock.url/image.jpg')),
}));

// Mock do teu ficheiro local para bloquear totalmente o SDK real
jest.mock('../../src/utils/firebase', () => ({
  db: {},
  auth: {},
  storage: {},
}));

const originalWarn = console.warn;
jest.spyOn(console, 'warn').mockImplementation((...args) => {
  if (typeof args[0] === 'string' && (args[0].indexOf('Setting a timer') > -1 || args[0].indexOf('process.env.EXPO_OS') > -1)) return;
  originalWarn(...args);
});