import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import SignupScreen from '../../../src/screens/SignupScreen';

describe('SignupScreen', () => {
  it('renders signup form properly', () => {
    const navigationMock = { goBack: jest.fn(), navigate: jest.fn() };
    const onSignupMock = jest.fn();

    render(<SignupScreen navigation={navigationMock} onSignup={onSignupMock} />);

    expect(screen.getAllByText(/Create account/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/name@email.com/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/At least 6 characters/i)).toBeTruthy();
  });
});
