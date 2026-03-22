import { PoolConfig as PgPoolConfig, QueryResult, QueryResultRow, PoolClient } from 'pg';

export interface PoolConfig extends Omit<PgPoolConfig, 'connectionString'> {
  connectionString: string;
  statementTimeout?: number;
  queryTimeout?: number;
  idleTimeoutMillis?: number;
  max?: number;
}

export type { QueryResult, QueryResultRow, PoolClient };
