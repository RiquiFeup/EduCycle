export const normalizeEmail = (value = '') => value.trim().toLowerCase();

export const isValidEmail = (value = '') => /\S+@\S+\.\S+/.test(normalizeEmail(value));

export const isValidPassword = (value = '') => value.trim().length >= 6;

export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const PROFILE_IMAGE_MAX_MB = PROFILE_IMAGE_MAX_BYTES / (1024 * 1024);

export const VALID_PROFILE_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const PROFILE_IMAGE_MIME_BY_EXTENSION = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export const inferImageMimeType = ({ uri = '', fileName = '' } = {}) => {
  const source = fileName || uri;
  const extension = source.split('?')[0].split('.').pop()?.toLowerCase();

  return PROFILE_IMAGE_MIME_BY_EXTENSION[extension] ?? null;
};

export const getProfileImageMimeType = (asset = {}) => {
  if (asset.base64) {
    return 'image/jpeg';
  }

  return asset.mimeType || inferImageMimeType(asset);
};

export const validateProfileDisplayName = (value = '') => {
  const trimmedName = value.trim();

  if (!trimmedName) {
    return 'Display name is required.';
  }

  if (trimmedName.length > 50) {
    return 'Display name must have 50 characters or fewer.';
  }

  if (!/^[a-zA-ZÀ-ÿ0-9\s'_.-]+$/.test(trimmedName)) {
    return 'Display name can only contain letters, numbers, spaces, apostrophes, hyphens, underscores and periods.';
  }

  return null;
};

export const validateProfileImageAsset = (asset, detectedSize) => {
  if (!asset?.uri) {
    return 'Please select a valid image.';
  }

  const mimeType = getProfileImageMimeType(asset);

  if (!VALID_PROFILE_IMAGE_MIME_TYPES.includes(mimeType)) {
    return 'Please upload a JPG, PNG or WebP image.';
  }

  const fileSize = typeof detectedSize === 'number' ? detectedSize : asset.fileSize;

  if (typeof fileSize === 'number' && fileSize > PROFILE_IMAGE_MAX_BYTES) {
    return `Profile image must be ${PROFILE_IMAGE_MAX_MB} MB or less.`;
  }

  return null;
};

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
