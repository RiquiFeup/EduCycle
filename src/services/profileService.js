import * as FileSystem from 'expo-file-system/legacy';
import {
  getProfileImageMimeType,
  validateProfileImageAsset,
} from '../utils/validation';

const MAX_PROFILE_PHOTO_DATA_URI_CHARS = 750 * 1024;

const getAssetSize = async (asset) => {
  if (!asset?.uri) {
    return undefined;
  }

  try {
    const fileInfo = await FileSystem.getInfoAsync(asset.uri, { size: true });

    if (fileInfo?.exists !== false && typeof fileInfo?.size === 'number') {
      return fileInfo.size;
    }
  } catch (error) {
    console.warn('Could not read selected image size, using picker metadata instead:', error);
  }

  return typeof asset.fileSize === 'number' ? asset.fileSize : undefined;
};

const readAssetAsDataUri = async (asset, mimeType) => {
  if (asset.base64) {
    return `data:${mimeType};base64,${asset.base64}`;
  }

  if (asset.uri.startsWith('data:')) {
    return asset.uri;
  }

  try {
    const base64Image = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: 'base64',
    });

    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error('Could not read selected image for profile photo:', error);
    throw new Error('Could not read the selected image. Please choose another photo.');
  }
};

const ensureFirestoreSafeProfilePhoto = (dataUri) => {
  if (dataUri.length > MAX_PROFILE_PHOTO_DATA_URI_CHARS) {
    throw new Error('Profile image is too large to save. Choose a smaller or more cropped photo.');
  }
};

export const uploadProfilePhoto = async (userId, asset) => {
  if (!userId) {
    throw new Error('You need to be logged in to update your profile photo.');
  }

  const detectedSize = await getAssetSize(asset);
  const validationError = validateProfileImageAsset(asset, detectedSize);

  if (validationError) {
    throw new Error(validationError);
  }

  const mimeType = getProfileImageMimeType(asset);
  const dataUri = await readAssetAsDataUri(asset, mimeType);

  ensureFirestoreSafeProfilePhoto(dataUri);

  return dataUri;
};
