# Setup Guide (SmartHub ERP)

## Prerequisites
- Git
- Node.js 24 LTS (>=24.14.x)
- pnpm 9 (global): `npm install -g pnpm@9`
- Optional: Docker Desktop (if you prefer containerized infra or full stack)

## Clone
```powershell
Set-Location "D:\DEMO"
git clone <repo-url> ERP
Set-Location "D:\DEMO\ERP"
```

## Option 1: Host-only (no Docker)
1) Install Postgres 18 (db: `erp`, user/pass `erp`), Redis 8 (6379), Kafka 4 (localhost:9092).
2) Copy envs:
```powershell
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
3) Install deps (PowerShell: no `&&`):
```powershell
pnpm.cmd install
```
4) Run migrations + seed super admin:
```powershell
pnpm --filter erp-backend migrate
pnpm --filter erp-backend seed:admin
```
5) Run apps:
```powershell
pnpm --filter erp-backend start:dev   # http://localhost:3000
pnpm --filter erp-frontend dev        # http://localhost:5173
```

## Option 2: Hybrid (Docker infra, host apps)
```powershell
docker compose up -d                 # starts Postgres/Redis/Kafka only
pnpm.cmd install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
pnpm --filter erp-backend migrate
pnpm --filter erp-backend seed:admin
pnpm --filter erp-backend start:dev
pnpm --filter erp-frontend dev
```

## Option 3: Full Docker (infra + apps)
```powershell
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env  # VITE_API_BASE_URL -> http://backend:3000 if needed
docker compose -f docker-compose.app.yml up --build
```
- Backend: http://localhost:3000
- Frontend: http://localhost:4173

## Notes / Gotchas
- PowerShell: use `pnpm.cmd` and semicolons; don’t chain with `&&`.
- If Nest dev fails with missing types for pg, ensure `@types/pg` is installed (already in package.json) and re-run `pnpm.cmd install --filter erp-backend`.
- Swagger UI is available at `http://localhost:3000/docs` when `SWAGGER_ENABLED=true`. It requires `@nestjs/swagger` to be installed; if your network blocks it, install later and it will auto-enable.
- Peer-dep warnings (React 18 + Mantine 7, ESLint 8 + @typescript-eslint 7) are expected and non-blocking.

## Maintenance
- Stop infra only: `docker compose down`
- Stop full stack: `docker compose -f docker-compose.app.yml down`
- Clean volumes (data loss): add `-v`
- Lint all: `pnpm lint`
- Test all: `pnpm test`

## Version guardrails
- Node must be >=24 and <25 (enforced in package engines).
- Dependency updates are patch-only unless an ADR approves otherwise.