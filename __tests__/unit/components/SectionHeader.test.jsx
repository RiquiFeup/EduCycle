import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import SectionHeader from '../../../src/components/SectionHeader';

describe('SectionHeader', () => {
  it('renders title and button if action is provided', () => {
    const mockAction = jest.fn();
    render(<SectionHeader title="Categorias" actionText="Ver Tudo" onActionPress={mockAction} />);
    
    expect(screen.getByText('Categorias')).toBeTruthy();
    expect(screen.getByText('Ver Tudo')).toBeTruthy();
    
    fireEvent.press(screen.getByText('Ver Tudo'));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
  
  it('renders only title if no action provided', () => {
    render(<SectionHeader title="Apenas Título" />);
    expect(screen.getByText('Apenas Título')).toBeTruthy();
    expect(screen.queryByText('Ver Tudo')).toBeNull();
  });
});
