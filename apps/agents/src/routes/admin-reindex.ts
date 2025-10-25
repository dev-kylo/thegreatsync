import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const router = Router();

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  return crypto.timingSafeEqual(bufA, bufB);
}

const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.ADMIN_TOKEN;

  if (!expectedToken) {
    console.error('ADMIN_TOKEN not configured');
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const providedToken = authHeader.substring(7); // Remove 'Bearer ' prefix

  if (!timingSafeCompare(providedToken, expectedToken)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  next();
};

router.post('/rag/reindex', adminOnly, async (req, res) => {
  try {
    const strapiUrl = process.env.STRAPI_URL;
    const strapiToken = process.env.STRAPI_ADMIN_TOKEN;

    if (!strapiUrl || !strapiToken) {
      return res.status(500).json({
        ok: false,
        error: 'strapi_not_configured'
      });
    }

    const response = await fetch(`${strapiUrl}/api/rag/reindex`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${strapiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body ?? {}),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Reindex proxy error:', error);
    res.status(500).json({
      ok: false,
      error: 'reindex_failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
