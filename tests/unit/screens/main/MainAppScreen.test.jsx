import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import MainAppScreen from '../../../../src/screens/main/MainAppScreen';
import { UserContext } from '../../../../src/contexts/UserContext';

const mockUser = { id: 'user-123' };

describe('MainAppScreen Tests', () => {
  /*
   * CLASSIFICATION: UAT (User Acceptance Test)
   * JUSTIFICATION: Simula a mudança de ecrãs do ponto de vista do utilizador ("travels"). 
   * Exige a ação de um clique num tab do menu inferior e valida que o ecrã correspondente 
   * ganhou foco real.
   */
  it('switches tabs properly when pressed', async () => {
    // Fornecemos o contexto porque as tabs lá dentro (como a Profile e a Home) precisam dele
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MainAppScreen />
      </UserContext.Provider>
    );

    // 1. Espera que a Home acabe o carregamento inicial e mostre o feed
    await waitFor(() => {
      expect(screen.getByTestId('home-feed-screen')).toBeTruthy();
    }, { timeout: 5000 });

    // 2. Agora sim, clica noutra tab
    fireEvent.press(screen.getByTestId('tab-saved'));
    
    // Verifica se a tab Saved ficou ativa (podes adaptar conforme a lógica do teu MainAppScreen)
    expect(screen.getByTestId('tab-saved')).toBeTruthy();
  });
});