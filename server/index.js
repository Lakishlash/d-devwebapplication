// server/index.js
// Load .env from the project root (../.env)
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import subscribeRouter from './routes/subscribe.js';

const app = express();

// CORS
const allowed = (process.env.CORS_ALLOW_ORIGIN || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, cb) =>
        (!origin || allowed.length === 0 || allowed.includes(origin))
            ? cb(null, true)
            : cb(new Error('Not allowed by CORS')),
}));

app.use(express.json({ limit: '128kb' }));

app.use(rateLimit({
    windowMs: 60_000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
}));

// Newsletter endpoint
app.use('/api/subscribe', subscribeRouter);

const port = process.env.PORT || 5001;
console.log('[env] loaded from:', path.resolve(__dirname, '../.env'));
console.log('[server] CORS allowed:', allowed.join(', ') || '(all)');
console.log(process.env.SENDGRID_API_KEY ? '[sendgrid] API key present' : '[sendgrid] API key MISSING');
console.log('[sendgrid] From email', process.env.SENDGRID_FROM || process.env.SENDGRID_FROM_EMAIL || '(missing)');

app.listen(port, () => console.log(`[server] listening on :${port}`));
