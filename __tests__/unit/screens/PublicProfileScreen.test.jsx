import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PublicProfileScreen from '../../../src/screens/PublicProfileScreen';
import { UserProvider } from '../../../src/contexts/UserContext';

describe('PublicProfileScreen Tests', () => {
  const renderWithContext = (component) => {
    return render(
      <UserProvider>
        {component}
      </UserProvider>
    );
  };

  it('renders public profile in regular mode', () => {
    renderWithContext(<PublicProfileScreen isPreview={false} navigate={jest.fn()} />);

    expect(screen.getByTestId('public-profile-screen')).toBeTruthy();
    expect(screen.getByText('Seller Profile')).toBeTruthy();
    expect(screen.getByText('💬 Message')).toBeTruthy();
    expect(screen.getByText('✉️ Email')).toBeTruthy();
    expect(screen.getByText('Active Listings')).toBeTruthy();
  });

  it('renders public profile in preview mode', () => {
    renderWithContext(<PublicProfileScreen isPreview={true} navigate={jest.fn()} />);

    expect(screen.getByTestId('public-profile-screen')).toBeTruthy();
    // Preview header title
    expect(screen.getByText('👁️ Preview Mode')).toBeTruthy();
    expect(screen.getByText('Exit')).toBeTruthy();
    // Buttons should not show in preview
    expect(screen.queryByText('💬 Message')).toBeNull();
  });
});

