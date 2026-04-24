---
id: "bug: issue-encounter-relate-to-docker"
aliases: []
tags:
  - bug
---
2026-04-24 Init 15:53
# Dockerizing a Next.js + Prisma App — First Run Notes
## symptom
### The Core Problem: Build Time vs. Runtime
`next build` does a static analysis pass where it actually executes page
components. If those pages call Prisma, Next.js tries to query the DB
during the build — but no DB exists inside `docker build`. This is the
root of everything.

Errors encountered in sequence:
- `prisma.entry.findMany is not a function` — Proxy wasn't recursive
- `Cannot read properties of null (reading 'map')` — Mock returned `null` instead of `[]`
- `EACCES: permission denied, mkdir '/app/.next/cache'` — Files owned by root, but runner uses `node` user
- `address already in use :5432` — Tried to spin up a DB container while native Postgres already held the port
- Google OAuth "site can't be reached" — Auth.js couldn't resolve redirect URL inside container

## reproduce
1. Add Prisma calls inside async page components (`page.tsx`, etc.)
2. Build a Docker image without a database available at build time
3. Run `docker build .` — `next build` will attempt to execute those
   components and fail trying to connect to a DB that doesn't exist

## suspected cause
`next build` performs a "collect page data" pass even on `force-dynamic`
pages — enough to initialize the Prisma client and attempt a connection.
Since `DATABASE_URL` either doesn't exist or points to an unreachable DB
inside the build container, Prisma throws or times out.

Secondary cause: the official Next.js standalone output copies files as
root, so the `node` user the runner switches to can't write runtime cache.

## tried
- [x] `export const dynamic = "force-dynamic"` on all DB-dependent pages
  — partially helped but did not fully prevent Prisma initialization
  during the build phase config scan

- [x] Simple non-recursive Proxy mock returning `null`
  — failed with `prisma.entry.findMany is not a function` because the
  proxy only handled one level of property access

- [x] Recursive Proxy returning `null`
  — failed with `Cannot read properties of null (reading 'map')` because
  components call `.map()` on the result and `null` has no such method

- [x] Spinning up a Postgres container in `docker-compose.yml` to serve
  as a real build-time DB — failed with port `5432` already in use
  because native Postgres was already running on the host

## fix

### 1. Build-phase Prisma Mock (`prisma.ts`)
Check `NEXT_PHASE` and return a recursive Proxy that resolves everything
to `[]`. The proxy must be recursive to satisfy nested calls like
`prisma.entry.findMany()` and `prisma.shelf.findFirst()`.

```ts
function createPrismaClient() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    const mockHandler: ProxyHandler<any> = {
      get: (target, prop) => {
        const fn = () => Promise.resolve([]); // [] not null — satisfies .map()
        return new Proxy(fn, mockHandler);    // recursive so prisma.x.y.z() all work
      },
    };
    return new Proxy({}, mockHandler) as unknown as PrismaClient;
  }
  // real client below...
}
```

### 2. Dockerfile — fix file ownership for `node` user
Pre-create the cache directory and transfer ownership before switching
to the `node` user. Use `--chown` on every `COPY` from builder so the
`node` user can read and write all app files at runtime.

```dockerfile
RUN mkdir -p .next/cache && chown -R node:node .next

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/src/generated/prisma ./src/generated/prisma
```

### 3. `docker-compose.yml` — host networking + Auth.js config
Use `network_mode: host` on Linux so the container shares the host
network stack and `localhost` inside the container resolves to the
actual machine (where native Postgres is running on `5432`).

Add `HOSTNAME=0.0.0.0` so the Next.js standalone server binds to all
interfaces, and `AUTH_TRUST_HOST=true` so Auth.js accepts OAuth
redirects from inside the container.

```yaml
services:
  web:
    build: .
    network_mode: "host"
    environment:
      - PORT=3000
      - HOSTNAME=0.0.0.0
      - AUTH_TRUST_HOST=true
    env_file:
      - .env
```

### 4. `.env` — point DB URL to localhost
With `network_mode: host`, `localhost` works as expected inside the
container. No `host.docker.internal` needed on Linux.

DATABASE_URL="postgresql://user:pass@localhost:5432/your_db"
AUTH_URL="http://localhost:3000"

### Future: moving to cloud DB
When DB is hosted on a cloud provider, only `.env` changes.
The image and Dockerfile stay exactly the same.
DATABASE_URL="postgresql://user:pass@db.supabase.co:5432/your_db"
remove network_mode: host from docker-compose.yml

## links
[[virtaul-shelf]]
[[docker]]
