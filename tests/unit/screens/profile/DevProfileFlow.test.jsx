import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import DevProfileFlow from '../../../../src/screens/profile/DevProfileFlow';
import { UserContext } from '../../../../src/contexts/UserContext';

const mockUser = { id: 'user-123' };

describe('DevProfileFlow Tests', () => {
  /*
   * CLASSIFICATION: UAT (User Acceptance Test)
   * JUSTIFICATION: Testa o fluxo de navegação explícito. Simula a intenção do utilizador 
   * de clicar num botão para viajar para outro ecrã e aguarda assincronamente que a 
   * viagem se conclua e o novo ecrã (Home) substitua o ecrã atual.
   */
  it('navigates to another screen when a button is pressed', async () => {
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <DevProfileFlow />
      </UserContext.Provider>
    );

    // 1. Confirma que o menu Dev está visível
    expect(screen.getByText('Dev Directory')).toBeTruthy();

    // 2. Clica no botão de navegação
    fireEvent.press(screen.getByText('Go to Home Screen'));

    // 3. Espera que a Home carregue
    await waitFor(() => {
      expect(screen.getByText('EduCycle')).toBeTruthy();
    }, { timeout: 5000 });

    // 4. Confirma que o menu Dev desapareceu
    expect(screen.queryByText('Dev Directory')).toBeNull();
  });
});