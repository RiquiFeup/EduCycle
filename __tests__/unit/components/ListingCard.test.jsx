import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ListingCard from '../../../src/components/ListingCard';

describe('ListingCard', () => {
  const mockListing = {
    id: '1',
    title: 'Mock Listing',
    price: 100,
    condition: 'New',
    image: 'mock-uri',
  };

  it('renders correctly with basic props', () => {
    const onPressMock = jest.fn();
    render(<ListingCard listing={mockListing} onPress={onPressMock} />);

    expect(screen.getByText('Mock Listing')).toBeTruthy();
    
    // Testa interação
    const card = screen.getByText('Mock Listing');
    fireEvent.press(card);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
