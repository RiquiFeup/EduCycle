import {
  isValidEmail,
  isValidPassword,
  validateSignupForm,
  validateLoginForm,
  normalizeEmail,
} from '../../src/utils/validation';

describe('validation helpers', () => {
  test('normalizes emails consistently', () => {
    expect(normalizeEmail(' Student@FE.UP.PT  ')).toBe('student@fe.up.pt');
  });

  test('accepts valid email addresses', () => {
    expect(isValidEmail('student@fe.up.pt')).toBe(true);
  });

  test('rejects invalid email addresses', () => {
    expect(isValidEmail('student-at-fe.up.pt')).toBe(false);
  });

  test('accepts passwords with at least 6 characters', () => {
    expect(isValidPassword('123456')).toBe(true);
  });

  test('rejects passwords shorter than 6 characters', () => {
    expect(isValidPassword('123')).toBe(false);
  });

  test('returns both signup errors when inputs are invalid', () => {
    expect(
      validateSignupForm({
        email: 'bad-email',
        password: '123',
      }),
    ).toEqual({
      email: 'Please enter a valid email address.',
      password: 'Password must have at least 6 characters.',
    });
  });

  test('returns the same login errors when inputs are invalid', () => {
    expect(
      validateLoginForm({
        email: 'bad-email',
        password: '123',
      }),
    ).toEqual({
      email: 'Please enter a valid email address.',
      password: 'Password must have at least 6 characters.',
    });
  });
});