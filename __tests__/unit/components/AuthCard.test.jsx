import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import AuthCard from '../../../src/components/AuthCard';

describe('AuthCard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders correctly with title, subtitle and children', () => {
    render(
      <AuthCard title="My Title" subtitle="My Subtitle" footer={<Text>My Footer</Text>}>
        <Text>Children Content</Text>
      </AuthCard>
    );

    expect(screen.getByText('My Title')).toBeTruthy();
    expect(screen.getByText('My Subtitle')).toBeTruthy();
    expect(screen.getByText('Children Content')).toBeTruthy();
    expect(screen.getByText('My Footer')).toBeTruthy();
    expect(screen.getByText('EduCycle')).toBeTruthy(); // Brand text
  });

  it('renders correctly without optionals', () => {
    render(
      <AuthCard>
        <Text>Just Children</Text>
      </AuthCard>
    );

    expect(screen.getByText('Just Children')).toBeTruthy();
  });
});
