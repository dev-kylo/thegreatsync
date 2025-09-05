import 'dotenv/config';
import { Pool, PoolClient, QueryResult } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // optional safety defaults:
  statement_timeout: 120_000, // 120s
  query_timeout: 120_000,
  idleTimeoutMillis: 30_000,
  max: 10,
});

export async function withTx<T>(fn: (c: PoolClient)=>Promise<T>): Promise<T> {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const out = await fn(c);
    await c.query('COMMIT');
    return out;
  } catch (e) {
    await c.query('ROLLBACK');
    throw e;
  } finally {
    c.release();
  }
}

export async function q<T=any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  // Optional: name prepared statements based on a stable key
  return pool.query<T>(text, params);
}
