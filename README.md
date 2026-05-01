# Virtual Library

A personal content tracker for readers and fanfic enthusiasts. Track novels, fanfiction, bookmarks, and more — with status tracking, ratings, tags, and notes — all in one place.

Built as a full-stack portfolio project to demonstrate real-world Next.js development with a focus on clean architecture, type safety, and modern tooling.

> **Live Demo**: [https://195.201.149.64.sslip.io/](https://195.201.149.64.sslip.io/)  
> **Status**: **Live & Operational** — Hosted on Hetzner VPS with Supabase DB.

---

## About

I built Virtual Library to solve a problem I actually have: keeping track of the fiction and documents I read across dozens of different sites. Most reading trackers are either too generic or tied to a specific platform. This one is mine.

The project is also a deliberate learning exercise — I made every architectural decision myself, from the database schema design to the choice of Server Actions over a REST API layer, with the goal of understanding *why* each piece exists, not just how to use it.

---

## Tech Stack & Infrastructure

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router / Standalone) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (**Supabase Free Tier**) |
| **Hosting** | **Hetzner Cloud (VPS)** |
| **Deployment** | **Docker + Docker Compose** |
| **Web Server** | **Caddy (Automatic HTTPS/SSL)** |
| **Image Hosting** | Cloudinary |
| **E2E Testing** | Playwright |
| **ORM** | Prisma 7 (with driver adapters) |
| **Auth** | Auth.js v5 (JWT strategy) |
| **Styling** | Tailwind CSS / shadcn/ui |

---

## Technical Decisions Worth Noting

**Automated Production SSL** — Implemented **Caddy** as a reverse proxy to handle automatic SSL/TLS certificate issuance and renewal via Let's Encrypt. This ensures the application is always served over HTTPS without manual intervention.

**Production-Grade Containerization** — Optimized the Docker build using multi-stage builds and the Next.js `standalone` output, resulting in a significantly smaller and more secure production image. Configured `restart: always` policies to ensure high availability on the VPS.

**Stable E2E Authentication Bypass** — Solved the fragility of automated login by implementing a "Trapdoor" API route (`/api/test/login`). This route generates a signed JWT session cookie directly using the `AUTH_SECRET`, allowing the Playwright robot to bypass complex UI login flows (CSRF/Bot protection) and focus on testing core business logic and CRUD operations in a stable, deterministic environment.

**Recursive Prisma Mocking for Builds** — Solved the "Prisma Build-Time Connection" chicken-and-egg problem by implementing a recursive Javascript Proxy in `src/lib/prisma.ts`. This mocks the Prisma client during the Next.js static analysis phase, allowing the Docker image to build successfully without requiring a live database connection.

**Dockerized for Consistency** — Built a multi-stage Dockerfile that uses the Next.js `standalone` output for minimum image size. Handled complex Linux-specific container issues including `chown` permission management for `.next/cache` and `network_mode: host` for local database connectivity.

**Server Actions over REST API** — Moved all data mutations to Server Actions. This removes a whole layer of boilerplate and keeps data-fetching logic colocated with the UI that needs it.

**JWT over database sessions** — Chose stateless JWT sessions with Auth.js to avoid the overhead of a session table lookup on every authenticated request, while still supporting both credentials and OAuth providers.

**Cloudinary Integration** — Integrated Cloudinary for high-performance image storage and optimization, keeping the database lean by storing only the metadata and remote URLs.

---

## Engineering Journal: Deep Dives & Post-Mortems

I believe that every hard bug is a learning opportunity. Throughout development, I maintained a [**`/bug-report`**](./bug-report) directory to document non-trivial issues, their root causes, and the systematic process I used to solve them.

**Selected Technical Post-Mortems:**
- **[The Docker Build-Time Deadlock](./bug-report/issue-encounter-relate-to-docker.md)**: Solving the "Chicken and Egg" problem of building a Prisma app without a live DB connection using recursive Javascript Proxies.
- **[Layout Shifts vs. Radix UI](./bug-report/bug-report-page-content-shift.md)**: Debugging asymmetric horizontal shifting caused by Radix's scroll-lock behavior in fixed-margin layouts.
- **[Stale State & Revalidation Scope](./bug-report/bug-report-stale-state.md)**: Analyzing why `revalidatePath("/")` was too narrow and how modal mounting patterns affect `useActionState`.
- **[OAuth Identity Conflict](./bug-report/oauth-account-not-linked.md)**: Navigating the security tradeoffs of `allowDangerousEmailAccountLinking` in Auth.js.

This documentation serves as my personal technical knowledge base and ensures I never solve the same hard problem twice.

---

## Getting Started

### Prerequisites

- Docker and Docker Compose
- A local PostgreSQL instance (on your host machine)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/virtual-library.git
   cd virtual-library
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory. You will need your own PostgreSQL database and Google/GitHub OAuth credentials.

   ```bash
   # Database (Replace with your local DB credentials)
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"

   # Auth.js (Generate a secret with `npx auth secret`)
   AUTH_SECRET="your_generated_secret"
   AUTH_URL="http://localhost:3000"
   AUTH_TRUST_HOST=true

   # Google OAuth
   AUTH_GOOGLE_ID="your_google_client_id"
   AUTH_GOOGLE_SECRET="your_google_client_secret"

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

3. **Build and Run with Docker**
   ```bash
   # Build the image and start the container
   docker-compose up --build
   ```

4. **Initialize the Database**
   Once the container is running, push your schema to your local database:
   ```bash
   npx prisma db push
   ```

Open [http://localhost:3000](http://localhost:3000).

### Running Tests

The project uses Playwright for End-to-End testing.

```bash
# Run all tests
npx playwright test

# Run tests in headed mode (see the robot in action)
npx playwright test --headed

# Show test report
npx playwright show-report
```

---

## Roadmap
- [x] Auth — credentials and OAuth (GitHub / Google)
- [x] Full Dockerization & Build Optimization
- [x] Per-user library isolation
- [ ] Chrome extension for quick entry addition
- [ ] Rust-based CLI tool for terminal management and syncing

---

## Author

Built by **[EriEriel]**
- GitHub: [EriEriel](https://github.com/EriEriel)

---

*Self-taught developer • University CS student • Based in Thailand*
