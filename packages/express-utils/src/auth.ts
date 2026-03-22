import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export interface AuthMiddlewareOptions {
  tokenEnvVar?: string;
  token?: string;
}

export function createAuthMiddleware(options: AuthMiddlewareOptions = {}) {
  const { tokenEnvVar = 'ADMIN_TOKEN', token } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const expectedToken = token ?? process.env[tokenEnvVar];

    if (!expectedToken) {
      console.error(`Auth token not configured (env: ${tokenEnvVar})`);
      return res.status(500).json({ error: 'server_misconfigured' });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const providedToken = authHeader.substring(7);

    if (!timingSafeCompare(providedToken, expectedToken)) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    next();
  };
}
