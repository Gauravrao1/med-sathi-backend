import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  phone: text('phone').unique().notNull(),
  name: text('name'),
  age_bracket: text('age_bracket'),
  preferred_language: text('preferred_language').default('en'),
  chronic_conditions: text('chronic_conditions'), // JSON string
  created_at: integer('created_at').notNull(),
  consent_given_at: integer('consent_given_at')
});

export const medicines = sqliteTable('medicines', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  brand_name: text('brand_name').notNull(),
  generic_name: text('generic_name').notNull(),
  manufacturer: text('manufacturer').notNull(),
  dosage_form: text('dosage_form').notNull(),
  strength: text('strength').notNull(),
  mrp: real('mrp').notNull(),
  nppa_ceiling_price: real('nppa_ceiling_price'),
  category: text('category').notNull()
});

export const batches = sqliteTable('batches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  medicine_id: integer('medicine_id').references(() => medicines.id).notNull(),
  batch_number: text('batch_number').unique().notNull(),
  mfg_date: text('mfg_date').notNull(),
  expiry_date: text('expiry_date').notNull(),
  verification_status: text('verification_status').notNull() // 'genuine' | 'inconclusive' | 'flagged'
});

export const recalls = sqliteTable('recalls', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  batch_id: integer('batch_id').references(() => batches.id).notNull(),
  reason: text('reason').notNull(),
  alert_date: text('alert_date').notNull(),
  severity: text('severity').notNull() // 'critical' | 'warning'
});

export const generic_alternatives = sqliteTable('generic_alternatives', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  medicine_id: integer('medicine_id').references(() => medicines.id).notNull(),
  alternative_medicine_id: integer('alternative_medicine_id').references(() => medicines.id).notNull(),
  price_difference_pct: real('price_difference_pct').notNull()
});

export const scans = sqliteTable('scans', {
  id: text('id').primaryKey(),
  user_id: text('user_id').references(() => users.id).notNull(),
  medicine_id: integer('medicine_id').references(() => medicines.id),
  batch_id: integer('batch_id').references(() => batches.id),
  scan_method: text('scan_method').notNull(), // 'qr' | 'photo'
  trust_score: real('trust_score'),
  trust_score_breakdown: text('trust_score_breakdown'), // JSON
  scanned_at: integer('scanned_at').notNull()
});

export const experience_posts = sqliteTable('experience_posts', {
  id: text('id').primaryKey(),
  user_id: text('user_id').references(() => users.id).notNull(),
  medicine_id: integer('medicine_id').references(() => medicines.id).notNull(),
  condition_tag: text('condition_tag').notNull(),
  media_type: text('media_type').notNull(), // 'text' | 'audio' | 'video'
  content_url: text('content_url'),
  caption: text('caption').notNull(),
  status: text('status').default('approved').notNull(),
  created_at: integer('created_at').notNull()
});

export const private_sessions = sqliteTable('private_sessions', {
  id: text('id').primaryKey(),
  host_user_id: text('host_user_id').references(() => users.id).notNull(),
  requester_user_id: text('requester_user_id').references(() => users.id).notNull(),
  medicine_id: integer('medicine_id').references(() => medicines.id).notNull(),
  scheduled_at: integer('scheduled_at').notNull(),
  duration_min: integer('duration_min').notNull(),
  price: real('price').notNull(),
  status: text('status').notNull() // 'requested' | 'confirmed' | 'completed' | 'cancelled'
});

export const community_posts = sqliteTable('community_posts', {
  id: text('id').primaryKey(),
  user_id: text('user_id').references(() => users.id).notNull(),
  medicine_id: integer('medicine_id').references(() => medicines.id),
  title: text('title').notNull(),
  body: text('body').notNull(),
  tags: text('tags'), // JSON string
  likes: integer('likes').default(0),
  shares: integer('shares').default(0),
  attachment_url: text('attachment_url'),
  attachment_type: text('attachment_type'), // 'image' | 'video' | 'file'
  created_at: integer('created_at').notNull()
});

export const community_comments = sqliteTable('community_comments', {
  id: text('id').primaryKey(),
  post_id: text('post_id').references(() => community_posts.id).notNull(),
  user_id: text('user_id').references(() => users.id).notNull(),
  body: text('body').notNull(),
  parent_comment_id: text('parent_comment_id'),
  created_at: integer('created_at').notNull()
});

export const ai_chat_sessions = sqliteTable('ai_chat_sessions', {
  id: text('id').primaryKey(),
  user_id: text('user_id').references(() => users.id).notNull(),
  medicine_id: integer('medicine_id').references(() => medicines.id),
  messages: text('messages').notNull(), // JSON string
  created_at: integer('created_at').notNull(),
  updated_at: integer('updated_at').notNull()
});
