# Lumitra Self-Host

Run both **Storage Brain** (file storage API) and **Data Brain** (structured data API) locally with a single command.

## Quick Start

```bash
git clone https://github.com/marlinjai/lumitra-self-hosted
cd lumitra-self-hosted
cp .env.example .env
docker compose up
```

This starts 4 services:

| Service | Port | Purpose |
|---------|------|---------|
| Storage Brain API | 3000 | File upload, download, metadata, OCR |
| Data Brain API | 3001 | Tables, columns, rows, views, relations |
| PostgreSQL 16 | 5432 | Shared database (two DBs: `storagebrain`, `databrain`) |
| MinIO | 9000 / 9001 | S3-compatible file storage |

## Create Tenants

```bash
# Storage Brain
curl -X POST http://localhost:3000/api/v1/admin/tenants \
  -H "Authorization: Bearer admin-dev-key" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-app"}'

# Data Brain
curl -X POST http://localhost:3001/api/v1/admin/tenants \
  -H "Authorization: Bearer admin-dev-key" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-app"}'
```

Both return an `apiKey` — use it with the respective SDK.

## Use the SDKs

```bash
pnpm add @marlinjai/storage-brain-sdk @marlinjai/data-brain-sdk
```

```typescript
import { StorageBrain } from '@marlinjai/storage-brain-sdk';
import { DataBrain } from '@marlinjai/data-brain-sdk';

const storage = new StorageBrain({
  apiKey: 'sk_live_...',
  baseUrl: 'http://localhost:3000',
});

const data = new DataBrain({
  apiKey: 'sk_live_...',
  baseUrl: 'http://localhost:3001',
});
```

## Bring Your Own Infrastructure

Docker Compose is the default for local development. For production, point the env vars at managed providers:

| Concern | Docker default | Managed alternatives |
|---------|---------------|---------------------|
| Database | Local PostgreSQL | Supabase Postgres, AWS RDS, Neon, Railway |
| File storage | Local MinIO | AWS S3, DigitalOcean Spaces, Backblaze B2 |

```bash
# Example: Run just the APIs against managed infra (no Docker needed)
DATABASE_URL=postgres://...supabase.co:5432/storagebrain \
S3_ENDPOINT=https://...s3.amazonaws.com \
S3_BUCKET=my-bucket \
AWS_ACCESS_KEY_ID=AKIA... \
AWS_SECRET_ACCESS_KEY=... \
ADMIN_API_KEY=my-secret \
URL_SIGNING_SECRET=my-signing-secret \
  node storage-brain/dist/node.js

DATABASE_URL=postgres://...supabase.co:5432/databrain \
ADMIN_API_KEY=my-secret \
  node data-brain/dist/node.js
```

## Configuration Reference

See `.env.example` for all available environment variables.

## Architecture

```
┌─────────────┐     ┌──────────────┐
│  Your App   │     │  Your App    │
│  (SDK)      │     │  (SDK)       │
└──────┬──────┘     └──────┬───────┘
       │ HTTP              │ HTTP
       ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ Storage Brain│    │  Data Brain  │
│  API :3000   │    │  API :3001   │
└──────┬───┬───┘    └──────┬───────┘
       │   │               │
       │   ▼               ▼
       │ ┌──────┐    ┌──────────┐
       │ │MinIO │    │PostgreSQL│
       │ │:9000 │    │  :5432   │
       │ └──────┘    └──────────┘
       │                   ▲
       └───────────────────┘
```

## License

MIT
