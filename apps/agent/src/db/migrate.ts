import { pool } from './pool';
import fs from 'fs';
import path from 'path';

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rag._migrations (
      id BIGSERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT now()
    );
  `);
}

function sha1(s: string) {
  return require('node:crypto').createHash('sha1').update(s).digest('hex');
}

async function main() {
  await ensureMigrationsTable();
  const dir = path.join(__dirname, 'sql');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    const { rows } = await pool.query('SELECT checksum FROM rag._migrations WHERE filename=$1', [file]);
    const hash = sha1(sql);
    if (rows[0]?.checksum === hash) {
      console.log(`✓ ${file} (already applied)`);
      continue;
    }
    await pool.query('BEGIN');
    try {
      await pool.query(sql);
      await pool.query(
        `INSERT INTO rag._migrations(filename, checksum)
         VALUES ($1,$2)
         ON CONFLICT (filename) DO UPDATE SET checksum=EXCLUDED.checksum, applied_at=now()`,
        [file, hash]
      );
      await pool.query('COMMIT');
      console.log(`→ applied ${file}`);
    } catch (e) {
      await pool.query('ROLLBACK');
      console.error(`✗ failed ${file}:`, e);
      process.exit(1);
    }
  }
  await pool.end();
}
main();
