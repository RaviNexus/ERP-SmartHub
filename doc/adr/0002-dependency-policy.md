# ADR 0002 – Dependency Versioning & Update Policy
- Status: Accepted
- Date: 2026-03-16

## Decision
- Pin all runtime and library versions (semver exact) in lockfiles.
- Allow automatic patch updates only; minors/majors require a new ADR or explicit approval.
- Monthly Renovate job (or equivalent) opens patch PRs; security advisories trigger hotfix PRs immediately.
- CI enforces Node >=24 and TypeScript 5.9.x until 6.0 GA is declared stable and adopted.
- Database stays on PostgreSQL 18.x; minors auto-applied after staging verification; no major upgrade before Q1 2027 unless security demands.

## Rationale
- ERP needs stability for financial correctness; uncontrolled version drift risks breaking accounting flows.
- Patch cadence keeps security fixes flowing without frequent refactors.
- Guardrails in CI reduce “works on my machine” drift and ensure deterministic builds.

## Consequences
- Slightly slower access to new features; mitigated by scheduled ADRs when value is clear.
- Requires disciplined release process (staging + canary) before applying DB minors.
- More initial work to maintain pin lists, but predictable rollbacks when incidents occur.