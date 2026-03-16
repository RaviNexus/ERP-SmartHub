POST /health
- Description: Connectivity check
- Response: { status: "ok"|"degraded", app: string, services: { postgres: "up"|"down", redis: "up"|"down", kafka: "up"|"down" } }

GET /
- Description: Root hello for smoke tests