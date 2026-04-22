import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import PublicProfileScreen from '../../../src/screens/PublicProfileScreen';
import { UserContext } from '../../../src/contexts/UserContext';

const mockUser = { id: 'user-123', name: 'João Silva', photo: 'uri', course: 'Engenharia', communities: [] };

describe('PublicProfileScreen Tests', () => {
  /*
   * CLASSIFICATION: UT (Unit Test)
   * JUSTIFICATION: Confirma o comportamento de renderização estrutural do ecrã quando lhe 
   * é passada uma configuração estática específica (a propriedade isPreview = true).
   */
  it('renders correctly in Preview Mode after loading', async () => {
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <PublicProfileScreen isPreview={true} navigate={jest.fn()} />
      </UserContext.Provider>
    );

    // Aguarda que o ecrã passe do ActivityIndicator para o perfil
    await waitFor(() => {
      expect(screen.getByTestId('public-profile-screen')).toBeTruthy();
    }, { timeout: 5000 });

    expect(screen.getByText('👁️ Preview Mode')).toBeTruthy();
    expect(screen.getByText('João Silva')).toBeTruthy();
  });

  /*
   * CLASSIFICATION: UT (Unit Test)
   * JUSTIFICATION: Valida as defesas mecânicas do componente (fallback estático), testando 
   * o UI providenciado caso haja ausência da prop obrigatória (sellerId).
   */
  it('shows error state when no sellerId is provided', async () => {
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <PublicProfileScreen isPreview={false} sellerId={null} navigate={jest.fn()} />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Utilizador não encontrado.')).toBeTruthy();
    });
  });
});