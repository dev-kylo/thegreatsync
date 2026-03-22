import type { NextApiRequest, NextApiResponse } from 'next';

const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL || 'http://localhost:8787';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ADMIN_TOKEN) {
    console.error('ADMIN_TOKEN not configured');
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  // Build the target URL from the path segments
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path;
  const targetUrl = new URL(`/agents/${pathString}`, AGENT_SERVICE_URL);

  // Forward query parameters
  Object.entries(req.query).forEach(([key, value]) => {
    if (key !== 'path' && typeof value === 'string') {
      targetUrl.searchParams.set(key, value);
    }
  });

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
      },
    };

    // Add body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl.toString(), fetchOptions);

    // Handle SSE streaming responses
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/event-stream')) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body?.getReader();
      if (!reader) {
        return res.status(500).json({ error: 'stream_error' });
      }

      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } finally {
        reader.releaseLock();
        res.end();
      }
      return;
    }

    // Handle regular JSON responses
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Agent proxy error:', error);
    res.status(500).json({
      error: 'proxy_error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
