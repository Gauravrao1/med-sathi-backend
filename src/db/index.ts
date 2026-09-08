import { drizzle } from 'drizzle-orm/better-sqlite3';
import Sqlite from 'better-sqlite3';
import * as schema from './schema.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../sqlite.db');

export const sqlite: Sqlite.Database = new Sqlite(dbPath);
export const db = drizzle(sqlite, { schema });

// Auto create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    age_bracket TEXT,
    preferred_language TEXT DEFAULT 'en',
    chronic_conditions TEXT,
    created_at INTEGER NOT NULL,
    consent_given_at INTEGER
  );
  
  CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    dosage_form TEXT NOT NULL,
    strength TEXT NOT NULL,
    mrp REAL NOT NULL,
    nppa_ceiling_price REAL,
    category TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicine_id INTEGER NOT NULL REFERENCES medicines(id),
    batch_number TEXT UNIQUE NOT NULL,
    mfg_date TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    verification_status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS recalls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id INTEGER NOT NULL REFERENCES batches(id),
    reason TEXT NOT NULL,
    alert_date TEXT NOT NULL,
    severity TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS generic_alternatives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicine_id INTEGER NOT NULL REFERENCES medicines(id),
    alternative_medicine_id INTEGER NOT NULL REFERENCES medicines(id),
    price_difference_pct REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    medicine_id INTEGER REFERENCES medicines(id),
    batch_id INTEGER REFERENCES batches(id),
    scan_method TEXT NOT NULL,
    trust_score REAL,
    trust_score_breakdown TEXT,
    scanned_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS experience_posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    medicine_id INTEGER NOT NULL REFERENCES medicines(id),
    condition_tag TEXT NOT NULL,
    media_type TEXT NOT NULL,
    content_url TEXT,
    caption TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS private_sessions (
    id TEXT PRIMARY KEY,
    host_user_id TEXT NOT NULL REFERENCES users(id),
    requester_user_id TEXT NOT NULL REFERENCES users(id),
    medicine_id INTEGER NOT NULL REFERENCES medicines(id),
    scheduled_at INTEGER NOT NULL,
    duration_min INTEGER NOT NULL,
    price REAL NOT NULL,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS community_posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    medicine_id INTEGER REFERENCES medicines(id),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    tags TEXT,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    attachment_url TEXT,
    attachment_type TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS community_comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES community_posts(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    parent_comment_id TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ai_chat_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    medicine_id INTEGER REFERENCES medicines(id),
    messages TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

try {
  sqlite.exec(`ALTER TABLE community_posts ADD COLUMN likes INTEGER DEFAULT 0;`);
} catch (e) {
  // column might already exist
}
try {
  sqlite.exec(`ALTER TABLE community_posts ADD COLUMN shares INTEGER DEFAULT 0;`);
} catch (e) {
  // column might already exist
}
try {
  sqlite.exec(`ALTER TABLE community_posts ADD COLUMN attachment_url TEXT;`);
} catch (e) {
  // column might already exist
}
try {
  sqlite.exec(`ALTER TABLE community_posts ADD COLUMN attachment_type TEXT;`);
} catch (e) {
  // column might already exist
}
