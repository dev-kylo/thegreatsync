export { createAuthMiddleware, AuthMiddlewareOptions } from './auth';
export { createHealthCheck, HealthCheckOptions } from './health';
export { validateBody, formatZodError, ValidationErrorResponse } from './validation';

// Supabase authentication utilities
export {
  createSupabaseJwtMiddleware,
  createOptionalSupabaseJwtMiddleware,
  requireUserId,
  SupabaseJwtMiddlewareOptions,
  SupabaseJwtPayload,
  SupabaseAuthRequest,
} from './supabase-auth';

export {
  createSupabaseClientMiddleware,
  isAuthenticated,
  SupabaseClientMiddlewareOptions,
  SupabaseUserRequest,
} from './supabase-client-auth';
