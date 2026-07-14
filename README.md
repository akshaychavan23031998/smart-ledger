# Smart Ledger

Smart Ledger is a production-oriented full-stack financial ledger that
allows users to securely manage income and expense transactions, monitor
cash flow, and receive explainable spending insights.

This project is being developed as part of the ByteX Financial Ltd.
Junior Full Stack Engineer challenge.

## Planned Features

- Secure user authentication
- Income and expense transaction management
- Transaction categories
- Search, filtering, sorting, and pagination
- Financial summary dashboard
- Income-versus-expense visualization
- Expense category breakdown
- Explainable spending anomaly detection
- Duplicate transaction warnings
- Monthly spending projection
- Redis-backed dashboard caching
- Responsive and accessible user interface
- Automated testing and CI/CD

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod
- Recharts

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT authentication
- Swagger

### Development and DevOps

- pnpm workspaces
- Turborepo
- Docker and Docker Compose
- GitHub Actions
- Jest
- Supertest
- Playwright

## Repository Structure

## 4. Fix `README.md`

In the repository structure section, make sure it contains both applications:

````md
```text
smart-ledger/
├── apps/
│   ├── web/
│   └── api/
├── packages/
├── docs/
├── docker-compose.yml
├── pnpm-workspace.yaml
└── turbo.json
```
````
