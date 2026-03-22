import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

/**
 * Supabase JWT claims structure
 * @see https://supabase.com/docs/guides/auth/jwts
 */
export interface SupabaseJwtPayload extends JWTPayload {
  /** User's unique ID (UUID) */
  sub: string;
  /** Email address */
  email?: string;
  /** Phone number */
  phone?: string;
  /** Postgres role for RLS */
  role?: string;
  /** Authentication method used */
  aal?: string;
  /** Session ID */
  session_id?: string;
  /** Whether email is confirmed */
  email_confirmed_at?: string;
  /** Whether phone is confirmed */
  phone_confirmed_at?: string;
  /** App metadata (provider info, etc.) */
  app_metadata?: {
    provider?: string;
    providers?: string[];
    [key: string]: unknown;
  };
  /** User metadata (custom fields) */
  user_metadata?: Record<string, unknown>;
  /** Issuer - Supabase project URL */
  iss?: string;
  /** Issued at timestamp */
  iat?: number;
  /** Expiration timestamp */
  exp?: number;
  /** Audience */
  aud?: string;
}

/**
 * Extended request with Supabase user info
 */
export interface SupabaseAuthRequest extends Request {
  user?: SupabaseJwtPayload;
  userId?: string;
}

export interface SupabaseJwtMiddlewareOptions {
  /** Supabase project URL (e.g., https://xxxx.supabase.co) */
  supabaseUrl: string;
  /** Expected JWT audience (usually 'authenticated') */
  audience?: string;
  /** Cache duration for JWKS in milliseconds (default: 30000) */
  jwksCacheDuration?: number;
}

// Cache for JWKS fetchers per project
const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getJWKS(supabaseUrl: string, cacheDuration: number) {
  const cacheKey = supabaseUrl;

  if (!jwksCache.has(cacheKey)) {
    const jwksUrl = new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`);
    const jwks = createRemoteJWKSet(jwksUrl, {
      cooldownDuration: cacheDuration,
      cacheMaxAge: cacheDuration,
    });
    jwksCache.set(cacheKey, jwks);
  }

  return jwksCache.get(cacheKey)!;
}

/**
 * Creates Express middleware that verifies Supabase JWTs using JWKS.
 *
 * This is the recommended approach for API authentication as it:
 * - Verifies tokens locally without network calls (for RS256/ES256)
 * - Caches public keys from the JWKS endpoint
 * - Is significantly faster than getUser() calls
 *
 * Note: This doesn't check if a session was revoked server-side.
 * For critical operations, use createSupabaseClientMiddleware instead.
 *
 * @example
 * ```typescript
 * const authMiddleware = createSupabaseJwtMiddleware({
 *   supabaseUrl: 'https://xxxx.supabase.co',
 * });
 *
 * app.use('/api', authMiddleware, (req: SupabaseAuthRequest, res) => {
 *   console.log(req.user?.sub); // User ID
 *   console.log(req.user?.email);
 * });
 * ```
 *
 * @see https://supabase.com/docs/guides/auth/jwts
 */
export function createSupabaseJwtMiddleware(options: SupabaseJwtMiddlewareOptions) {
  const {
    supabaseUrl,
    audience = 'authenticated',
    jwksCacheDuration = 30_000,
  } = options;

  const issuer = `${supabaseUrl}/auth/v1`;

  return async (req: SupabaseAuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          ok: false,
          error: 'unauthorized',
          message: 'Missing or invalid Authorization header',
        });
      }

      const token = authHeader.substring(7);
      const jwks = getJWKS(supabaseUrl, jwksCacheDuration);

      const { payload } = await jwtVerify(token, jwks, {
        issuer,
        audience,
      });

      // Attach user info to request
      req.user = payload as SupabaseJwtPayload;
      req.userId = payload.sub;

      next();
    } catch (error) {
      // Handle specific JWT errors
      const errorMessage = error instanceof Error ? error.message : 'Token verification failed';

      if (errorMessage.includes('expired')) {
        return res.status(401).json({
          ok: false,
          error: 'token_expired',
          message: 'Access token has expired',
        });
      }

      if (errorMessage.includes('signature')) {
        return res.status(401).json({
          ok: false,
          error: 'invalid_signature',
          message: 'Invalid token signature',
        });
      }

      return res.status(401).json({
        ok: false,
        error: 'unauthorized',
        message: errorMessage,
      });
    }
  };
}

/**
 * Options for optional auth middleware
 */
export interface OptionalSupabaseJwtMiddlewareOptions extends SupabaseJwtMiddlewareOptions {
  /** If true, continues even without a valid token (user will be undefined) */
  allowAnonymous?: boolean;
}

/**
 * Creates middleware that optionally verifies Supabase JWTs.
 * If no token is provided or verification fails, continues without user info.
 * Useful for routes that work for both authenticated and anonymous users.
 *
 * @example
 * ```typescript
 * const optionalAuth = createOptionalSupabaseJwtMiddleware({
 *   supabaseUrl: 'https://xxxx.supabase.co',
 * });
 *
 * app.get('/api/posts', optionalAuth, (req: SupabaseAuthRequest, res) => {
 *   if (req.user) {
 *     // Authenticated user - show personalized content
 *   } else {
 *     // Anonymous user - show public content
 *   }
 * });
 * ```
 */
export function createOptionalSupabaseJwtMiddleware(options: SupabaseJwtMiddlewareOptions) {
  const {
    supabaseUrl,
    audience = 'authenticated',
    jwksCacheDuration = 30_000,
  } = options;

  const issuer = `${supabaseUrl}/auth/v1`;

  return async (req: SupabaseAuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token - continue without user
      return next();
    }

    try {
      const token = authHeader.substring(7);
      const jwks = getJWKS(supabaseUrl, jwksCacheDuration);

      const { payload } = await jwtVerify(token, jwks, {
        issuer,
        audience,
      });

      req.user = payload as SupabaseJwtPayload;
      req.userId = payload.sub;
    } catch {
      // Invalid token - continue without user (don't fail)
    }

    next();
  };
}

/**
 * Helper to extract user ID from request (throws if not authenticated)
 */
export function requireUserId(req: SupabaseAuthRequest): string {
  if (!req.userId) {
    throw new Error('User not authenticated');
  }
  return req.userId;
}
