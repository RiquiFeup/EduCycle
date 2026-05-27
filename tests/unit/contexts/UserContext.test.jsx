import React, { useContext, useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { UserContext, UserProvider } from '../../../src/contexts/UserContext';
import { Text, Button } from 'react-native';
import { getDoc } from 'firebase/firestore';

const TestComponent = () => {
  const { currentUser, updateUser, logout, cartListings, addToCart, removeFromCart } = useContext(UserContext);
  const [cartError, setCartError] = useState('');

  const handleAddToCart = async (listing) => {
    try {
      setCartError('');
      await addToCart(listing);
    } catch (error) {
      setCartError(error.message);
    }
  };

  return (
    <>
      <Text testID="username">{currentUser?.name}</Text>
      <Text testID="cart-count">{cartListings.length}</Text>
      <Text testID="cart-error">{cartError}</Text>
      <Button testID="update-btn" title="Update" onPress={() => updateUser({ name: 'Maria' })} />
      <Button testID="logout-btn" title="Logout" onPress={logout} />
      <Button
        testID="add-cart-btn"
        title="Add to cart"
        onPress={() => handleAddToCart({ id: 'listing-1', title: 'Livro', price: 10, status: 'active' })}
      />
      <Button
        testID="add-unavailable-cart-btn"
        title="Add unavailable"
        onPress={() => handleAddToCart({ id: 'listing-2', title: 'Vendido', price: 10, status: 'sold' })}
      />
      <Button testID="remove-cart-btn" title="Remove from cart" onPress={() => removeFromCart('listing-1')} />
    </>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
  });

  it('provides default user and allows updates', () => {
    const onUpdateMock = jest.fn();
    render(
      <UserProvider onUserUpdate={onUpdateMock}>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('username').props.children).toBe('João Silva');

    fireEvent.press(screen.getByTestId('update-btn'));
    expect(screen.getByTestId('username').props.children).toBe('Maria');
    expect(onUpdateMock).toHaveBeenCalledWith(expect.objectContaining({ name: 'Maria' }));
  });

  it('triggers logout callback', () => {
    const onLogoutMock = jest.fn();
    render(
      <UserProvider onLogout={onLogoutMock}>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.press(screen.getByTestId('logout-btn'));
    expect(onLogoutMock).toHaveBeenCalled();
  });

  it('adds available listings to the shopping cart', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.press(screen.getByTestId('add-cart-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('cart-count').props.children).toBe(1);
    });
  });

  it('prevents duplicate listings in the shopping cart', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.press(screen.getByTestId('add-cart-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('cart-count').props.children).toBe(1);
    });

    fireEvent.press(screen.getByTestId('add-cart-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('cart-error').props.children).toBe('Este anúncio já está no teu carrinho.');
      expect(screen.getByTestId('cart-count').props.children).toBe(1);
    });
  });

  it('does not add unavailable listings to the shopping cart', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.press(screen.getByTestId('add-unavailable-cart-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('cart-error').props.children).toBe(
        'Este anúncio já não está disponível e não foi adicionado ao carrinho.',
      );
      expect(screen.getByTestId('cart-count').props.children).toBe(0);
    });
  });

  it('removes listings from the shopping cart', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.press(screen.getByTestId('add-cart-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('cart-count').props.children).toBe(1);
    });

    fireEvent.press(screen.getByTestId('remove-cart-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('cart-count').props.children).toBe(0);
    });
  });

  it('restores saved cart listings for the signed-in user', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        cartListings: [{ id: 'listing-1', listingId: 'listing-1', title: 'Livro', addedAt: '2026-05-27T12:00:00.000Z' }],
      }),
    });

    render(
      <UserProvider initialUser={{ id: 'buyer-1' }}>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('cart-count').props.children).toBe(1);
    });
  });
});
