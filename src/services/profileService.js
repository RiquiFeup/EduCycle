import * as FileSystem from 'expo-file-system/legacy';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { storage } from '../utils/firebase';
import {
  getProfileImageMimeType,
  validateProfileImageAsset,
} from '../utils/validation';

const EXTENSION_BY_MIME_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

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

const buildProfilePhotoPath = (userId, mimeType) => {
  const extension = EXTENSION_BY_MIME_TYPE[mimeType] ?? 'jpg';
  return `profilePictures/${userId}/${Date.now()}.${extension}`;
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
    console.error('Could not read selected image for upload:', error);
    throw new Error('Could not read the selected image. Please choose another photo.');
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
  const imagePath = buildProfilePhotoPath(userId, mimeType);
  const profilePhotoRef = ref(storage, imagePath);
  const dataUri = await readAssetAsDataUri(asset, mimeType);

  try {
    await uploadString(profilePhotoRef, dataUri, 'data_url', {
      contentType: mimeType,
    });

    return await getDownloadURL(profilePhotoRef);
  } catch (error) {
    console.error('Firebase Storage profile photo upload failed:', error);
    throw new Error('Could not upload the selected image. Please try again.');
  }
};
