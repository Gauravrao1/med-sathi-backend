import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localDataDir = path.resolve(__dirname, '../../');
const dataDir = process.env.DATA_DIR || (process.env.VERCEL ? '/tmp/med-sathi' : localDataDir);

export const databasePath = process.env.DATABASE_PATH || path.join(dataDir, 'sqlite.db');
export const uploadDir = process.env.UPLOAD_DIR || path.join(dataDir, 'uploads');

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });