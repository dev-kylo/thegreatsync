import { Pool, QueryResult, QueryResultRow } from 'pg';
import { PoolConfig } from './types';

export interface DatabasePool {
  pool: Pool;
  query: <T extends QueryResultRow = any>(text: string, params?: any[]) => Promise<QueryResult<T>>;
  end: () => Promise<void>;
}

const DEFAULT_CONFIG = {
  statementTimeout: 120_000,
  queryTimeout: 120_000,
  idleTimeoutMillis: 30_000,
  max: 10,
};

export function createPool(config: PoolConfig): DatabasePool {
  const pool = new Pool({
    connectionString: config.connectionString,
    statement_timeout: config.statementTimeout ?? DEFAULT_CONFIG.statementTimeout,
    query_timeout: config.queryTimeout ?? DEFAULT_CONFIG.queryTimeout,
    idleTimeoutMillis: config.idleTimeoutMillis ?? DEFAULT_CONFIG.idleTimeoutMillis,
    max: config.max ?? DEFAULT_CONFIG.max,
  });

  async function query<T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>> {
    return pool.query<T>(text, params);
  }

  async function end(): Promise<void> {
    await pool.end();
  }

  return { pool, query, end };
}
