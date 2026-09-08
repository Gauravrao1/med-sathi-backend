import { db, sqlite } from './index.js';
import * as schema from './schema.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { medicinesList, batchesList, alternativesList } from './medicines-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  console.log('🌱 Starting database seeding...');
  const seedDataPath = path.resolve(__dirname, 'seed-data.json');
  
  // seed-data.json is still used for community posts, experiences, recalls, alternatives, users
  let data: any = {};
  if (fs.existsSync(seedDataPath)) {
    const rawData = fs.readFileSync(seedDataPath, 'utf8');
    data = JSON.parse(rawData);
  }

  // Clear existing data (in reverse dependency order)
  sqlite.exec('DELETE FROM ai_chat_sessions; DELETE FROM community_comments; DELETE FROM community_posts; DELETE FROM private_sessions; DELETE FROM experience_posts; DELETE FROM scans; DELETE FROM generic_alternatives; DELETE FROM recalls; DELETE FROM batches; DELETE FROM medicines; DELETE FROM users;');

  console.log('🧹 Cleared existing data.');

  // Insert Users
  if (data.users && data.users.length > 0) {
    for (const user of data.users) {
      await db.insert(schema.users).values(user);
    }
    console.log('✅ Inserted ' + data.users.length + ' users.');
  }

  // Insert Medicines from NEW comprehensive database (500+ medicines)
  for (const med of medicinesList) {
    await db.insert(schema.medicines).values(med);
  }
  console.log('✅ Inserted ' + medicinesList.length + ' medicines (comprehensive Indian medicine DB).');

  // Insert Batches from NEW comprehensive database (300 batches)
  for (const batch of batchesList) {
    await db.insert(schema.batches).values(batch);
  }
  console.log('✅ Inserted ' + batchesList.length + ' batches.');

  // (batches are now inserted from medicines-data.ts above)

  // Insert Recalls
  if (data.recalls && data.recalls.length > 0) {
    for (const recall of data.recalls) {
      await db.insert(schema.recalls).values(recall);
    }
    console.log(`✅ Inserted ${data.recalls.length} recalls.`);
  }

  // Insert Generic Alternatives (from medicines-data.ts with correct Jan Aushadhi mappings)
  for (const alt of alternativesList) {
    await db.insert(schema.generic_alternatives).values(alt);
  }
  console.log('✅ Inserted ' + alternativesList.length + ' Jan Aushadhi generic alternatives.');

  // Insert Community Posts
  if (data.community_posts && data.community_posts.length > 0) {
    for (const post of data.community_posts) {
      await db.insert(schema.community_posts).values({
        ...post,
        tags: JSON.stringify(post.tags)
      });
    }
    console.log(`✅ Inserted ${data.community_posts.length} community posts.`);
  }

  // Insert Community Comments
  if (data.community_comments && data.community_comments.length > 0) {
    for (const comment of data.community_comments) {
      await db.insert(schema.community_comments).values(comment);
    }
    console.log(`✅ Inserted ${data.community_comments.length} community comments.`);
  }

  // Insert Experience Posts
  if (data.experience_posts && data.experience_posts.length > 0) {
    for (const exp of data.experience_posts) {
      await db.insert(schema.experience_posts).values(exp);
    }
    console.log(`✅ Inserted ${data.experience_posts.length} experience posts.`);
  }

  console.log('🎉 Seeding completed successfully!');
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
