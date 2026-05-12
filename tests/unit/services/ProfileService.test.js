import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import * as FileSystem from 'expo-file-system/legacy';
import { uploadProfilePhoto } from '../../../src/services/profileService';

beforeEach(() => {
  jest.clearAllMocks();
  FileSystem.getInfoAsync.mockResolvedValue({ exists: true, size: 1024 });
  FileSystem.readAsStringAsync.mockResolvedValue('mock-base64');
  uploadString.mockResolvedValue({});
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
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith('file:///avatar.jpg', {
      encoding: 'base64',
    });
    expect(uploadString).toHaveBeenCalledWith(
      { path: expect.stringMatching(/^profilePictures\/user-123\/\d+\.jpg$/) },
      'data:image/jpeg;base64,mock-base64',
      'data_url',
      { contentType: 'image/jpeg' },
    );
    expect(url).toBe('https://mock.url/profile.jpg');
  });

  test('uses picker-provided JPEG base64 data before reading from the file system', async () => {
    const url = await uploadProfilePhoto('user-123', {
      uri: 'file:///avatar.heic',
      mimeType: 'image/heic',
      base64: 'picker-base64',
      fileSize: 1024,
    });

    expect(FileSystem.readAsStringAsync).not.toHaveBeenCalled();
    expect(uploadString).toHaveBeenCalledWith(
      { path: expect.stringMatching(/^profilePictures\/user-123\/\d+\.jpg$/) },
      'data:image/jpeg;base64,picker-base64',
      'data_url',
      { contentType: 'image/jpeg' },
    );
    expect(url).toBe('https://mock.url/profile.jpg');
  });

  test('reports a friendly error when Firebase Storage cannot return a download URL', async () => {
    getDownloadURL.mockRejectedValueOnce(new Error('No download URL'));

    await expect(
      uploadProfilePhoto('user-123', {
        uri: 'file:///avatar.webp',
        mimeType: 'image/webp',
        fileSize: 1024,
      }),
    ).rejects.toThrow('Could not upload the selected image. Please try again.');
  });

  test('rejects invalid image types before uploading', async () => {
    await expect(
      uploadProfilePhoto('user-123', {
        uri: 'file:///avatar.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
      }),
    ).rejects.toThrow('Please upload a JPG, PNG or WebP image.');

    expect(FileSystem.readAsStringAsync).not.toHaveBeenCalled();
    expect(uploadString).not.toHaveBeenCalled();
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

    expect(FileSystem.readAsStringAsync).not.toHaveBeenCalled();
    expect(uploadString).not.toHaveBeenCalled();
    expect(getDownloadURL).not.toHaveBeenCalled();
  });
});
