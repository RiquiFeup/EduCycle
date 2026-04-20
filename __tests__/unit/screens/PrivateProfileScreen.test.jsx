import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PrivateProfileScreen from '../../../src/screens/PrivateProfileScreen';
import { UserProvider } from '../../../src/contexts/UserContext';

describe('PrivateProfileScreen Tests', () => {
  const renderWithContext = (component) => {
    return render(
      <UserProvider>
        {component}
      </UserProvider>
    );
  };

  it('renders private profile elements correctly', () => {
    renderWithContext(<PrivateProfileScreen navigate={jest.fn()} />);

    expect(screen.getByTestId('private-profile-screen')).toBeTruthy();
    expect(screen.getByText('EduCycle')).toBeTruthy();
    expect(screen.getByText('Edit Profile')).toBeTruthy();
    expect(screen.getByText('Privacy Settings')).toBeTruthy();
    expect(screen.getByTestId('logout-button')).toBeTruthy();
  });

  it('renders the mocked active listings', () => {
    renderWithContext(<PrivateProfileScreen navigate={jest.fn()} />);
    
    expect(screen.getByText('My Active Listings')).toBeTruthy();
    // Verify listing cards show up, we could search for testIds if they existed or just by components
  });
});

