import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ChatScreen from '../../src/screens/ChatScreen';

describe('ChatScreen Tests', () => {
  it('renders the chat screen and essential elements', () => {
    // Pass a valid conversation id that exists in data, e.g. "1" or none
    render(<ChatScreen conversationId="1" navigate={jest.fn()} />);

    expect(screen.getByTestId('chat-screen')).toBeTruthy();
    expect(screen.getByTestId('chat-back-button')).toBeTruthy();
    expect(screen.getByTestId('chat-message-input')).toBeTruthy();
    expect(screen.getByTestId('chat-send-button')).toBeTruthy();
  });

  it('input text enables send button', () => {
    render(<ChatScreen conversationId="1" navigate={jest.fn()} />);

    const input = screen.getByTestId('chat-message-input');
    const sendButton = screen.getByTestId('chat-send-button');

    // Initially disabled (if we assert on button state)
    // React Native's disabled prop makes the button visually different 
    // We'll just check typing text allows a send by interacting
    fireEvent.changeText(input, 'Hello World');
    expect(input.props.value).toBe('Hello World');
    
    // We can also fire press
    fireEvent.press(sendButton);
    // the text should reset to empty after sending
    expect(input.props.value).toBe('');
  });
});
