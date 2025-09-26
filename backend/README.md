## RBAC Backend Starter (Express + TypeScript + Prisma)

Production-ready Node.js backend starter focused on reliability, security, and observability. Built with Express 5, TypeScript, Prisma (PostgreSQL), robust logging, graceful shutdown, and health endpoints.

### Key Features
- **TypeScript + Express 5**: Strict typing, modern Node targets
- **Prisma**: PostgreSQL ORM with generated client
- **Security**: Helmet, CORS, HPP, rate limiting, disabled `x-powered-by`
- **Observability**: Request IDs, HTTP access logs (Morgan → Winston), rotating log files
- **Error handling**: Centralized error classes and global handler with structured JSON
- **Health endpoints**: `/health/live` and `/health/ready` (DB readiness)
- **Graceful shutdown**: Cleanly closes HTTP server and DB on SIGINT/SIGTERM

---

### Tech Stack
- Runtime: Node.js (v18–22)
- Language: TypeScript (ES2022 target)
- HTTP: Express 5
- ORM: Prisma (`@prisma/client`)
- Database: PostgreSQL
- Logging: Winston + Daily Rotate File, Morgan
- Security: Helmet, CORS, HPP, express-rate-limit

---

### Project Structure
```
backend/
  ├─ src/
  │  ├─ app.ts                      # Express app with middleware, routes, logging
  │  ├─ server.ts                   # Bootstrap, graceful shutdown, startup steps
  │  ├─ config/
  │  │  ├─ app.config.ts           # Environment-driven app config
  │  │  └─ http.config.ts          # HTTP status codes and messages
  │  ├─ middlewares/
  │  │  ├─ asyncHandler.ts         # Async controller wrapper
  │  │  ├─ globalErrorHandler.ts   # Central error handler
  │  │  └─ requestIdMiddleware.ts  # Attaches X-Request-ID header + req.requestId
  │  ├─ routes/
  │  │  ├─ health.route.ts         # /health/live, /health/ready
  │  │  └─ test.route.ts           # Example success/error routes (commented in app)
  │  ├─ utils/
  │  │  ├─ appError.ts             # Error classes (AppError, BadRequest, etc.)
  │  │  ├─ get-env.ts              # Strict env loader (throws if missing)
  │  │  ├─ logger.ts               # Winston logger + HTTP stream
  │  │  ├─ prisma.ts               # PrismaClient instance
  │  │  └─ response.ts             # Unified API response helper
  │  └─ enums/
  │     └─ error-code.enum.ts      # App-level error codes
  ├─ prisma/
  │  └─ schema.prisma              # Prisma schema (PostgreSQL datasource)
  ├─ logs/                         # Rotated app/error/exception logs
  ├─ package.json
  ├─ tsconfig.json
  └─ README.md
```

---

### API Endpoints
- `GET /health/live`: Liveness probe (no DB required)
- `GET /health/ready`: Readiness probe (verifies DB connectivity)

Example checks:
```bash
curl http://localhost:8000/health/live
curl http://localhost:8000/health/ready
```

---

### Environment Variables
The app uses a strict env loader; required variables must be present or startup will fail.

Create a `.env` file in the project root with:
```bash
NODE_ENV=development
PORT=8000
LOG_LEVEL=info


# Database
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:POST/DB?schema=public
```

Notes:
- `NODE_ENV` affects trust proxy and console logging
- `LOG_LEVEL` controls Winston level (default `info`)
- `DATABASE_URL` must point to a running PostgreSQL instance

---

### Local Setup

#### Prerequisites
- Node.js v18–22 and npm
- Docker (for local PostgreSQL)

#### 1) Install dependencies
```bash
npm install
```

#### 2) Start PostgreSQL via Docker
Persistent container with a named volume:
```bash
docker volume create rbac_pgdata
docker run -d \
  --name rbac-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=rbac \
  -p 5432:5432 \
  -v rbac_pgdata:/var/lib/postgresql/data \
  postgres:16
```

Verify container health:
```bash
docker ps --filter name=rbac-postgres
```

#### 3) Configure environment
Create `.env` as shown above. Ensure `DATABASE_URL` uses your DB settings.

#### 4) Initialize Prisma
Generate the client and sync schema to DB (no models yet):
```bash
npx prisma generate
npx prisma db push
```

#### 5) Run the app
- Development (auto-reload):
```bash
npm run dev
```

- Production build and run:
```bash
npm run start:prod
```

#### 6) Smoke test
```bash
curl http://localhost:8000/health/live
curl http://localhost:8000/health/ready
```

---

### Docker Compose (one-command local setup)

This repository includes `docker-compose.yml` to run PostgreSQL and the app together.

#### Quick start
1) Ensure you have a `.env` file (see Environment Variables). You can leave `DATABASE_URL` as-is; Compose will override it inside the `app` container to use the `postgres` service.

2) Start services:
```bash
docker compose up
# or: docker-compose up
```

This will:
- Start Postgres (service `postgres`)
- Start the app (service `app`) after Postgres is healthy
- Run `npm install`, `prisma generate`, `prisma db push`, then `npm run dev`

App will be available at: http://localhost:8000

#### Stop/cleanup
```bash
# stop containers
docker compose down

# remove containers + volumes (DB data!)
docker compose down -v
```

#### Volumes and customization
- Database data is persisted in a named volume `rbac_pgdata` (defined under `volumes:`).
- To use a different volume name, edit `docker-compose.yml`:
  - Change both the `volumes:` section at the bottom and the mount `- rbac_pgdata:/var/lib/postgresql/data` under the `postgres` service.
- To mount a host directory instead (bind mount): replace the DB volume line with a host path, e.g.:
  - `- ./\.data/postgres:/var/lib/postgresql/data`
  Create the folder if it doesn't exist.
- Source code is mounted into the `app` container with `- ./:/usr/src/app` to enable hot-reload via `ts-node-dev`.
- `node_modules` is kept inside the container (`- /usr/src/app/node_modules`) to avoid host/container conflicts.

#### Ports
- Postgres: `5432:5432`
- App: `8000:8000`
Adjust by editing the `ports:` mappings in `docker-compose.yml`.

#### Logs and exec
```bash
# tail app logs
docker compose logs -f app

# shell into app container
docker compose exec app sh

# psql into Postgres
docker compose exec postgres psql -U postgres -d rbac
```

---

### Logging & Observability
- HTTP access logs via Morgan are sent to Winston, enriched with `requestId`, method, URL, status, response time, and IP
- Rotating files under `logs/`:
  - `application-YYYY-MM-DD.log` (info and above)
  - `error-YYYY-MM-DD.log` (errors)
  - `exceptions-YYYY-MM-DD.log` (uncaught exceptions)
- Console logs are colorized when `NODE_ENV !== 'production'`

Example log line (colorized in dev):
```
[INFO] [2025-08-20 10:00:00] : GET /health/live 200 4.1 ms reqId=... IP=::1
```

---

### Error Handling & Responses
- Throw typed errors (`AppError`, `BadRequestException`, etc.)
- All unhandled errors are captured by the global handler with structured output
- Success responses should use `sendResponse` for consistency

Example success response shape:
```json
{
  "success": true,
  "message": "Liveness probe successful",
  "statusCode": 200,
  "statusText": "OK",
  "timestamp": "2025-08-20T10:00:00.000Z",
  "requestId": "...",
  "data": { "status": "UP", "uptime": 123.45 }
}
```

Example error response shape:
```json
{
  "success": false,
  "message": "Resource not found",
  "errorCode": "RESOURCE_NOT_FOUND",
  "timestamp": "2025-08-20T10:00:00.000Z"
}
```

---

### Security Defaults
- `helmet()` sets sensible HTTP headers
- `cors({ origin: FRONTEND_ORIGIN, credentials: true })`
- `hpp()` prevents parameter pollution
- `express-rate-limit` default window 60s, max 100 requests
- `x-powered-by` header disabled

Tune `FRONTEND_ORIGIN` and rate limits per environment.

---

### Graceful Shutdown
`server.ts` listens for `SIGINT`/`SIGTERM` and uncaught errors, then:
1. Closes Prisma connection
2. Stops HTTP server
3. Runs final cleanup
4. Forces exit if shutdown hangs (10s watchdog)

---

### Scripts
```bash
npm run dev        # ts-node-dev with live reload
npm run build      # compile TypeScript to dist/
npm run start      # run compiled server (dist/server.js)
npm run start:prod # build + start with NODE_ENV=production
```

Node engine: `>=18 <23` (see `package.json`)

---

### Troubleshooting
- Readiness is 503: Ensure Postgres is running and `DATABASE_URL` is correct
- Startup fails: Missing required env vars (see `.env` section)
- Port in use: Change `PORT` in `.env` or stop conflicting process
- Prisma errors: Re-run `npx prisma generate` after dependency or schema changes
- Logs not visible: Check `logs/` files and ensure permissions; in dev, also check console

---

### License
ISC (see `package.json`)


