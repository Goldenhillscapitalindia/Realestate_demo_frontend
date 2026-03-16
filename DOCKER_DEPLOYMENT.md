# Realestate_demo_frontend - Docker Deployment Guide

## Overview

This is the **Demo Frontend** — a React + Vite + TypeScript application with AI-powered real estate analysis, portfolio intelligence, market radar, and document upload features. It is the public-facing demo version of the platform.

When deployed via Docker, this service runs on **port 3001**.

---

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2+

---

## Project Architecture

```
Realestate_demo_frontend/
├── Dockerfile          # Multi-stage build (Node → Nginx)
├── nginx.conf          # Production Nginx configuration
├── .dockerignore       # Files excluded from Docker build
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite build config (dev port: 4000)
└── src/                # Application source code
```

---

## Environment Variables

| Variable       | Description                          | Example                    |
|----------------|--------------------------------------|----------------------------|
| `VITE_API_URL` | Backend API base URL (build-time)    | `http://localhost:8000`    |

**Important:** `VITE_API_URL` is a build-time variable. It gets baked into the JavaScript bundle during `npm run build`. You cannot change it at runtime — you must rebuild the image if the API URL changes.

---

## Standalone Docker Build & Run

### 1. Build the image

```bash
docker build \
  --build-arg VITE_API_URL=http://your-backend-host:8000 \
  -t realestate-demo-frontend .
```

### 2. Run the container

```bash
docker run -d \
  --name demo-frontend \
  -p 3001:80 \
  realestate-demo-frontend
```

### 3. Access the application

Open `http://localhost:3001` in your browser.

---

## Using Docker Compose (Recommended)

This service is part of the full-stack `docker-compose.yml` in the parent directory. See the root-level deployment instructions.

```bash
cd ..
docker compose up -d frontend-demo
```

---

## How the Dockerfile Works

### Stage 1 — Build (Node 20 Alpine)
1. Installs npm dependencies with `npm ci`
2. Copies source code
3. Injects `VITE_API_URL` as a build argument
4. Runs `npm run build` to produce optimized static files in `/app/dist`

### Stage 2 — Production (Nginx 1.27 Alpine)
1. Replaces default Nginx config with custom `nginx.conf`
2. Copies built static files from Stage 1
3. Serves the SPA with proper routing fallback (`try_files → /index.html`)
4. Enables gzip compression and security headers
5. Caches static assets (JS, CSS, images) for 1 year with immutable flag

---

## Nginx Configuration Details

- **Gzip compression** enabled for text, JS, CSS, JSON, SVG
- **Security headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy
- **Static asset caching**: 1 year with `immutable` for hashed Vite output
- **SPA routing**: All non-file routes fall back to `index.html`
- **Health check**: `GET /health` returns `200 OK`

---

## Health Check

The container includes a health check at `/health`:

```bash
curl http://localhost:3001/health
# Response: ok
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API calls failing | Ensure `VITE_API_URL` was set correctly at build time. Rebuild if needed. |
| Blank page | Check browser console. Likely a routing issue or missing env variable. |
| 404 on page refresh | Verify `nginx.conf` has the `try_files $uri $uri/ /index.html` rule. |
| Container unhealthy | Run `docker logs demo-frontend` to check Nginx errors. |
