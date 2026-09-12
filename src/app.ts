import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './db/index.js';
import { uploadDir } from './utils/runtimePaths.js';

import authRoutes from './routes/auth.js';
import medRoutes from './routes/medicines.js';
import scanRoutes from './routes/scan.js';
import communityRoutes from './routes/community.js';
import expRoutes from './routes/experiences.js';
import chatRoutes from './routes/chat.js';

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://med-sathi-frontend.vercel.app',
  'https://med-sathi-frontend-qgybhd90-rags2.vercel.app',
  ...(process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
];

app.use(cors({
  origin: (origin, callback) => {
    console.log('CORS request origin:', origin);

    if (!origin) {
      callback(null, true);
      return;
    }

    // Allow the MedSathi Vercel frontend and its deployment URLs
    const isMedSathiVercel =
      /^https:\/\/med-sathi-frontend(?:-[a-z0-9-]+)?\.vercel\.app$/.test(origin);

    if (allowedOrigins.includes(origin) || isMedSathiVercel) {
      callback(null, true);
      return;
    }

    console.error('Blocked CORS origin:', origin);
    callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/experiences', expRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (_req, res) => res.json({
  name: 'MedSathi Backend',
  status: 'ok',
  health: '/health'
}));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;