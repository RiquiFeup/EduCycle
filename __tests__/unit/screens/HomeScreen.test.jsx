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
    
    // Test the search bar
    const searchInput = screen.getByPlaceholderText('Search books, calculators, notes...');
    expect(searchInput).toBeTruthy();
    
    fireEvent.changeText(searchInput, 'Math');
    expect(searchInput.props.value).toBe('Math');
  });

  it('filters empty state when searching for nonexistent term', () => {
    render(<HomeScreen navigate={jest.fn()} />);
    const searchInput = screen.getByPlaceholderText('Search books, calculators, notes...');
    
    // Type something that likely won't match the mocked LISTINGS data
    fireEvent.changeText(searchInput, 'XyZ_Impossible_Search_Term');
    
    expect(screen.getByTestId('empty-state')).toBeTruthy();
    expect(screen.getByTestId('empty-state-text')).toBeTruthy();
  });
});

