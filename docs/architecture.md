# Architecture

## Repository Strategy

Smart Ledger uses a monorepo containing independently deployable frontend
and backend applications.

```text
smart-ledger/
├── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # NestJS backend
├── packages/
│   ├── shared/
│   ├── eslint-config/
│   └── typescript-config/
├── docs/
└── .github/
```

## Frontend

The frontend is a Next.js and TypeScript application.

It is responsible for:

- Rendering the user interface
- Client-side form validation
- Managing server state
- Displaying loading, empty, and error states
- Presenting financial summaries and charts

Business-critical calculations will not be performed exclusively in the
browser.

## Backend

The backend is a standalone NestJS application.

It is responsible for:

- Authentication and authorization
- Request validation
- Transaction ownership enforcement
- Financial calculations
- Dashboard aggregation
- Anomaly and duplicate detection
- Redis cache management
- PostgreSQL persistence

## Data Layer

PostgreSQL is the system of record.

Financial amounts are stored in integer minor units to avoid floating-point
precision errors.

Prisma provides typed database access and migrations.

## Caching

Redis caches derived dashboard data only.

The application must continue operating when Redis is temporarily
unavailable. Cache failures should reduce performance rather than break
core financial workflows.

## Deployment

The applications can be deployed independently:

- `apps/web`: Vercel
- `apps/api`: Render or Railway
- PostgreSQL: managed PostgreSQL provider
- Redis: managed Redis provider

## Design Principles

- Feature-focused modules
- Explicit validation at system boundaries
- Thin controllers
- Testable business logic
- Secure-by-default resource ownership
- No premature abstraction
- No unnecessary microservices
- Graceful degradation for optional infrastructure
