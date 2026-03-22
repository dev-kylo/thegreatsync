import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Middleware to require ADMIN_TOKEN for protected endpoints
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.ADMIN_TOKEN;

  if (!expectedToken) {
    console.error('ADMIN_TOKEN not configured');
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const providedToken = authHeader.substring(7);

  if (!timingSafeCompare(providedToken, expectedToken)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  next();
};
