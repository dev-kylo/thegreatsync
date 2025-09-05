import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { z } from 'zod';
import OpenAI from 'openai';
import ragQuery from './routes/rag-query';
import ragFeedback from './routes/rag-feedback';
import adminReindex from './routes/admin-reindex';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.EMBED_MODEL ?? 'text-embedding-3-small';



app.use(ragQuery);
app.use(ragFeedback);
app.use(adminReindex); // optional


app.get('/health', async (_, res) => {
  await pool.query('select 1');
  res.json({ ok: true });
});
