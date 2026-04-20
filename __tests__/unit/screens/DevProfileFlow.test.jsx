import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import DevProfileFlow from '../../../src/screens/DevProfileFlow';

jest.useFakeTimers();

describe('DevProfileFlow Tests', () => {
  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    cleanup();
  });
  it('renders the dev directory menu by default', () => {
    render(<DevProfileFlow />);

    expect(screen.getByText('Dev Directory')).toBeTruthy();
    expect(screen.getByText('🏠 Go to Home Screen')).toBeTruthy();
    expect(screen.getByText('👤 Go to Public Profile (Seller View)')).toBeTruthy();
    expect(screen.getByText('⚙️ Go to Private Profile')).toBeTruthy();
  });

  it('navigates to another screen when a button is pressed', () => {
    render(<DevProfileFlow />);
    
    // Press the Home screen button
    fireEvent.press(screen.getByText('🏠 Go to Home Screen'));
    
    // Home screen should render (we check for the logo)
    expect(screen.getByText('EduCycle')).toBeTruthy();
    
    // And dev menu title should be gone
    expect(screen.queryByText('Dev Directory')).toBeNull();
    
    // The floating back button should appear
    expect(screen.getByText('← Dev Menu')).toBeTruthy();
  });
});

