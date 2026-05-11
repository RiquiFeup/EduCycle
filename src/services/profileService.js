import * as FileSystem from 'expo-file-system/legacy';
import { getDownloadURL, ref } from 'firebase/storage';
import { auth, storage } from '../utils/firebase';
import {
  inferImageMimeType,
  validateProfileImageAsset,
} from '../utils/validation';

const EXTENSION_BY_MIME_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const FALLBACK_STORAGE_BUCKET = 'educycle-t3.firebasestorage.app';

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

const getStorageBucket = () => (
  storage?.app?.options?.storageBucket
  ?? storage?._bucket?.bucket
  ?? storage?._location?.bucket
  ?? FALLBACK_STORAGE_BUCKET
);

const getAuthenticatedUploadHeaders = async (mimeType) => {
  const firebaseUser = auth?.currentUser;

  if (!firebaseUser?.getIdToken) {
    throw new Error('You need to be logged in to update your profile photo.');
  }

  const idToken = await firebaseUser.getIdToken();

  return {
    Authorization: `Bearer ${idToken}`,
    'Content-Type': mimeType,
  };
};

const buildUploadUrl = (bucket, imagePath) => {
  const encodedBucket = encodeURIComponent(bucket);
  const encodedPath = encodeURIComponent(imagePath);

  return `https://firebasestorage.googleapis.com/v0/b/${encodedBucket}/o?uploadType=media&name=${encodedPath}`;
};

const getDownloadUrlFromUploadResponse = (body, bucket, imagePath) => {
  try {
    const uploadMetadata = JSON.parse(body);
    const token = uploadMetadata?.downloadTokens?.split(',')?.[0];

    if (!token) {
      return null;
    }

    return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(imagePath)}?alt=media&token=${encodeURIComponent(token)}`;
  } catch (error) {
    return null;
  }
};

const getUploadErrorMessage = (body) => {
  try {
    const parsedBody = JSON.parse(body);
    return parsedBody?.error?.message;
  } catch (error) {
    return null;
  }
};

const uploadImageFile = async ({ asset, bucket, imagePath, mimeType }) => {
  const uploadUrl = buildUploadUrl(bucket, imagePath);
  const headers = await getAuthenticatedUploadHeaders(mimeType);

  const response = await FileSystem.uploadAsync(uploadUrl, asset.uri, {
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers,
  });

  if (response.status < 200 || response.status >= 300) {
    const serverMessage = getUploadErrorMessage(response.body);
    throw new Error(serverMessage || 'Could not upload the selected image.');
  }

  return response.body;
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

  const mimeType = asset.mimeType || inferImageMimeType(asset);
  const extension = EXTENSION_BY_MIME_TYPE[mimeType] ?? 'jpg';
  const imagePath = `profilePictures/${userId}/${Date.now()}.${extension}`;
  const profilePhotoRef = ref(storage, imagePath);
  const bucket = getStorageBucket();
  const uploadResponseBody = await uploadImageFile({ asset, bucket, imagePath, mimeType });
  const fallbackDownloadUrl = getDownloadUrlFromUploadResponse(uploadResponseBody, bucket, imagePath);

  try {
    return await getDownloadURL(profilePhotoRef);
  } catch (error) {
    if (fallbackDownloadUrl) {
      return fallbackDownloadUrl;
    }

    throw error;
  }
};
