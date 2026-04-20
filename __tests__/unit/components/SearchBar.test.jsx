import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import SearchBar from '../../../src/components/SearchBar';

describe('SearchBar component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('calls onChangeText when input changes', () => {
    const mockOnChange = jest.fn();
    render(<SearchBar value="livro" onChangeText={mockOnChange} placeholder="Teste de busca..." />);
    
    // Find input by placeholder
    const input = screen.getByPlaceholderText('Teste de busca...');
    expect(input.props.value).toBe('livro');

    fireEvent.changeText(input, 'livro novo');
    expect(mockOnChange).toHaveBeenCalledWith('livro novo');
  });

  // Add tests for cancel/clear logic if SearchBar has a clear icon.
});
