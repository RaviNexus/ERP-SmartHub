# Setup Guide (SmartHub ERP)

## Prerequisites
- Git
- Node.js 24 LTS (>=24.14.x)
- pnpm 9 (global): `npm install -g pnpm@9`
- Optional: Docker Desktop (if you prefer containerized infra or full stack)

## Clone
```bash
git clone <repo-url> smarthub-erp
cd smarthub-erp
```

## Option 1: Host-only (no Docker)
1) Install services locally (use package manager of your OS):
   - Postgres 18 (create DB `erp`, user `erp`/`erp`).
   - Redis 8 (default port 6379).
   - Kafka 4 (single-node KRaft; broker at localhost:9092).
2) Copy envs and keep defaults (they point to localhost):
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
3) Install deps and run apps:
```bash
pnpm install
pnpm --filter erp-backend start:dev   # http://localhost:3000
pnpm --filter erp-frontend dev        # http://localhost:5173
```

## Option 2: Hybrid (Docker infra, host apps)
```bash
docker compose up -d                 # starts Postgres/Redis/Kafka only
pnpm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
pnpm --filter erp-backend start:dev   # http://localhost:3000
pnpm --filter erp-frontend dev        # http://localhost:5173
```

## Option 3: Full Docker (infra + apps)
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env  # ensure VITE_API_BASE_URL points to http://localhost:3000
docker compose -f docker-compose.app.yml up --build
```
- Backend: http://localhost:3000
- Frontend (nginx): http://localhost:4173

## Maintenance
- Stop infra only: `docker compose down`
- Stop full stack: `docker compose -f docker-compose.app.yml down`
- Clean volumes (data loss): add `-v` to above commands
- Lint all: `pnpm lint`
- Test all: `pnpm test`

## Version guardrails
- Node must be >=24 and <25 (enforced in package engines).
- Dependency updates are patch-only unless an ADR approves otherwise.