import { uploadDir } from '../utils/runtimePaths.js';

export interface StorageProvider {
  upload(file: Express.Multer.File): Promise<string>;
  getUrl(key: string): string;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = uploadDir;
  }

  async upload(file: Express.Multer.File): Promise<string> {
    // multer already saves the file, just return the key
    return file.filename;
  }

  getUrl(key: string): string {
    return '/uploads/' + key;
  }
}
