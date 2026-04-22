import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../../src/screens/HomeScreen';

// Importamos a função falsa que criámos no setup.js
import { getDocs } from 'firebase/firestore';

describe('HomeScreen Tests', () => {
  beforeEach(() => {
    // Dizemos o que a função falsa deve devolver neste teste
    getDocs.mockResolvedValue({
      docs: [
        { id: '1', data: () => ({ title: 'Livro de Cálculo', price: '20' }) }
      ]
    });
  });

  /*
   * CLASSIFICATION: UT (Unit Test)
   * JUSTIFICATION: Avalia exclusivamente o ciclo de vida e a renderização do componente 
   * quando injetado com dados. Não exige qualquer interação interativa (clique, texto) 
   * por parte do utilizador para forçar a renderização do Livro de Cálculo.
   */
  it('renderiza o feed sem ir à internet', async () => {
    render(<HomeScreen navigate={jest.fn()} />);

    // Esperar que os dados cheguem para calar o aviso do act(...)
    await waitFor(() => {
      expect(screen.getByTestId('home-feed-screen')).toBeTruthy();
    }, { timeout: 5000 });

    expect(screen.getByText('Livro de Cálculo')).toBeTruthy();
  });
});