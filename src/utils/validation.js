export const normalizeEmail = (value = '') => value.trim().toLowerCase();

export const isValidEmail = (value = '') => /\S+@\S+\.\S+/.test(normalizeEmail(value));

export const isValidPassword = (value = '') => value.trim().length >= 6;

const buildCredentialErrors = ({ email = '', password = '' }) => {
  const errors = {};

  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!isValidPassword(password)) {
    errors.password = 'Password must have at least 6 characters.';
  }

  return errors;
};

export const validateSignupForm = (values) => buildCredentialErrors(values);

export const validateLoginForm = (values) => buildCredentialErrors(values);