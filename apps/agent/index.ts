// Initial scaffold for your backend-only RAG assistant using Express.js + LangGraph

// File: src/index.ts
import express from 'express';
import { createRAGGraph } from './langgraph';
import { queryRAG } from './rag';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Missing question in body.' });

  try {
    const result = await queryRAG(question);
    res.json({ response: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🧞 RAG Assistant running on http://localhost:${PORT}`);
});
