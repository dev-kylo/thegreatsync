import { Router } from 'express';
import { z } from 'zod';
import { withTx } from '../db/pool';

const router = Router();

const FeedbackSchema = z.object({
  interaction: z.object({
    user_id: z.string().optional(),
    intent: z.string().optional(),
    query: z.string(),
    answer: z.string(),
    retrieved_chunk_uids: z.array(z.string()).optional(),
    selected_chunk_uids: z.array(z.string()).optional(),
    selected_snippets: z.array(z.string()).optional(),
    domain: z.string().optional(),
    outcome: z.number().int().optional(),  // -1/0/1
    notes: z.string().optional(),
  }),
  judgments: z.array(z.object({
    pos_chunk_uid: z.string().optional(),
    neg_chunk_uid: z.string().optional(),
    label: z.number().int(), // +1 or -1
    reason: z.string().optional(),
  })).optional(),
});

router.post('/rag/feedback', async (req, res) => {
  const body = FeedbackSchema.parse(req.body);

  const interactionId = await withTx(async (c) => {
    const r1 = await c.query(
      `INSERT INTO rag.interactions
       (user_id,intent,query,answer,retrieved_chunk_uids,selected_chunk_uids,selected_snippets,domain,outcome,notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [
        body.interaction.user_id ?? null,
        body.interaction.intent ?? null,
        body.interaction.query,
        body.interaction.answer,
        body.interaction.retrieved_chunk_uids ?? null,
        body.interaction.selected_chunk_uids ?? null,
        body.interaction.selected_snippets ?? null,
        body.interaction.domain ?? null,
        body.interaction.outcome ?? null,
        body.interaction.notes ?? null,
      ]
    );
    const id = r1.rows[0].id as number;

    if (body.judgments?.length) {
      const values = body.judgments.map((_, i) =>
        `($1, $2, $${3+i*4}, $${4+i*4}, $${5+i*4}, $${6+i*4})`).join(',');
      const params: any[] = [id, body.interaction.query];
      body.judgments.forEach(j => {
        params.push(j.pos_chunk_uid ?? null, j.neg_chunk_uid ?? null, j.label, j.reason ?? null);
      });
      await c.query(
        `INSERT INTO rag.judgments (interaction_id, query, pos_chunk_uid, neg_chunk_uid, label, reason)
         VALUES ${values}`, params);
    }
    return id;
  });

  res.json({ ok: true, interactionId });
});

export default router;
