import {
  isValidEmail,
  isValidPassword,
  validateSignupForm,
  validateLoginForm,
  normalizeEmail,
} from '../../../src/utils/validation';

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

describe('profile validation helpers', () => {
  test('accepts a valid display name', () => {
    const { validateProfileDisplayName } = require('../../../src/utils/validation');
    expect(validateProfileDisplayName("Maria João-Silva")).toBeNull();
    expect(validateProfileDisplayName('02May02')).toBeNull();
    expect(validateProfileDisplayName('artur_mf.06')).toBeNull();
  });

  test('rejects an empty display name', () => {
    const { validateProfileDisplayName } = require('../../../src/utils/validation');
    expect(validateProfileDisplayName('   ')).toBe('Display name is required.');
  });

  test('accepts valid profile image metadata', () => {
    const { validateProfileImageAsset } = require('../../../src/utils/validation');
    expect(
      validateProfileImageAsset({ uri: 'file:///avatar.png', mimeType: 'image/png', fileSize: 200_000 }),
    ).toBeNull();
  });

  test('rejects invalid profile image types', () => {
    const { validateProfileImageAsset } = require('../../../src/utils/validation');
    expect(
      validateProfileImageAsset({ uri: 'file:///avatar.pdf', mimeType: 'application/pdf', fileSize: 200_000 }),
    ).toBe('Please upload a JPG, PNG or WebP image.');
  });

  test('rejects oversized profile images', () => {
    const { PROFILE_IMAGE_MAX_BYTES, validateProfileImageAsset } = require('../../../src/utils/validation');
    expect(
      validateProfileImageAsset({ uri: 'file:///avatar.jpg', mimeType: 'image/jpeg' }, PROFILE_IMAGE_MAX_BYTES + 1),
    ).toBe('Profile image must be 5 MB or less.');
  });
});
