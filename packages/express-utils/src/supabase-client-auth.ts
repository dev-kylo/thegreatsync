import { Request, Response, NextFunction } from 'express';
import type { SupabaseClient, User } from '@supabase/supabase-js';

/**
 * Extended request with Supabase user from getUser()
 */
export interface SupabaseUserRequest extends Request {
  supabaseUser?: User;
  userId?: string;
}

export interface SupabaseClientMiddlewareOptions {
  /**
   * Factory function that creates a Supabase client for each request.
   * This allows you to pass the access token to the client.
   *
   * @example
   * ```typescript
   * createClient: (accessToken) => createClient(
   *   process.env.SUPABASE_URL!,
   *   process.env.SUPABASE_ANON_KEY!,
   *   {
   *     global: {
   *       headers: { Authorization: `Bearer ${accessToken}` }
   *     }
   *   }
   * )
   * ```
   */
  createClient: (accessToken: string) => SupabaseClient;
}

/**
 * Creates Express middleware that verifies users using Supabase's getUser() method.
 *
 * This is the most secure approach because it:
 * - Validates the token against the Supabase Auth server
 * - Checks if the session has been revoked
 * - Returns the full user object with latest data
 *
 * Trade-off: Requires a network call for each request (slower than JWT verification).
 * Use this for critical operations where you need to ensure the session is still valid.
 *
 * @example
 * ```typescript
 * import { createClient } from '@supabase/supabase-js';
 *
 * const authMiddleware = createSupabaseClientMiddleware({
 *   createClient: (accessToken) => createClient(
 *     process.env.SUPABASE_URL!,
 *     process.env.SUPABASE_ANON_KEY!,
 *     {
 *       global: {
 *         headers: { Authorization: `Bearer ${accessToken}` }
 *       }
 *     }
 *   )
 * });
 *
 * // Use for sensitive operations
 * app.delete('/api/account', authMiddleware, async (req: SupabaseUserRequest, res) => {
 *   // req.supabaseUser is guaranteed to be a valid, non-revoked session
 *   await deleteAccount(req.supabaseUser!.id);
 * });
 * ```
 *
 * @see https://supabase.com/docs/reference/javascript/auth-getuser
 */
export function createSupabaseClientMiddleware(options: SupabaseClientMiddlewareOptions) {
  const { createClient } = options;

  return async (req: SupabaseUserRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          ok: false,
          error: 'unauthorized',
          message: 'Missing or invalid Authorization header',
        });
      }

      const accessToken = authHeader.substring(7);
      const supabase = createClient(accessToken);

      // getUser() validates against the Auth server - most secure method
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return res.status(401).json({
          ok: false,
          error: 'unauthorized',
          message: error?.message ?? 'Invalid or expired session',
        });
      }

      req.supabaseUser = user;
      req.userId = user.id;

      next();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      return res.status(401).json({
        ok: false,
        error: 'unauthorized',
        message: errorMessage,
      });
    }
  };
}

/**
 * Type guard to check if user is authenticated
 */
export function isAuthenticated(req: SupabaseUserRequest): req is SupabaseUserRequest & { supabaseUser: User; userId: string } {
  return !!req.supabaseUser && !!req.userId;
}
