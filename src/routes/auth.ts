import { Router } from 'express';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { otpStore, generateOtp, sendOtp } from '../utils/otp.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/auth.js';
import crypto from 'crypto';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'aslee-dev-secret-change-in-production';

// Strip sensitive fields before sending user data to client
function sanitizeUser(user: any) {
  if (!user) return user;
  const clean = { ...user };
  delete clean.password_hash;
  return clean;
}

router.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(phone, { otp, expiresAt });
  sendOtp(phone, otp);
  const challenge = jwt.sign({ phone, otp, purpose: 'otp' }, JWT_SECRET, { expiresIn: '5m' });

  // DEV MODE: Return OTP in response so the UI can show it.
  // PRODUCTION: Remove the `otp` field and integrate a real SMS gateway (MSG91, Twilio, etc.)
  res.json({ message: 'OTP sent successfully', otp, challenge });
});

router.post('/verify-otp', async (req, res) => {
  const { phone, otp, challenge } = req.body;
  let stored = otpStore.get(phone);

  if (challenge) {
    try {
      const payload = jwt.verify(challenge, JWT_SECRET) as jwt.JwtPayload;
      if (payload.purpose === 'otp' && payload.phone === phone && typeof payload.otp === 'string') {
        stored = { otp: payload.otp, expiresAt: (payload.exp || 0) * 1000 };
      }
    } catch {
      stored = undefined;
    }
  }

  if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  otpStore.delete(phone);

  let users = await db.select().from(schema.users).where(eq(schema.users.phone, phone));
  let user = users[0];

  if (!user) {
    const newUser = {
      id: uuidv4(),
      phone,
      created_at: Date.now()
    };
    await db.insert(schema.users).values(newUser);
    user = (await db.select().from(schema.users).where(eq(schema.users.phone, phone)))[0];
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

router.put('/profile', authenticate, async (req, res) => {
  const { name, age_bracket, chronic_conditions, preferred_language } = req.body;
  
  await db.update(schema.users)
    .set({
      name,
      age_bracket,
      chronic_conditions: chronic_conditions ? JSON.stringify(chronic_conditions) : null,
      preferred_language
    })
    .where(eq(schema.users.id, req.user.id));

  const updatedUser = (await db.select().from(schema.users).where(eq(schema.users.id, req.user.id)))[0];
  res.json(updatedUser);
});

router.post('/consent', authenticate, async (req, res) => {
  await db.update(schema.users)
    .set({ consent_given_at: Date.now() })
    .where(eq(schema.users.id, req.user.id));

  res.json({ message: 'Consent recorded successfully' });
});

router.get('/me', authenticate, (req, res) => {
  res.json(req.user);
});

router.post('/register', async (req, res) => {
  const { email, password, name, phone } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existingByEmail = await db.select().from(schema.users).where(eq(schema.users.email, email));
  if (existingByEmail.length > 0) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  if (phone) {
    const existingByPhone = await db.select().from(schema.users).where(eq(schema.users.phone, phone));
    if (existingByPhone.length > 0) {
      return res.status(409).json({ error: 'Phone number already registered' });
    }
  }

  try {
    const password_hash = crypto.createHash('sha256').update(password + 'medsathi-salt').digest('hex');
    const newUser = {
      id: uuidv4(),
      phone: phone || '',
      email,
      password_hash,
      name,
      created_at: Date.now()
    };

    await db.insert(schema.users).values(newUser);
    const user = (await db.select().from(schema.users).where(eq(schema.users.id, newUser.id)))[0];
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: sanitizeUser(user) });
  } catch (err: any) {
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await db.select().from(schema.users).where(eq(schema.users.email, email));
  const user = users[0];

  if (!user || !user.password_hash) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const hash = crypto.createHash('sha256').update(password + 'medsathi-salt').digest('hex');
  if (hash !== user.password_hash) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: sanitizeUser(user) });
});

router.post('/forgot-password', async (req, res) => {
  const { phone } = req.body;
  const users = await db.select().from(schema.users).where(eq(schema.users.phone, phone));
  if (users.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(phone, { otp, expiresAt });
  sendOtp(phone, otp);
  console.log('WhatsApp OTP for +91-' + phone + ': ' + otp);
  
  res.json({ message: 'OTP sent to WhatsApp', otp });
});

router.post('/reset-password', async (req, res) => {
  const { phone, otp, new_password } = req.body;
  const stored = otpStore.get(phone);

  if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  const password_hash = crypto.createHash('sha256').update(new_password + 'medsathi-salt').digest('hex');
  await db.update(schema.users)
    .set({ password_hash })
    .where(eq(schema.users.phone, phone));

  otpStore.delete(phone);
  res.json({ message: 'Password reset successful' });
});

export default router;
