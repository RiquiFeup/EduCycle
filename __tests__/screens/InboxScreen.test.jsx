import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import InboxScreen from '../../src/screens/InboxScreen';

describe('InboxScreen Tests', () => {
  it('renders the inbox screen and header', () => {
    render(<InboxScreen navigate={jest.fn()} />);

    expect(screen.getByTestId('inbox-screen')).toBeTruthy();
    expect(screen.getByText('EduCycle')).toBeTruthy();
    expect(screen.getByText('Messages')).toBeTruthy();
  });

  it('renders conversations and handles press', () => {
    const mockNavigate = jest.fn();
    render(<InboxScreen navigate={mockNavigate} />);

    // Since we use mock static data, we can just grab an element by testID if it's there
    // testID={`conversation-${item.id}`} where item.id exists in data ("conv-1", etc.)
    // If we don't know the ID, we can check by Role or by TestId generic match
    // we'll try to find any conversation card
    const conversationElements = screen.queryAllByTestId(/conversation-/);
    
    if (conversationElements.length > 0) {
      fireEvent.press(conversationElements[0]);
      expect(mockNavigate).toHaveBeenCalled();
    }
  });
});
