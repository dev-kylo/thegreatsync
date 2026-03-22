import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

export async function runSqlDir(pool: Pool, dir: string) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), 'utf8');
    if (sql.trim()) await pool.query(sql);
  }
}
