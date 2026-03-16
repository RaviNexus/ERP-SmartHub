import "dotenv/config";
import { Pool } from 'pg';
import * as argon2 from 'argon2';
import { loadEnv } from '../src/env';

async function run() {
  const env = loadEnv();
  const pool = new Pool({ connectionString: env.DATABASE_URL });

  const email = process.env.SUPER_ADMIN_EMAIL ?? 'admin@smarthub.local';
  const password = process.env.SUPER_ADMIN_PASSWORD ?? 'Admin@12345!';
  const fullName = process.env.SUPER_ADMIN_NAME ?? 'Super Admin';

  const tenantRes = await pool.query('select id from tenants limit 1');
  const tenantId = tenantRes.rows.length
    ? tenantRes.rows[0].id
    : (await pool.query(
        'insert into tenants(company_name, subdomain, status) values($1,$2,$3) returning id',
        ['Default Tenant', 'default', 'active'],
      )).rows[0].id;

  const roleRes = await pool.query(
    'select id from roles where tenant_id=$1 and name=$2 limit 1',
    [tenantId, 'SUPER_ADMIN'],
  );
  const roleId = roleRes.rows.length
    ? roleRes.rows[0].id
    : (await pool.query(
        'insert into roles(tenant_id, name, description, is_default, is_system_role) values($1,$2,$3,$4,$5) returning id',
        [tenantId, 'SUPER_ADMIN', 'System super administrator', false, true],
      )).rows[0].id;

  const userRes = await pool.query('select id from users where email=$1 limit 1', [email]);
  if (userRes.rows.length === 0) {
    const hash = await argon2.hash(password);
    await pool.query(
      'insert into users(tenant_id, role_id, full_name, email, password_hash, status) values($1,$2,$3,$4,$5,$6)',
      [tenantId, roleId, fullName, email, hash, 'active'],
    );
    console.log('Super admin created');
  } else {
    console.log('Super admin already exists');
  }

  console.log(`Login email: ${email}`);
  console.log(`Login password: ${password}`);
  await pool.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});