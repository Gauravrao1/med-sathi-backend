import { Router } from 'express';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { authenticate } from '../middleware/auth.js';
import { GeminiChatProvider } from '../providers/AIChatProvider.js';
import { SeedDataProvider } from '../providers/DataProvider.js';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
const aiProvider = new GeminiChatProvider();
const dataProvider = new SeedDataProvider();
router.post('/', authenticate, async (req, res) => {
    try {
        const { message, medicine_id, session_id } = req.body;
        if (!message)
            return res.status(400).json({ error: 'Message is required' });
        let medContext = null;
        if (medicine_id) {
            medContext = await dataProvider.getMedicineById(parseInt(medicine_id));
        }
        let sessionId = session_id;
        let messages = [];
        if (sessionId) {
            const existing = await db.select().from(schema.ai_chat_sessions).where(eq(schema.ai_chat_sessions.id, sessionId));
            if (existing.length > 0) {
                messages = JSON.parse(existing[0].messages);
            }
        }
        else {
            sessionId = uuidv4();
        }
        messages.push({ role: 'user', content: message });
        const aiResponse = await aiProvider.chat(messages, medContext);
        messages.push({ role: 'assistant', content: aiResponse });
        const sessionData = {
            id: sessionId,
            user_id: req.user.id,
            medicine_id: medicine_id ? parseInt(medicine_id) : null,
            messages: JSON.stringify(messages),
            created_at: Date.now(),
            updated_at: Date.now()
        };
        if (session_id && messages.length > 2) {
            await db.update(schema.ai_chat_sessions)
                .set({ messages: JSON.stringify(messages), updated_at: Date.now() })
                .where(eq(schema.ai_chat_sessions.id, sessionId));
        }
        else {
            await db.insert(schema.ai_chat_sessions).values(sessionData);
        }
        res.json({ session_id: sessionId, response: aiResponse });
    }
    catch (error) {
        res.status(500).json({ error: 'AI chat failed' });
    }
});
router.get('/sessions', authenticate, async (req, res) => {
    try {
        const sessions = await db.select().from(schema.ai_chat_sessions)
            .where(eq(schema.ai_chat_sessions.user_id, req.user.id))
            .orderBy(desc(schema.ai_chat_sessions.updated_at));
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat sessions' });
    }
});
export default router;
