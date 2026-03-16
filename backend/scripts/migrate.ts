import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import { loadEnv } from '../src/env';

async function run() {
  const env = loadEnv();
  const pool = new Pool({ connectionString: env.DATABASE_URL });

  await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (filename text primary key, applied_at timestamptz default now())');

  const dir = join(__dirname, '..', 'migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    const already = await pool.query('SELECT 1 FROM schema_migrations WHERE filename=$1', [file]);
    if (already.rowCount) continue;

    const sql = readFileSync(join(dir, file), 'utf8');
    console.log(`Applying ${file}...`);
    await pool.query(sql);
    await pool.query('INSERT INTO schema_migrations(filename) VALUES($1)', [file]);
  }

  await pool.end();
  console.log('Migrations complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});