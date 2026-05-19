// Aqui no futuro vamos poder adicionar mocks globais para:
// - AsyncStorage
// - React Navigation
// - Outros módulos nativos

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

process.env.RNTL_SKIP_AUTO_CLEANUP = 'true';
jest.setTimeout(30000);

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mocks globais do Firebase. Sem "requireActual". Tudo falso.
jest.mock('firebase/app', () => ({ initializeApp: jest.fn(() => ({})) }));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({
    user: { uid: 'mock-user-id', email: 'mock@fe.up.pt' },
  })),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({
    user: { uid: 'mock-user-id', email: 'mock@fe.up.pt' },
  })),
  signOut: jest.fn(() => Promise.resolve()),
  getAuth: jest.fn(),
  initializeAuth: jest.fn(() => ({ currentUser: { uid: 'mock-user-id' } })),
  getReactNativePersistence: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()),
  updateProfile: jest.fn(() => Promise.resolve()),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  doc: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) })),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mock-id' })),
  updateDoc: jest.fn(() => Promise.resolve()),
  serverTimestamp: jest.fn(() => 'mock-server-timestamp'),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
  ref: jest.fn((_, path) => ({ path })),
  uploadBytes: jest.fn(() => Promise.resolve()),
  uploadString: jest.fn(() => Promise.resolve()),
  getDownloadURL: jest.fn(() => Promise.resolve('https://mock.url/profile.jpg')),
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true, status: 'granted' })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true, status: 'granted' })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ canceled: true, assets: [] })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true, assets: [] })),
}));

jest.mock('expo-file-system/legacy', () => ({
  FileSystemUploadType: { BINARY_CONTENT: 0, MULTIPART: 1 },
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: true, size: 1024 })),
  readAsStringAsync: jest.fn(() => Promise.resolve('mock-base64')),
  uploadAsync: jest.fn(() => Promise.resolve({
    status: 200,
    body: JSON.stringify({ downloadTokens: 'mock-token' }),
  })),
}));

// Mock do teu ficheiro local para bloquear totalmente o SDK real
jest.mock('../../src/utils/firebase', () => ({
  db: {},
  auth: { currentUser: { uid: 'mock-user-id', getIdToken: jest.fn(() => Promise.resolve('mock-id-token')) } },
  storage: { app: { options: { storageBucket: 'mock-bucket.appspot.com' } } },
}));

// Mock do ThemeContext useTheme hook
const LIGHT_COLORS = {
  primary: '#2F7657',
  primarySoft: '#E5EFE9',
  primaryBorder: '#8EBAA4',
  background: '#FFFFFF',
  page: '#ECE8E3',
  surface: '#F8F6F3',
  cardInput: '#FFFEFC',
  text: '#274936',
  textSecondary: '#63756A',
  textMuted: '#919B95',
  border: '#E7E3DE',
  borderSoft: '#EBE7E1',
  borderDark: '#D8DDD9',
  badgeBackground: '#F5F5F5',
  danger: '#C54B45',
  dangerBackground: '#FFF5F5',
  dangerBorder: '#F2C4C1',
  toggleActive: '#A8D5BA',
  toggleInactive: '#F4F3F1',
  buttonGray: '#F9F9F9',
};

jest.mock('../../src/contexts/ThemeContext', () => ({
  useTheme: jest.fn(() => ({
    colors: LIGHT_COLORS,
    isDark: false,
    toggleTheme: jest.fn(),
  })),
  ThemeContext: jest.fn(),
  ThemeProvider: ({ children }) => children,
}));

const originalWarn = console.warn;
jest.spyOn(console, 'warn').mockImplementation((...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Setting a timer') || args[0].includes('process.env.EXPO_OS'))
  ) {
    return;
  }
  originalWarn(...args);
});