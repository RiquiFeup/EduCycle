import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react-native';
import WishlistScreen from '../../../src/screens/WishlistScreen';
import { UserContext } from '../../../src/contexts/UserContext';

const savedListings = [
  {
    id: 'listing-1',
    title: 'Calculadora Gráfica Casio',
    price: '55',
    institution: 'FEUP',
    mode: 'sell',
  },
  {
    id: 'listing-2',
    title: 'Livro de Física',
    price: '20',
    institution: 'FCUP',
    mode: 'swap',
  },
];

const renderWishlistScreen = (contextOverrides = {}, navigate = jest.fn()) => {
  const contextValue = {
    currentUser: { id: 'user-123', name: 'May' },
    wishlistListings: [],
    wishlistLoading: false,
    refreshWishlist: jest.fn(),
    isWishlisted: jest.fn(() => false),
    toggleWishlist: jest.fn(() => Promise.resolve(true)),
    ...contextOverrides,
  };

  render(
    <UserContext.Provider value={contextValue}>
      <WishlistScreen navigate={navigate} />
    </UserContext.Provider>,
  );

  return { contextValue, navigate };
};

describe('WishlistScreen', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('blocks access when the user is not logged in', () => {
    renderWishlistScreen({ currentUser: null });

    expect(screen.getByTestId('wishlist-blocked-state')).toBeTruthy();
    expect(screen.getByText('Inicia sessão para veres a tua wishlist')).toBeTruthy();
  });

  it('shows a loading state while the wishlist is being loaded', () => {
    renderWishlistScreen({
      wishlistLoading: true,
      wishlistListings: [],
    });

    expect(screen.getByTestId('wishlist-loading-state')).toBeTruthy();
    expect(screen.getByText('A carregar a tua wishlist...')).toBeTruthy();
  });

  it('shows an empty state when the logged-in user has no saved listings', () => {
    renderWishlistScreen();

    expect(screen.getByTestId('wishlist-screen')).toBeTruthy();
    expect(screen.getByTestId('wishlist-empty-state')).toBeTruthy();
    expect(screen.getByText('Ainda não guardaste anúncios.')).toBeTruthy();
  });

  it('renders saved listings from the wishlist context', () => {
    renderWishlistScreen({
      wishlistListings: savedListings,
      isWishlisted: jest.fn((listingId) =>
        savedListings.some((listing) => listing.id === listingId),
      ),
    });

    expect(screen.getByText('A tua wishlist')).toBeTruthy();

    expect(screen.getByText('Calculadora Gráfica Casio')).toBeTruthy();
    expect(screen.getByText('Livro de Física')).toBeTruthy();

    expect(screen.getByText('€ 55')).toBeTruthy();
    expect(screen.getByText('€ 20')).toBeTruthy();

    expect(screen.getByText('FEUP')).toBeTruthy();
    expect(screen.getByText('FCUP')).toBeTruthy();
  });

  it('calls refreshWishlist when the update button is pressed', () => {
    const refreshWishlist = jest.fn();

    renderWishlistScreen({ refreshWishlist });

    fireEvent.press(screen.getByText('Atualizar'));

    expect(refreshWishlist).toHaveBeenCalledTimes(1);
  });

  it('navigates to listing details when a saved listing is pressed', () => {
    const navigate = jest.fn();

    renderWishlistScreen(
      {
        wishlistListings: savedListings,
        isWishlisted: jest.fn(() => true),
      },
      navigate,
    );

    fireEvent.press(screen.getByText('Calculadora Gráfica Casio'));

    expect(navigate).toHaveBeenCalledWith('ListingDetails', {
      listing: expect.objectContaining({
        id: 'listing-1',
        title: 'Calculadora Gráfica Casio',
      }),
    });
  });
});