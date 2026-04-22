import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import NewListingScreen from '../../../src/screens/listing/NewListingScreen';
import { UserContext } from '../../../src/contexts/UserContext';

const mockUser = { id: 'user-123' };

describe('US-03 — Publish a New Listing', () => {
  /*
   * CLASSIFICATION: UAT (User Acceptance Test)
   * JUSTIFICATION: Teste clássico de End-to-End simulado localmente. Replica o fluxo 
   * completo do utilizador a preencher 7 campos diferentes individualmente, clicar na ação 
   * de negócio principal (Publish) e avaliar o feedback assíncrono resultante.
   */
  it('AT2 — preenche e publica com sucesso', async () => {
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <NewListingScreen onPublish={jest.fn()} />
      </UserContext.Provider>
    );

    fireEvent.press(screen.getByTestId('photo-upload-area'));
    fireEvent.changeText(screen.getByTestId('input-title'), 'Matemática');
    fireEvent.changeText(screen.getByTestId('input-description'), 'Bom estado');
    fireEvent.press(screen.getByTestId('subject-option-Mathematics'));
    fireEvent.press(screen.getByTestId('condition-option-Good'));
    fireEvent.press(screen.getByTestId('campus-option-FEUP'));
    fireEvent.changeText(screen.getByPlaceholderText('0.00'), '10');

    fireEvent.press(screen.getByTestId('btn-publish'));

    await waitFor(() => {
      expect(screen.getByTestId('msg-success')).toBeTruthy();
    }, { timeout: 4000 });
  });
});