import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ShoppingCartScreen from '../../../../src/screens/main/ShoppingCartScreen';
import { ThemeProvider } from '../../../../src/contexts/ThemeContext';
import { UserContext } from '../../../../src/contexts/UserContext';

describe('ShoppingCartScreen Tests', () => {
  it('renders correctly with empty state', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ShoppingCartScreen navigate={jest.fn()} />
      </ThemeProvider>
    );

    expect(getByText('Carrinho')).toBeTruthy();
    expect(getByText('O teu carrinho está vazio')).toBeTruthy();
    expect(getByText('Adiciona itens para os comprares mais tarde.')).toBeTruthy();
    expect(getByText('🛒')).toBeTruthy();
  });

  it('navigates back to Home when the back button is pressed', () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(
      <ThemeProvider>
        <ShoppingCartScreen navigate={mockNavigate} />
      </ThemeProvider>
    );

    const backButton = getByText('← Voltar');
    fireEvent.press(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('renders listings added to the shopping cart', () => {
    const cartListings = [
      {
        id: 'listing-1',
        title: 'Calculadora Gráfica',
        price: 50,
        institution: 'FEUP',
      },
    ];

    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <UserContext.Provider value={{ cartListings }}>
          <ShoppingCartScreen navigate={jest.fn()} />
        </UserContext.Provider>
      </ThemeProvider>
    );

    expect(getByTestId('cart-item-listing-1')).toBeTruthy();
    expect(getByText('Calculadora Gráfica')).toBeTruthy();
    expect(getByText('€ 50.00')).toBeTruthy();
  });
});
