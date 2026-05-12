import * as FileSystem from 'expo-file-system/legacy';
import { uploadProfilePhoto } from '../../../src/services/profileService';

beforeEach(() => {
  jest.clearAllMocks();
  FileSystem.getInfoAsync.mockResolvedValue({ exists: true, size: 1024 });
  FileSystem.readAsStringAsync.mockResolvedValue('mock-base64');
});

describe('uploadProfilePhoto', () => {
  test('validates and returns a Firestore-safe data URI for the profile photo', async () => {
    const url = await uploadProfilePhoto('user-123', {
      uri: 'file:///avatar.jpg',
      mimeType: 'image/jpeg',
      fileSize: 1024,
    });

    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith('file:///avatar.jpg', {
      encoding: 'base64',
    });
    expect(url).toBe('data:image/jpeg;base64,mock-base64');
  });

  test('uses picker-provided JPEG base64 data before reading from the file system', async () => {
    const url = await uploadProfilePhoto('user-123', {
      uri: 'file:///avatar.heic',
      mimeType: 'image/heic',
      base64: 'picker-base64',
      fileSize: 1024,
    });

    expect(FileSystem.readAsStringAsync).not.toHaveBeenCalled();
    expect(url).toBe('data:image/jpeg;base64,picker-base64');
  });

  test('rejects profile photos that are too large for a Firestore user document', async () => {
    await expect(
      uploadProfilePhoto('user-123', {
        uri: 'file:///avatar.jpg',
        mimeType: 'image/jpeg',
        base64: 'a'.repeat(760 * 1024),
        fileSize: 1024,
      }),
    ).rejects.toThrow('Profile image is too large to save.');
  });

  test('rejects invalid image types before reading the image', async () => {
    await expect(
      uploadProfilePhoto('user-123', {
        uri: 'file:///avatar.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
      }),
    ).rejects.toThrow('Please upload a JPG, PNG or WebP image.');

    expect(FileSystem.readAsStringAsync).not.toHaveBeenCalled();
  });

  test('rejects oversized images before reading the image', async () => {
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true, size: 6 * 1024 * 1024 });

    await expect(
      uploadProfilePhoto('user-123', {
        uri: 'file:///avatar.png',
        mimeType: 'image/png',
        fileSize: 6 * 1024 * 1024,
      }),
    ).rejects.toThrow('Profile image must be 5 MB or less.');

    expect(FileSystem.readAsStringAsync).not.toHaveBeenCalled();
  });
});
