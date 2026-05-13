import React from 'react';
import { render, screen, fireEvent, waitFor , act} from '@testing-library/react-native';
import HomeScreen from '../../../../src/screens/main/HomeScreen';
import { getDocs } from 'firebase/firestore';

describe('HomeScreen Tests', () => {
  beforeEach(() => {
    // Injetamos os dados específicos que os novos testes da branch development procuram
    getDocs.mockResolvedValue({
      docs: [
        { id: '1', data: () => ({ title: 'Matemática A – 10.º Ano', price: '20', subject: 'Mathematics' }) },
        { id: '9', data: () => ({ title: 'Introdução à Programação', price: '15', subject: 'Computer Science' }) },
        { id: '2', data: () => ({ title: 'Física 11.º Ano – Resnick', price: '25', isbn: '978-0-471-32057' }) }
      ]
    });
  });

  it('renderiza o feed sem ir à internet', async () => {
    render(<HomeScreen navigate={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId('home-feed-screen')).toBeTruthy();
    }, { timeout: 5000 });

    expect(screen.getByText('Matemática A – 10.º Ano')).toBeTruthy();
  });

  it('filters listings when searching by subject', async () => {
    render(<HomeScreen navigate={jest.fn()} />);
    await waitFor(() => screen.getByPlaceholderText('Search by title, ISBN, or subject...'));
    const searchInput = screen.getByPlaceholderText('Search by title, ISBN, or subject...');

    await act(async () => {
      fireEvent.changeText(searchInput, 'Computer Science');
    });

    expect(screen.getByText('Introdução à Programação')).toBeTruthy();
  });

  it('filters listings when searching by ISBN', async () => {
    render(<HomeScreen navigate={jest.fn()} />);
    await waitFor(() => screen.getByPlaceholderText('Search by title, ISBN, or subject...'));
    const searchInput = screen.getByPlaceholderText('Search by title, ISBN, or subject...');

    await act(async () => {
      fireEvent.changeText(searchInput, '978-0-471-32057');
    });

    expect(screen.getByText('Física 11.º Ano – Resnick')).toBeTruthy();
  });

  it('shows contextual empty state when no results match', async () => {
    render(<HomeScreen navigate={jest.fn()} />);
    await waitFor(() => screen.getByPlaceholderText('Search by title, ISBN, or subject...'));
    const searchInput = screen.getByPlaceholderText('Search by title, ISBN, or subject...');
    
    await act(async () => {
      fireEvent.changeText(searchInput, 'XyZ_Impossible_Search_Term');
    });
    
    expect(screen.getByTestId('empty-state')).toBeTruthy();
    expect(screen.getByTestId('empty-state-text').props.children).toBe(
      'No results found for your filters'
    );
    expect(screen.getByText('Try adjusting your search or clearing your filters.')).toBeTruthy();
  });

  it('navigates to listing details when a result is pressed', async () => {
    const navigateMock = jest.fn();
    render(<HomeScreen navigate={navigateMock} />);

    await waitFor(() => screen.getByText('Matemática A – 10.º Ano'));
    const firstListing = screen.getByText('Matemática A – 10.º Ano');
    fireEvent.press(firstListing);

    expect(navigateMock).toHaveBeenCalledWith('ListingDetails', expect.objectContaining({
      listing: expect.objectContaining({ id: '1' }),
    }));
  });

  it('updates the sort direction when the toggle button is pressed', async () => {
    render(<HomeScreen navigate={jest.fn()} />);

    // Wait for the feed to render
    await waitFor(() => {
      expect(screen.getByTestId('home-feed-screen')).toBeTruthy();
    }, { timeout: 5000 });

    // 1. Check default state (Descending)
    expect(screen.getByText('↓')).toBeTruthy();

    // 2. Press the toggle button
    const toggleButton = screen.getByText('↓');
    
    // Using act() tells Jest to wait for all internal FlatList background 
    // updates to finish before moving on to the next line.
    await act(async () => {
      fireEvent.press(toggleButton);
    });

    // 3. Verify it changed to Ascending
    await waitFor(() => {
      expect(screen.getByText('↑')).toBeTruthy();
    });
  });

});