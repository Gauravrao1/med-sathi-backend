import { drizzle } from 'drizzle-orm/better-sqlite3';
import Sqlite from 'better-sqlite3';
import * as schema from './schema.js';
import { databasePath } from '../utils/runtimePaths.js';
import { medicinesList, batchesList, alternativesList } from './medicines-data.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const sqlite: Sqlite.Database = new Sqlite(databasePath);
export const db = drizzle(sqlite, { schema });

// Auto create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
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
  sqlite.exec("ALTER TABLE community_posts ADD COLUMN attachment_type TEXT;");
} catch (e) {
  // column might already exist
}
try {
  sqlite.exec("ALTER TABLE users ADD COLUMN email TEXT UNIQUE;");
} catch (e) {
  // column might already exist
}
try {
  sqlite.exec("ALTER TABLE users ADD COLUMN password_hash TEXT;");
} catch (e) {
  // column might already exist
}

// Auto-seed on cold start if DB is empty (essential for Vercel where /tmp is ephemeral)
const medicineCount = sqlite.prepare('SELECT COUNT(*) as cnt FROM medicines').get() as any;
if (!medicineCount || medicineCount.cnt === 0) {
  console.log('Database empty — auto-seeding medicines, batches, and alternatives...');
  try {

    const insertMed = sqlite.prepare('INSERT OR IGNORE INTO medicines (id, brand_name, generic_name, manufacturer, dosage_form, strength, mrp, nppa_ceiling_price, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const insertBatch = sqlite.prepare('INSERT OR IGNORE INTO batches (id, medicine_id, batch_number, mfg_date, expiry_date, verification_status) VALUES (?, ?, ?, ?, ?, ?)');
    const insertAlt = sqlite.prepare('INSERT OR IGNORE INTO generic_alternatives (medicine_id, alternative_medicine_id, price_difference_pct) VALUES (?, ?, ?)');
    const insertUser = sqlite.prepare('INSERT OR IGNORE INTO users (id, phone, name, created_at) VALUES (?, ?, ?, ?)');

    const seedAll = sqlite.transaction(() => {
      for (const m of medicinesList) {
        insertMed.run(m.id, m.brand_name, m.generic_name, m.manufacturer, m.dosage_form, m.strength, m.mrp, m.nppa_ceiling_price, m.category);
      }
      for (const b of batchesList) {
        insertBatch.run(b.id, b.medicine_id, b.batch_number, b.mfg_date, b.expiry_date, b.verification_status);
      }
      for (const a of alternativesList) {
        insertAlt.run(a.medicine_id, a.alternative_medicine_id, a.price_difference_pct);
      }
      // Demo user so scan works without registration
      insertUser.run('demo-user-001', '9999999999', 'Demo User', Date.now());

      // Seed community demo data from seed-data.json
      const __filename2 = fileURLToPath(import.meta.url);
      const __dirname2 = path.dirname(__filename2);
      const seedPath = path.resolve(__dirname2, 'seed-data.json');
      if (fs.existsSync(seedPath)) {
        const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        const insertUserFull = sqlite.prepare('INSERT OR IGNORE INTO users (id, phone, name, age_bracket, preferred_language, chronic_conditions, created_at, consent_given_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        if (seedData.users) {
          for (const u of seedData.users) {
            insertUserFull.run(u.id, u.phone, u.name, u.age_bracket || null, u.preferred_language || 'en', u.chronic_conditions || null, u.created_at, u.consent_given_at || null);
          }
        }
        const insertPost = sqlite.prepare('INSERT OR IGNORE INTO community_posts (id, user_id, medicine_id, title, body, tags, likes, shares, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        if (seedData.community_posts) {
          for (const p of seedData.community_posts) {
            const tags = Array.isArray(p.tags) ? JSON.stringify(p.tags) : p.tags;
            insertPost.run(p.id, p.user_id, p.medicine_id || null, p.title, p.body, tags, p.likes || 0, p.shares || 0, p.created_at);
          }
        }
        const insertComment = sqlite.prepare('INSERT OR IGNORE INTO community_comments (id, post_id, user_id, body, parent_comment_id, created_at) VALUES (?, ?, ?, ?, ?, ?)');
        if (seedData.community_comments) {
          for (const c of seedData.community_comments) {
            insertComment.run(c.id, c.post_id, c.user_id, c.body, c.parent_comment_id || null, c.created_at);
          }
        }
        console.log('Auto-seed: community posts and comments seeded from seed-data.json');
      }
    });
    seedAll();
    console.log('Auto-seed complete: ' + medicinesList.length + ' medicines, ' + batchesList.length + ' batches, ' + alternativesList.length + ' alternatives.');
  } catch (seedErr) {
    console.error('Auto-seed failed:', seedErr);
  }
}
