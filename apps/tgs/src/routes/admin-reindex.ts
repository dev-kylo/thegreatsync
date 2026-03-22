import { Router } from 'express';

const router = Router();

router.post('/rag/reindex', async (req, res) => {
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
