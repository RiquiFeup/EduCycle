import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import MainAppScreen from '../../../src/screens/MainAppScreen';

describe('MainAppScreen Tests', () => {
  it('renders correctly and displays the tab bar', () => {
    render(<MainAppScreen />);

    expect(screen.getByTestId('main-app-screen')).toBeTruthy();
    expect(screen.getByTestId('main-tab-bar')).toBeTruthy();
    
    // Check initial tab labels
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Sell')).toBeTruthy();
    expect(screen.getByText('Inbox')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('switches tabs properly when pressed', () => {
    render(<MainAppScreen />);
    
    // Initial state is Home screen
    expect(screen.getByTestId('home-feed-screen')).toBeTruthy();
    
    // Press Saved tab
    fireEvent.press(screen.getByTestId('tab-saved'));
    expect(screen.getByTestId('placeholder-saved-screen')).toBeTruthy();
    
    // Press Inbox tab
    fireEvent.press(screen.getByTestId('tab-messages'));
    expect(screen.getByTestId('inbox-screen')).toBeTruthy();
  });
});

