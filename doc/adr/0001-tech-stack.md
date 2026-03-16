# ADR 0001 – Platform & Framework Baseline
- Status: Accepted
- Date: 2026-03-16

## Decision
Adopt the following stack as the frozen baseline for ERP development (responsive web only):
- Runtime: Node.js 24 LTS (24.14.x)
- Backend: NestJS 11.1.x with TypeScript, REST-first (GraphQL only for aggregation-heavy dashboards)
- Frontend: React 19.2.x with Vite 7.3.x, TypeScript, responsive web (no React Native)
- Language toolchain: TypeScript 5.9.x initially; move to 6.0 GA once it ships stable
- Database: PostgreSQL 18.3
- Cache/locks: Redis 8.2.x
- Messaging: Apache Kafka 4.2.x with outbox pattern from Postgres
- Search: OpenSearch/Elasticsearch (managed), minimal PII indexing
- Object storage: S3-compatible for media/docs
- Observability: OpenTelemetry + Prometheus/Grafana; structured logs (pino) to ELK/CloudWatch
- Security: TLS everywhere, Helmet/CSP, Redis-backed rate limiting, Postgres RLS for tenant isolation, secrets in Vault/SSM, image scanning in CI

## Rationale
- Long support windows (Node 24 LTS, Postgres 18) reduce forced upgrades in the next 24–36 months.
- NestJS provides opinionated modules, DI, validation, and Swagger generation, improving delivery speed and consistency.
- React 19 + Vite 7 offer mature SSR/SPA ergonomics and fast DX; responsive layouts satisfy mobile without a separate stack.
- Event-driven core (Kafka + outbox) decouples transactional flows (SO?Delivery?Invoice, GRN?Bill) from reporting and notifications.
- Postgres 18 brings mature partitioning and JSONB; strong ACID needed for inventory/ledger integrity.

## Consequences
- Pin exact versions in package manifests/locks; allow only patch updates unless an ADR approves minor/major moves.
- Require Node =24 in CI; fail builds on older runtimes.
- Keep Postgres at 18.x until 19 stabilizes; enable minor auto-updates.
- Enforce idempotency keys and optimistic locking in service code; treat Kafka as async side-channel, not source of truth.
- Responsive UI is mandatory; no budget allotted for native mobile until revisited by ADR.