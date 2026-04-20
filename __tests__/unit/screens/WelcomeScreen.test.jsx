import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import WelcomeScreen from '../../../src/screens/WelcomeScreen';

describe('WelcomeScreen Aprofundados', () => {
  it('renderiza os botoes expectaveis e reage aos onClicks', () => {
    const mockOnGetStarted = jest.fn();
    const mockOnLoginPress = jest.fn();
    
    render(<WelcomeScreen onGetStarted={mockOnGetStarted} onLoginPress={mockOnLoginPress} />);

    expect(screen.getByTestId('welcome-screen')).toBeTruthy();
    
    fireEvent.press(screen.getByTestId('welcome-get-started-button'));
    expect(mockOnGetStarted).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByTestId('welcome-login-button'));
    expect(mockOnLoginPress).toHaveBeenCalledTimes(1);
  });
});
