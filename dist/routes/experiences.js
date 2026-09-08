import { Router } from 'express';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { authenticate } from '../middleware/auth.js';
import { eq, desc, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import { LocalStorageProvider } from '../providers/StorageProvider.js';
import { uploadDir } from '../utils/runtimePaths.js';
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only images and videos are allowed!'), false);
    }
};
const upload = multer({ storage, fileFilter });
const router = Router();
const storageProvider = new LocalStorageProvider();
router.get('/', async (req, res) => {
    try {
        const medicineId = req.query.medicine_id ? parseInt(req.query.medicine_id) : undefined;
        let condition = eq(schema.experience_posts.status, 'approved');
        if (medicineId) {
            condition = and(condition, eq(schema.experience_posts.medicine_id, medicineId));
        }
        const posts = await db.select().from(schema.experience_posts)
            .where(condition)
            .orderBy(desc(schema.experience_posts.created_at));
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
});
router.post('/', authenticate, upload.single('media'), async (req, res) => {
    try {
        const { medicine_id, condition_tag, media_type, caption } = req.body;
        if (!medicine_id || !condition_tag || !media_type || !caption) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        let content_url = null;
        if (req.file) {
            const filename = await storageProvider.upload(req.file);
            content_url = storageProvider.getUrl(filename);
        }
        const newExp = {
            id: uuidv4(),
            user_id: req.user.id,
            medicine_id: parseInt(medicine_id),
            condition_tag,
            media_type,
            content_url,
            caption,
            status: 'approved', // Auto approve for demo
            created_at: Date.now()
        };
        await db.insert(schema.experience_posts).values(newExp);
        res.json(newExp);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create experience post' });
    }
});
router.post('/sessions/book', authenticate, async (req, res) => {
    try {
        const { host_user_id, medicine_id, scheduled_at, duration_min, price } = req.body;
        const newSession = {
            id: uuidv4(),
            host_user_id,
            requester_user_id: req.user.id,
            medicine_id: parseInt(medicine_id),
            scheduled_at: parseInt(scheduled_at),
            duration_min: parseInt(duration_min),
            price: parseFloat(price),
            status: 'confirmed' // simulate payment success
        };
        await db.insert(schema.private_sessions).values(newSession);
        res.json(newSession);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to book session' });
    }
});
router.get('/sessions', authenticate, async (req, res) => {
    try {
        const sessions = await db.select().from(schema.private_sessions)
            .where(eq(schema.private_sessions.requester_user_id, req.user.id))
            .orderBy(desc(schema.private_sessions.scheduled_at));
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});
export default router;
