import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ListingDetailsScreen from '../../../src/screens/listing/ListingDetailsScreen';

describe('ListingDetailsScreen - Testes UAT e Renderização Visual', () => {
  
  const baseListing = {
    id: 'test-1',
    title: 'Calculadora Gráfica',
    price: 50.00,
    institution: 'FEUP',
    mode: 'sell',
    description: 'Baterias novas.',
    image: 'https://link-para-imagem.com/calc.jpg',
    sellerId: 'seller-1',
    sellerName: 'Sofia Martins',
    sellerPhoto: 'https://i.pravatar.cc/150?u=sofia'
  };

  describe('Cenário 1: Renderização de Informação Básica e Condicional', () => {
    /*
     * CLASSIFICATION: UT (Unit Test)
     * JUSTIFICATION: Verifica a capacidade do componente de mapear um objeto de propriedades 
     * (props) para o ecrã de forma estática. Não simula interações.
     */
    it('renderiza os detalhes base do produto corretamente', () => {
      render(<ListingDetailsScreen listing={baseListing} navigate={jest.fn()} />);

      expect(screen.getByText('Detalhes do Produto')).toBeTruthy();
      expect(screen.getByText('Calculadora Gráfica')).toBeTruthy();
      expect(screen.getByText('€ 50.00')).toBeTruthy();
      expect(screen.getByText('FEUP')).toBeTruthy();
      expect(screen.getByText('Baterias novas.')).toBeTruthy();
    });

    /*
     * CLASSIFICATION: UT (Unit Test)
     * JUSTIFICATION: Analisa uma condicional no render (o modo de troca). Avalia lógica 
     * estática pura através da alteração de uma propriedade, sem simular cliques.
     */
    it('aplica o badge correto quando o artigo é para Troca (Swap)', () => {
      const swapListing = { ...baseListing, mode: 'swap' };
      render(<ListingDetailsScreen listing={swapListing} navigate={jest.fn()} />);

      expect(screen.getByText('For Swap')).toBeTruthy();
    });

    /*
     * CLASSIFICATION: UT (Unit Test)
     * JUSTIFICATION: Avalia a renderização e o UI fallback de um edge-case estrutural 
     * (descrição vazia), que não envolve ações dinâmicas do utilizador.
     */
    it('mostra mensagem alternativa quando a descrição vem vazia', () => {
      const emptyDescListing = { ...baseListing, description: '' };
      render(<ListingDetailsScreen listing={emptyDescListing} navigate={jest.fn()} />);

      expect(screen.getByText('Sem descrição detalhada fornecida pelo vendedor para este artigo.')).toBeTruthy();
    });
  });

  describe('Cenário 2: Comportamento Dinâmico do Vendedor', () => {
    /*
     * CLASSIFICATION: UAT (User Acceptance Test)
     * JUSTIFICATION: Valida uma jornada completa onde o utilizador repara no nome do 
     * vendedor, decide clicar para ver mais detalhes e o sistema processa a transição 
     * corretamente enviando a sua ID na navegação.
     */
    it('mostra o nome do vendedor e envia o ID correto ao clicar no perfil', () => {
      const mockNavigate = jest.fn();
      render(<ListingDetailsScreen listing={baseListing} navigate={mockNavigate} />);

      // Confirma que mostra a Sofia
      expect(screen.getByText('Sofia Martins')).toBeTruthy();

      // Simula o clique para ver o perfil
      fireEvent.press(screen.getByText('Ver Perfil Público →'));

      // Confirma que a navegação enviou o ID da Sofia na "mochila"
      expect(mockNavigate).toHaveBeenCalledWith('PublicProfile', { sellerId: 'seller-1' });
    });

    /*
     * CLASSIFICATION: UAT (User Acceptance Test)
     * JUSTIFICATION: Testa o fluxo de erro pelo ponto de vista do utilizador. Simula o 
     * clique no vendedor mesmo em caso de falha nos dados, validando que o fluxo não quebra.
     */
    it('recorre ao fallback de Vendedor Anónimo se faltarem dados, não enviando ID', () => {
      const mockNavigate = jest.fn();
      const anonListing = {
        id: 'test-2',
        title: 'Livro',
        mode: 'sell',
        // Sem sellerId, sellerName ou sellerPhoto
      };

      render(<ListingDetailsScreen listing={anonListing} navigate={mockNavigate} />);

      // Confirma que a rede de segurança (fallback) atuou
      expect(screen.getByText('Vendedor Anónimo')).toBeTruthy();

      fireEvent.press(screen.getByText('Ver Perfil Público →'));

      // Confirma que não enviou ID definido
      expect(mockNavigate).toHaveBeenCalledWith('PublicProfile', { sellerId: undefined });
    });
  });

  describe('Cenário 3: Navegação Padrão', () => {
    /*
     * CLASSIFICATION: UAT (User Acceptance Test)
     * JUSTIFICATION: Simulação de ação de negócio: O utilizador clica ativamente no 
     * botão de enviar mensagem com a intenção de comunicar com o vendedor.
     */
    it('navega para o chat ao clicar no botão de enviar mensagem', () => {
      const mockNavigate = jest.fn();
      render(<ListingDetailsScreen listing={baseListing} navigate={mockNavigate} />);

      fireEvent.press(screen.getByText('Enviar Mensagem'));
      expect(mockNavigate).toHaveBeenCalledWith('Chat', { conversationId: 'c1' }); // Ajusta 'c1' se o teu botão usar outro id
    });

    /*
     * CLASSIFICATION: UAT (User Acceptance Test)
     * JUSTIFICATION: Avalia uma interação do utilizador para regressar ao ecrã anterior.
     */
    it('limpa a pilha e volta à Home ao clicar em Voltar', () => {
      const mockNavigate = jest.fn();
      render(<ListingDetailsScreen listing={baseListing} navigate={mockNavigate} />);

      fireEvent.press(screen.getByText('← Voltar'));
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });
});