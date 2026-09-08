import { Router } from 'express';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { authenticate } from '../middleware/auth.js';
import { eq, desc } from 'drizzle-orm';
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
const upload = multer({ storage });
const storageProvider = new LocalStorageProvider();
const router = Router();
router.get('/posts', async (req, res) => {
    try {
        const medicineId = req.query.medicine_id ? parseInt(req.query.medicine_id) : undefined;
        let query = db.select().from(schema.community_posts).orderBy(desc(schema.community_posts.created_at));
        if (medicineId) {
            query = db.select().from(schema.community_posts)
                .where(eq(schema.community_posts.medicine_id, medicineId))
                .orderBy(desc(schema.community_posts.created_at));
        }
        const posts = await query;
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch community posts' });
    }
});
router.post('/posts', authenticate, upload.single('attachment'), async (req, res) => {
    try {
        const { title, body, tags, medicine_id } = req.body;
        if (!title || !body) {
            return res.status(400).json({ error: 'Title and body are required' });
        }
        let attachment_url = null;
        let attachment_type = null;
        if (req.file) {
            const filename = await storageProvider.upload(req.file);
            attachment_url = storageProvider.getUrl(filename);
            if (req.file.mimetype.startsWith('image/')) {
                attachment_type = 'image';
            }
            else if (req.file.mimetype.startsWith('video/')) {
                attachment_type = 'video';
            }
            else {
                attachment_type = 'file';
            }
        }
        const newPost = {
            id: uuidv4(),
            user_id: req.user.id,
            medicine_id: medicine_id ? parseInt(medicine_id) : null,
            title,
            body,
            tags: tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : null,
            attachment_url,
            attachment_type,
            likes: 0,
            shares: 0,
            created_at: Date.now()
        };
        await db.insert(schema.community_posts).values(newPost);
        res.json(newPost);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});
router.post('/posts/:id/like', authenticate, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await db.select().from(schema.community_posts).where(eq(schema.community_posts.id, postId));
        if (post.length === 0)
            return res.status(404).json({ error: 'Post not found' });
        const newLikes = (post[0].likes || 0) + 1;
        await db.update(schema.community_posts)
            .set({ likes: newLikes })
            .where(eq(schema.community_posts.id, postId));
        res.json({ success: true, likes: newLikes });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to like post' });
    }
});
router.post('/posts/:id/share', authenticate, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await db.select().from(schema.community_posts).where(eq(schema.community_posts.id, postId));
        if (post.length === 0)
            return res.status(404).json({ error: 'Post not found' });
        const newShares = (post[0].shares || 0) + 1;
        await db.update(schema.community_posts)
            .set({ shares: newShares })
            .where(eq(schema.community_posts.id, postId));
        res.json({ success: true, shares: newShares });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to share post' });
    }
});
router.get('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const posts = await db.select().from(schema.community_posts).where(eq(schema.community_posts.id, postId));
        if (posts.length === 0)
            return res.status(404).json({ error: 'Post not found' });
        const comments = await db.select().from(schema.community_comments).where(eq(schema.community_comments.post_id, postId)).orderBy(schema.community_comments.created_at);
        res.json({ post: posts[0], comments });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch post details' });
    }
});
router.post('/posts/:id/comments', authenticate, async (req, res) => {
    try {
        const { body, parent_comment_id } = req.body;
        if (!body)
            return res.status(400).json({ error: 'Comment body is required' });
        const postId = req.params.id;
        const newComment = {
            id: uuidv4(),
            post_id: postId,
            user_id: req.user.id,
            body,
            parent_comment_id: parent_comment_id || null,
            created_at: Date.now()
        };
        await db.insert(schema.community_comments).values(newComment);
        res.json(newComment);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
});
router.get('/posts/:id/comments', async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await db.select().from(schema.community_comments)
            .where(eq(schema.community_comments.post_id, postId))
            .orderBy(schema.community_comments.created_at);
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});
export default router;
