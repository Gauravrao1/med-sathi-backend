import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';
const JWT_SECRET = process.env.JWT_SECRET || 'aslee-dev-secret-change-in-production';
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization token' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const users = await db.select().from(schema.users).where(eq(schema.users.id, decoded.id));
        if (users.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = users[0];
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
