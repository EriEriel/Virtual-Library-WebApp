

A personal content tracker for readers and fanfic enthusiasts. Track novels, fanfiction, bookmarks, and more — with status tracking, ratings, tags, and notes — all in one place.

Built as a full-stack portfolio project to demonstrate real-world Next.js development with a focus on clean architecture, type safety, and modern tooling.

> **Status**: Core features working — auth and full CRUD in active development.

---

## About

I built Virtual Library to solve a problem I actually have: keeping track of the novels and fanfiction I read across dozens of different sites. Most reading trackers are either too generic or tied to a specific platform. This one is mine.

The project is also a deliberate learning exercise — I made every architectural decision myself, from the database schema design to the choice of Server Actions over a REST API layer, with the goal of understanding *why* each piece exists, not just how to use it.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 7 (with driver adapters) |
| Auth | Auth.js v5 (JWT strategy) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Deployment | Vercel |

---

## Features

**Currently working**
- Search by title, author, tags 
- Add, edit, and delete entries (novels, fanfic, bookmarks)
- Tag system for flexible organisation
- Cover image support via URL
- Notes per entry
- Responsive layout

**In progress**
- Authentication (email/password + OAuth)
- Per-user data isolation
- Filtering by category, status etc.

---

## Technical Decisions Worth Noting

**Server Actions over REST API** — Deleted the `api/` directory entirely and moved all data mutations to Server Actions. This removes a whole layer of boilerplate and keeps data-fetching logic colocated with the UI that needs it.

**Prisma 7 driver adapters** — Used the newer driver adapter pattern rather than the traditional Prisma Client setup, which required working through some non-obvious configuration for local PostgreSQL development.

**JWT over database sessions** — Chose stateless JWT sessions with Auth.js to avoid the overhead of a session table lookup on every authenticated request, while still supporting both credentials and OAuth providers.

**Schema-first design** — Designed the full Prisma schema (User, Account, Entry, Tag with enums) before writing any application code, treating the data model as the foundation everything else builds on.

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (local or hosted)

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/virtual-library.git
cd virtual-library

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL and AUTH_SECRET in .env

# Run database migrations
npx prisma migrate dev

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Roadmap

- [ ] Auth — credentials (email + password) and OAuth (GitHub / Google)
- [ ] Per-user library isolation
- [ ] Advanced filtering
- [ ] Reading progress tracking
- [ ] Public shareable lists
- [ ] Import from external sources (AO3, NovelUpdates)
- [ ] More quality of life feature
- [ ] More polish UI

---

## Contributing

This is a personal project and portfolio piece, so I'm not accepting feature PRs — but bug reports and feedback are very welcome. Open an issue if you spot something broken.

---

## Author

Built by **[EriEriel]**
- GitHub: [EriEriel](https://github.com/EriEriel)

---

*Self-taught developer • University CS student • Based in Thailand*
