import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import ragQuery from './routes/rag-query';
import ragFeedback from './routes/rag-feedback';
import adminReindex from './routes/admin-reindex';
import { pool } from './db/pool';

// Validate required environment variables at startup
const requiredEnvVars = ['DATABASE_URL', 'OPENAI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:1218', 'http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));



app.use(ragQuery);
app.use(ragFeedback);
app.use(adminReindex); // optional


app.get('/health', async (_, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, status: 'healthy', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      ok: false,
      status: 'unhealthy',
      error: 'database_connection_failed'
    });
  }
});

const PORT = process.env.PORT ?? 8787;
app.listen(PORT, () => {
  console.log(`🚀 Agent server running on port ${PORT}`);
});
