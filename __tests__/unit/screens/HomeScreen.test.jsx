import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../../src/screens/HomeScreen';

describe('HomeScreen Tests', () => {
  it('renders home screen correctly and displays header elements', () => {
    render(<HomeScreen navigate={jest.fn()} />);

    expect(screen.getByTestId('home-feed-screen')).toBeTruthy();
    expect(screen.getByText('EduCycle')).toBeTruthy();
    expect(screen.getByTestId('home-notifications-button')).toBeTruthy();
  });

  it('renders search bar and accepts text input', () => {
    render(<HomeScreen navigate={jest.fn()} />);
    
    // Test the search bar with updated placeholder
    const searchInput = screen.getByPlaceholderText('Search by title, ISBN, or subject...');
    expect(searchInput).toBeTruthy();
    
    fireEvent.changeText(searchInput, 'Math');
    expect(searchInput.props.value).toBe('Math');
  });

  it('filters listings when searching by subject', () => {
    render(<HomeScreen navigate={jest.fn()} />);
    const searchInput = screen.getByPlaceholderText('Search by title, ISBN, or subject...');

    // "Computer Science" is the subject for "Introdução à Programação" (id 9)
    fireEvent.changeText(searchInput, 'Computer Science');

    expect(screen.getByText('Introdução à Programação')).toBeTruthy();
  });

  it('filters listings when searching by ISBN', () => {
    render(<HomeScreen navigate={jest.fn()} />);
    const searchInput = screen.getByPlaceholderText('Search by title, ISBN, or subject...');

    // Search by partial ISBN for "Física 11.º Ano – Resnick"
    fireEvent.changeText(searchInput, '978-0-471-32057');

    expect(screen.getByText('Física 11.º Ano – Resnick')).toBeTruthy();
  });

  it('shows contextual empty state when no results match', () => {
    render(<HomeScreen navigate={jest.fn()} />);
    const searchInput = screen.getByPlaceholderText('Search by title, ISBN, or subject...');
    
    fireEvent.changeText(searchInput, 'XyZ_Impossible_Search_Term');
    
    expect(screen.getByTestId('empty-state')).toBeTruthy();
    expect(screen.getByTestId('empty-state-text').props.children).toContain(
      'No results found for'
    );
    expect(screen.getByText('Try a different title, ISBN, or subject.')).toBeTruthy();
  });

  it('navigates to listing details when a result is pressed', () => {
    const navigateMock = jest.fn();
    render(<HomeScreen navigate={navigateMock} />);

    // Tap the first listing card visible on screen
    const firstListing = screen.getByText('Matemática A – 10.º Ano');
    fireEvent.press(firstListing);

    expect(navigateMock).toHaveBeenCalledWith('ListingDetails', expect.objectContaining({
      listing: expect.objectContaining({ id: '1' }),
    }));
  });
});

