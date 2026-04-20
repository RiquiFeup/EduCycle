import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../../src/screens/LoginScreen';
import { validateLoginForm } from '../../../src/utils/validation';

// Mock do utilitário
jest.mock('../../../src/utils/validation', () => ({
  validateLoginForm: jest.fn(),
}));

describe('LoginScreen - Testes Aprofundados', () => {
  const mockOnLoginSuccess = jest.fn();
  const mockOnBack = jest.fn();
  const mockOnNavigateToSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const baseProps = {
    onLoginSuccess: mockOnLoginSuccess,
    onBack: mockOnBack,
    onNavigateToSignup: mockOnNavigateToSignup,
  };

  it('deve renderizar os elementos principais', () => {
    render(<LoginScreen {...baseProps} />);
    expect(screen.getByTestId('login-screen')).toBeTruthy();
    expect(screen.getByTestId('login-email-input')).toBeTruthy();
    expect(screen.getByTestId('login-password-input')).toBeTruthy();
    expect(screen.getByTestId('login-submit-button')).toBeTruthy();
  });

  it('deve mostrar erros e não submitir quando for inválido', async () => {
    validateLoginForm.mockReturnValue({
      email: 'Email inválido',
      password: 'Password demasiado curta',
    });

    render(<LoginScreen {...baseProps} />);
    fireEvent.press(screen.getByTestId('login-submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('login-email-input-error')).toBeTruthy();
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });
  });

  it('deve chamar dados de sucesso quando formulário está válido', async () => {
    validateLoginForm.mockReturnValue({});

    render(<LoginScreen {...baseProps} />);

    fireEvent.changeText(screen.getByTestId('login-email-input'), 'user@test.com');
    fireEvent.changeText(screen.getByTestId('login-password-input'), 'validpass123');
    fireEvent.press(screen.getByTestId('login-submit-button'));

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'validpass123',
      });
    });
  });
});
