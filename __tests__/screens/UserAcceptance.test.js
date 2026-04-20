import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../../App';

jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  const destructiveButton = buttons?.find((button) => button.text === 'Log Out');
  destructiveButton?.onPress?.();
});

const mockRegisteredUsers = new Map();

jest.mock('../../src/services/authService', () => ({
  registerUser: jest.fn().mockImplementation(async ({ email, password }) => {
    const user = {
      id: 'mock-user-123',
      email,
      password,
      name: email.split('@')[0],
      memberSince: 'Mock Member',
      joinedDate: 'Mock Date',
      photo: 'https://i.pravatar.cc/150?u=mock',
      communities: ['FEUP'],
      course: 'Informatics',
      phone: '+351 900 000 000',
      isPhonePublic: false,
      rating: 5.0,
      reviewsCount: 0,
      totalListings: 0,
    };

    mockRegisteredUsers.set(email, user);
    return user;
  }),

  loginUser: jest.fn().mockImplementation(async ({ email, password }) => {
    const user = mockRegisteredUsers.get(email);

    if (!user || user.password !== password) {
      throw new Error('We could not find an account with those credentials.');
    }

    return user;
  }),

  logoutUser: jest.fn().mockResolvedValue(),

  subscribeToAuthState: jest.fn((callback) => {
    callback(null);
    return jest.fn();
  }),
}));

describe('User Acceptance Tests (UAT) - account creation and login', () => {
  beforeEach(() => {
    mockRegisteredUsers.clear();
    jest.clearAllMocks();
  });
  test('UAT-01: user can create an account with valid data and lands in the main app', async () => {
    const screen = render(<App />);

    fireEvent.press(screen.getByTestId('welcome-get-started-button'));
    fireEvent.changeText(screen.getByTestId('signup-email-input'), 'henrique@fe.up.pt');
    fireEvent.changeText(screen.getByTestId('signup-password-input'), '123456');
    fireEvent.press(screen.getByTestId('signup-submit-button'));

    await waitFor(() => expect(screen.getByTestId('main-app-screen')).toBeTruthy());
    expect(screen.getByTestId('home-feed-screen')).toBeTruthy();
  });

  test('UAT-02: invalid signup data is rejected', async () => {
    const screen = render(<App />);

    fireEvent.press(screen.getByTestId('welcome-get-started-button'));
    fireEvent.changeText(screen.getByTestId('signup-email-input'), 'bad-email');
    fireEvent.changeText(screen.getByTestId('signup-password-input'), '123');
    fireEvent.press(screen.getByTestId('signup-submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('signup-email-input-error').props.children).toBe(
        'Please enter a valid email address.',
      );
      expect(screen.getByTestId('signup-password-input-error').props.children).toBe(
        'Password must have at least 6 characters.',
      );
    });
  });

  test('UAT-03: registered user can log in after logging out', async () => {
    const screen = render(<App />);

    fireEvent.press(screen.getByTestId('welcome-get-started-button'));
    fireEvent.changeText(screen.getByTestId('signup-email-input'), 'ana@fe.up.pt');
    fireEvent.changeText(screen.getByTestId('signup-password-input'), '123456');
    fireEvent.press(screen.getByTestId('signup-submit-button'));

    await waitFor(() => expect(screen.getByTestId('main-app-screen')).toBeTruthy());

    fireEvent.press(screen.getByTestId('tab-profile'));
    await waitFor(() => expect(screen.getByTestId('private-profile-screen')).toBeTruthy());
    fireEvent.press(screen.getByTestId('logout-button'));

    await waitFor(() => expect(screen.getByTestId('welcome-screen')).toBeTruthy());

    fireEvent.press(screen.getByTestId('welcome-login-button'));
    fireEvent.changeText(screen.getByTestId('login-email-input'), 'ana@fe.up.pt');
    fireEvent.changeText(screen.getByTestId('login-password-input'), '123456');
    fireEvent.press(screen.getByTestId('login-submit-button'));

    await waitFor(() => expect(screen.getByTestId('main-app-screen')).toBeTruthy());
    expect(screen.getByTestId('home-feed-screen')).toBeTruthy();
  });

  test('UAT-04: login with unknown credentials is rejected', async () => {
    const screen = render(<App />);

    fireEvent.press(screen.getByTestId('welcome-login-button'));
    fireEvent.changeText(screen.getByTestId('login-email-input'), 'ghost@fe.up.pt');
    fireEvent.changeText(screen.getByTestId('login-password-input'), '123456');
    fireEvent.press(screen.getByTestId('login-submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('login-error-message').props.children).toBe(
        'We could not find an account with those credentials.',
      );
    });
  });
});