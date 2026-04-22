import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import PrivateProfileScreen from '../../../src/screens/PrivateProfileScreen';
import { UserContext } from '../../../src/contexts/UserContext';

const mockUser = { id: 'user-123', name: 'João Silva' };

function renderWithContext(ui) {
  return render(
    <UserContext.Provider value={{ currentUser: mockUser }}>
      {ui}
    </UserContext.Provider>
  );
}

describe('PrivateProfileScreen Tests', () => {
  /*
   * CLASSIFICATION: UT (Unit Test)
   * JUSTIFICATION: Apenas renderiza o componente para testar se ele capta os detalhes 
   * estáticos do contexto (UserContext) de forma isolada, não requerendo interação.
   */
  it('renders private profile correctly and waits for listings', async () => {
    renderWithContext(<PrivateProfileScreen navigate={jest.fn()} />);

    // O waitFor garante que o teste só termina quando os estados 
    // setMyListings e setLoadingListings terminarem de atualizar.
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeTruthy();
    }, { timeout: 4000 });
  });
});