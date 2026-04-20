import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CommunityBadge from '../../../src/components/CommunityBadge';

describe('CommunityBadge', () => {
  it('renders badge with correct text', () => {
    render(<CommunityBadge name="Top Rated" />);
    expect(screen.queryByText(/Top Rated/i)).toBeTruthy();
  });
});