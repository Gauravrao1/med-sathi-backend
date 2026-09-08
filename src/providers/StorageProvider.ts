import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface StorageProvider {
  upload(file: Express.Multer.File): Promise<string>;
  getUrl(key: string): string;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(__dirname, '../../uploads');
  }

  async upload(file: Express.Multer.File): Promise<string> {
    // multer already saves the file, just return the key
    return file.filename;
  }

  getUrl(key: string): string {
    return '/uploads/' + key;
  }
}
