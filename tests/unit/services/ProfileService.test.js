import { getDownloadURL, ref } from 'firebase/storage';
import * as FileSystem from 'expo-file-system/legacy';
import { uploadProfilePhoto } from '../../../src/services/profileService';

beforeEach(() => {
  jest.clearAllMocks();
  FileSystem.getInfoAsync.mockResolvedValue({ exists: true, size: 1024 });
  FileSystem.uploadAsync.mockResolvedValue({
    status: 200,
    body: JSON.stringify({ downloadTokens: 'mock-token' }),
  });
  getDownloadURL.mockResolvedValue('https://mock.url/profile.jpg');
});

describe('uploadProfilePhoto', () => {
  test('validates, uploads and returns a public download URL', async () => {
    const url = await uploadProfilePhoto('user-123', {
      uri: 'file:///avatar.jpg',
      mimeType: 'image/jpeg',
      fileSize: 1024,
    });

    expect(ref).toHaveBeenCalledWith(expect.anything(), expect.stringMatching(/^profilePictures\/user-123\/\d+\.jpg$/));
    expect(FileSystem.uploadAsync).toHaveBeenCalledWith(
      expect.stringContaining('https://firebasestorage.googleapis.com/v0/b/mock-bucket.appspot.com/o'),
      'file:///avatar.jpg',
      expect.objectContaining({
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-id-token',
          'Content-Type': 'image/jpeg',
        }),
      }),
    );
    expect(url).toBe('https://mock.url/profile.jpg');
  });

  test('returns the download token URL when Firebase getDownloadURL cannot read metadata', async () => {
    getDownloadURL.mockRejectedValueOnce(new Error('No download URL'));

    const url = await uploadProfilePhoto('user-123', {
      uri: 'file:///avatar.webp',
      mimeType: 'image/webp',
      fileSize: 1024,
    });

    expect(url).toContain('https://firebasestorage.googleapis.com/v0/b/mock-bucket.appspot.com/o/profilePictures%2Fuser-123%2F');
    expect(url).toContain('token=mock-token');
  });

  test('rejects invalid image types before uploading', async () => {
    await expect(
      uploadProfilePhoto('user-123', {
        uri: 'file:///avatar.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
      }),
    ).rejects.toThrow('Please upload a JPG, PNG or WebP image.');

    expect(FileSystem.uploadAsync).not.toHaveBeenCalled();
    expect(getDownloadURL).not.toHaveBeenCalled();
  });

  test('rejects oversized images before uploading', async () => {
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true, size: 6 * 1024 * 1024 });

    await expect(
      uploadProfilePhoto('user-123', {
        uri: 'file:///avatar.png',
        mimeType: 'image/png',
        fileSize: 6 * 1024 * 1024,
      }),
    ).rejects.toThrow('Profile image must be 5 MB or less.');

    expect(FileSystem.uploadAsync).not.toHaveBeenCalled();
    expect(getDownloadURL).not.toHaveBeenCalled();
  });
});
