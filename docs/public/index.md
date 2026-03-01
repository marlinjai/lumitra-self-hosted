---
title: Lumitra Self-Hosted
description: Docker-based self-hosting for Brain services
order: 5
icon: "🐳"
---

# Lumitra Self-Hosted

Docker-based self-hosting for Storage Brain and Data Brain APIs.

## Overview

Run both **Storage Brain** (file storage API) and **Data Brain** (structured data API) locally with a single `docker compose up` command. Ideal for local development, testing, and on-premise deployments.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 20+
- [Docker Compose](https://docs.docker.com/compose/install/) v2+

## Quick Start

```bash
git clone https://github.com/marlinjai/lumitra-self-hosted
cd lumitra-self-hosted
cp .env.example .env
docker compose up
```

## Services

| Service | Port | Purpose |
|---------|------|---------|
| Storage Brain API | 3000 | File upload, download, metadata, OCR |
| Data Brain API | 3001 | Tables, columns, rows, views, relations |
| PostgreSQL 16 | 5432 | Shared database (`storagebrain` + `databrain`) |
| MinIO | 9000 / 9001 | S3-compatible file storage |

## Creating Tenants

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

## Using the SDKs

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
| Database | Local PostgreSQL | Supabase Postgres, AWS RDS, Neon |
| File storage | Local MinIO | AWS S3, DigitalOcean Spaces, Backblaze B2 |

See `.env.example` for all available environment variables.
