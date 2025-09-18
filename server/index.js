// Load .env from the project root (../.env) — avoids hardcoding absolute paths
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

// Allow only origins listed in env (comma-separated)
const allowed = (process.env.CORS_ALLOW_ORIGIN || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, cb) =>
        (!origin || allowed.length === 0 || allowed.includes(origin))
            ? cb(null, true)
            : cb(new Error('Not allowed by CORS'))
}));

app.use(express.json({ limit: '128kb' }));

app.use(rateLimit({
    windowMs: 60_000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false
}));

// Newsletter endpoint
app.use('/api/subscribe', subscribeRouter);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`[server] listening on :${port}`));
