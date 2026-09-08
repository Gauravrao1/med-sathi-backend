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
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)
  .concat('https://med-sathi-frontend.vercel.app');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin not allowed by CORS'));
  }
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