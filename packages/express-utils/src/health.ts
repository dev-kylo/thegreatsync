import { Request, Response } from 'express';
import { Pool } from 'pg';

export interface HealthCheckOptions {
  pool: Pool;
  serviceName?: string;
}

export function createHealthCheck(options: HealthCheckOptions) {
  const { pool, serviceName = 'service' } = options;

  return async (_req: Request, res: Response) => {
    try {
      await pool.query('SELECT 1');
      res.json({
        ok: true,
        status: 'healthy',
        service: serviceName,
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(503).json({
        ok: false,
        status: 'unhealthy',
        service: serviceName,
        database: 'disconnected',
        error: 'database_connection_failed',
        timestamp: new Date().toISOString(),
      });
    }
  };
}
