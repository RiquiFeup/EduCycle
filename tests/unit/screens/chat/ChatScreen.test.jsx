import React from 'react';
import { render, fireEvent, screen, waitFor, cleanup, act } from '@testing-library/react-native';
import ChatScreen from '../../../../src/screens/chat/ChatScreen';

describe('ChatScreen Tests', () => {
  afterEach(() => {
    cleanup();
  });

  /*
   * CLASSIFICATION: UT (Unit Test)
   * JUSTIFICATION: Este teste apenas verifica a estrutura e renderização estática do ecrã.
   * Não há simulação de fluxo de utilizador ou cliques, apenas a validação de que os 
   * elementos visuais (campos e botões) são injetados no DOM corretamente.
   */
  it('renders the chat screen and essential elements', async () => {
    render(<ChatScreen conversationId="conv-1" navigate={jest.fn()} currentUser={{ id: 'me' }} />);

    await waitFor(() => {
      expect(screen.getByText('Online')).toBeTruthy();
    });

    expect(screen.getByTestId('chat-screen')).toBeTruthy();
    expect(screen.getByTestId('chat-back-button')).toBeTruthy();
    expect(screen.getByTestId('chat-message-input')).toBeTruthy();
    expect(screen.getByTestId('chat-send-button')).toBeTruthy();
  });

  /*
   * CLASSIFICATION: UAT (User Acceptance Test)
   * JUSTIFICATION: Simula um cenário comportamental do utilizador: escrever uma 
   * mensagem no input de chat, clicar no botão de enviar e verificar se o sistema
   * processou a ação limpando a caixa de texto.
   */
  it('input text enables send button', async () => {
    render(<ChatScreen conversationId="conv-1" navigate={jest.fn()} currentUser={{ id: 'me' }} />);

    await waitFor(() => {
      expect(screen.getByText('Online')).toBeTruthy();
    });

    const input = screen.getByTestId('chat-message-input');
    const sendButton = screen.getByTestId('chat-send-button');

    fireEvent.changeText(input, 'Hello World');
    expect(input.props.value).toBe('Hello World');
    
    await act(async () => {
      fireEvent.press(sendButton);
    });


    await waitFor(() => {
      expect(screen.getByTestId('chat-message-input').props.value).toBe('');
    });
  });
});