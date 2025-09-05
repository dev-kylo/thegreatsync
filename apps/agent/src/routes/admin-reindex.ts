import { Router } from 'express';

const router = Router();
const adminOnly = (req:any,res:any,next:any)=>{
  if (req.headers.authorization === `Bearer ${process.env.ADMIN_TOKEN}`) return next();
  return res.status(401).json({ error: 'unauthorized' });
};

router.post('/rag/reindex', adminOnly, async (req, res) => {
  const r = await fetch(`${process.env.STRAPI_URL}/api/rag/reindex`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body ?? {}),
  });
  res.status(r.status).json(await r.json());
});

export default router;
