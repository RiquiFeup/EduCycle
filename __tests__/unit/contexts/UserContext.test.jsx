import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { UserContext, UserProvider } from '../../../src/contexts/UserContext';
import { Text, Button } from 'react-native';

const TestComponent = () => {
  const { currentUser, updateUser, logout } = useContext(UserContext);
  return (
    <>
      <Text testID="username">{currentUser?.name}</Text>
      <Button testID="update-btn" title="Update" onPress={() => updateUser({ name: 'Maria' })} />
      <Button testID="logout-btn" title="Logout" onPress={logout} />
    </>
  );
};

describe('UserContext', () => {
  it('provides default user and allows updates', () => {
    const onUpdateMock = jest.fn();
    render(
      <UserProvider onUserUpdate={onUpdateMock}>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('username').props.children).toBe('João Silva');

    fireEvent.press(screen.getByTestId('update-btn'));
    expect(screen.getByTestId('username').props.children).toBe('Maria');
    expect(onUpdateMock).toHaveBeenCalledWith(expect.objectContaining({ name: 'Maria' }));
  });

  it('triggers logout callback', () => {
    const onLogoutMock = jest.fn();
    render(
      <UserProvider onLogout={onLogoutMock}>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.press(screen.getByTestId('logout-btn'));
    expect(onLogoutMock).toHaveBeenCalled();
  });
});