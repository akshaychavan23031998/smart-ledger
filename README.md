# Smart Ledger

A production-focused full-stack financial ledger built for the **ByteX Financial Ltd. Junior Full Stack Engineer Challenge**.

Smart Ledger allows users to securely register, sign in, manage income and expense transactions, categorize financial activity, search and filter ledger entries, view financial summaries, and receive automatically generated financial insights.

The project was designed to demonstrate more than basic CRUD. It focuses on correctness, financial data handling, authentication, user-level data isolation, backend aggregation, structured architecture, testing, documentation, and responsible use of AI-assisted development.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Challenge Requirements](#challenge-requirements)
- [Key Features](#key-features)
- [Unique Feature](#unique-feature)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Application Flow](#application-flow)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Transaction Flow](#transaction-flow)
- [Summary and Insight Flow](#summary-and-insight-flow)
- [Important Engineering Decisions](#important-engineering-decisions)
- [Validation and Error Handling](#validation-and-error-handling)
- [Security Considerations](#security-considerations)
- [Edge Cases Handled](#edge-cases-handled)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Database and Docker Setup](#database-and-docker-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Manual Verification Flow](#manual-verification-flow)
- [AI-Assisted Development](#ai-assisted-development)
- [Where AI Fell Short](#where-ai-fell-short)
- [How Human Engineering Judgment Improved the Project](#how-human-engineering-judgment-improved-the-project)
- [Current Limitations](#current-limitations)
- [Future Improvements](#future-improvements)
- [Repository Structure](#repository-structure)
- [Git Workflow](#git-workflow)
- [Author](#author)

---

# Project Overview

Smart Ledger is a lightweight full-stack financial ledger that helps users record and manage personal financial transactions.

Users can:

- register and log in
- add income transactions
- add expense transactions
- categorize transactions
- edit and delete transactions
- search and filter ledger entries
- sort transactions
- paginate through records
- view total income
- view total expenses
- view current balance
- view transaction count
- receive smart financial insights

The frontend is built with Next.js and React, while the backend is built with NestJS and PostgreSQL through Prisma ORM.

The project follows a monorepo structure using pnpm workspaces and Turborepo.

---

# Challenge Requirements

The ByteX challenge asked for a Smart Mini-Ledger where users can:

- add transactions
- view transactions
- categorize income and expenses
- see a basic financial summary
- experience a clean and polished UI
- receive proper error handling
- see structured and maintainable code
- review a unique feature beyond standard CRUD
- understand how AI tools were used
- understand where AI-generated output was corrected manually

This implementation covers those requirements through:

- secure authentication
- user-specific ledger isolation
- transaction CRUD
- search, filtering, sorting, and pagination
- financial summary cards
- a smart financial insight engine
- responsive frontend design
- backend validation
- structured error responses
- Swagger API documentation
- unit and end-to-end testing
- PostgreSQL persistence
- Docker-based local infrastructure
- detailed AI-development documentation

---

# Key Features

## Authentication

- User registration
- User login
- JWT-based authentication
- Protected backend routes
- Current-user endpoint
- Automatic logout on unauthorized API responses
- User-specific transaction access
- Password hashing before database storage

## Transaction Management

Users can create transactions with:

- transaction type
- category
- amount
- title
- description
- transaction date

Supported transaction types:

- Income
- Expense

Users can also:

- edit transactions
- delete transactions
- view transaction details
- search by title
- search by description
- filter by transaction type
- filter by category
- filter by date range
- sort by transaction date
- sort by amount
- sort by title
- sort by creation date
- choose ascending or descending order
- paginate through transaction history

## Financial Summary

The dashboard shows:

- Current balance
- Total income
- Total expenses
- Total transaction count

The summary is calculated by the backend across the authenticated user's complete ledger.

It is not calculated only from the currently visible page.

## Smart Financial Insight

The backend generates human-readable insights such as:

- percentage of recorded income that has been spent
- largest expense category
- current-month expense comparison
- previous-month expense comparison
- guidance when the user has no transactions
- guidance when expenses exist without income
- guidance when income exists without expenses

## Production Polish

- Responsive dashboard
- Reusable components
- Loading states
- Empty states
- Success notifications
- Form validation
- API error messages
- Server-unavailable handling
- Safe pagination behavior
- Confirmation before deletion
- Protected routes
- Swagger documentation
- Organized code structure

---

# Unique Feature

## Rule-Based Financial Insight Engine

The unique feature in Smart Ledger is a backend-driven financial insight engine.

A basic ledger normally displays only transaction data and totals.

Smart Ledger goes further by analyzing financial activity and generating readable observations.

For example:

```text
You have spent 12% of your recorded income.
Your largest expense category is Food.
```

When previous-month data exists, the insight may also include:

```text
This month's expenses are 18.5% higher than last month.
```

The insight engine considers:

- total income
- total expenses
- current balance
- current-month expenses
- previous-month expenses
- top expense category
- whether the user has income
- whether the user has expenses
- whether the ledger is empty

This logic runs on the backend so that the same result can be reused by different clients.

It also prevents incorrect calculations caused by frontend pagination.

---

# Screenshots

Create the following folder:

```text
docs/screenshots
```

Recommended screenshot files:

```text
docs/screenshots/dashboard.png
docs/screenshots/login.png
docs/screenshots/register.png
docs/screenshots/swagger.png
docs/screenshots/docker.png
```

## Dashboard

![Smart Ledger Dashboard](docs/screenshots/dashboard.png)

## Swagger API Documentation

![Swagger API Documentation](docs/screenshots/swagger.png)

## Docker Services

![Docker Services](docs/screenshots/docker.png)

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Native Fetch API
- App Router

## Backend

- NestJS
- Node.js
- TypeScript
- Passport
- JWT authentication
- Class Validator
- Swagger/OpenAPI
- Jest
- Supertest

## Database

- PostgreSQL
- Prisma ORM

## Infrastructure and Tooling

- Docker Compose
- Redis container
- pnpm workspaces
- Turborepo
- Git
- GitHub

## AI Tools

- ChatGPT
- Claude

---

# Project Architecture

Smart Ledger follows a monorepo architecture.

```text
smart-ledger/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   ├── src/
│   │   │   ├── common/
│   │   │   ├── config/
│   │   │   ├── database/
│   │   │   ├── generated/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   └── transactions/
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   └── package.json
│   │
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── login/
│       │   │   ├── register/
│       │   │   └── transactions/
│       │   ├── components/
│       │   │   ├── auth/
│       │   │   ├── transactions/
│       │   │   └── ui/
│       │   ├── lib/
│       │   └── types/
│       └── package.json
│
├── docs/
│   └── screenshots/
├── docker-compose.yml
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

# Application Flow

```text
User
  |
  v
Next.js Frontend
  |
  | HTTPS / JSON
  v
NestJS REST API
  |
  | Authentication
  | Validation
  | Authorization
  | Business Logic
  | Aggregation
  v
Prisma ORM
  |
  v
PostgreSQL
```

The frontend does not directly access the database.

All financial operations pass through the backend.

The backend is responsible for:

- validating input
- authenticating users
- enforcing transaction ownership
- performing database operations
- calculating summaries
- generating smart insights
- formatting errors
- returning safe API responses

---

# Frontend Architecture

The frontend uses Next.js with the App Router.

Main routes:

```text
/
├── /login
├── /register
└── /transactions
```

## Main Frontend Responsibilities

- authentication forms
- storing the access token
- redirecting unauthorized users
- fetching the current user
- displaying transactions
- submitting transaction forms
- rendering filters
- rendering pagination
- displaying financial summaries
- rendering smart insights
- showing success and error messages

## Frontend Component Structure

```text
components/
├── auth/
│   └── auth-form.tsx
│
├── transactions/
│   ├── transaction-card.tsx
│   ├── transaction-filters.tsx
│   ├── transaction-form.tsx
│   ├── transaction-list.tsx
│   └── transaction-summary.tsx
│
└── ui/
    ├── alert.tsx
    ├── button.tsx
    ├── empty-state.tsx
    ├── input.tsx
    └── loading-state.tsx
```

## Frontend Data Flow

```text
Page Component
   |
   ├── API client
   ├── authentication helper
   ├── transaction state
   ├── summary state
   ├── loading state
   ├── error state
   └── success state
```

After a transaction is created, updated, or deleted, the frontend refreshes:

- transaction list
- pagination
- summary cards
- smart financial insight

This keeps the UI synchronized with the backend.

---

# Backend Architecture

The backend follows NestJS modular architecture.

Main modules:

```text
modules/
├── auth/
└── transactions/
```

## Auth Module

The auth module handles:

- registration
- login
- password hashing
- JWT generation
- JWT validation
- current-user retrieval
- authentication guard
- authenticated-user decorator

## Transactions Module

The transactions module handles:

- create transaction
- list transactions
- retrieve one transaction
- update transaction
- delete transaction
- search
- filtering
- sorting
- pagination
- financial aggregation
- smart insight generation

## Shared Backend Components

```text
common/
├── decorators/
├── filters/
├── guards/
└── types/
```

The centralized exception filter ensures consistent error responses.

---

# Database Design

The application uses PostgreSQL with Prisma ORM.

## User Entity

A user contains fields such as:

```text
id
name
email
passwordHash
createdAt
updatedAt
```

## Transaction Entity

A transaction contains fields such as:

```text
id
userId
type
category
amountMinor
title
description
occurredAt
createdAt
updatedAt
```

## Relationship

```text
User 1 -------- Many Transactions
```

Every transaction belongs to exactly one user.

## Ownership Rule

Every transaction query includes the authenticated user's ID.

For example:

```text
where:
  id = transactionId
  AND userId = authenticatedUserId
```

This prevents users from accessing another user's ledger entries.

---

# API Endpoints

Base URL:

```text
http://localhost:4000/api/v1
```

Swagger documentation:

```text
http://localhost:4000/api/v1/docs
```

## General Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API information |
| GET | `/health` | Health check |

## Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in an existing user |
| GET | `/auth/me` | Retrieve authenticated user |

## Transaction Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/transactions` | Create a transaction |
| GET | `/transactions` | List transactions |
| GET | `/transactions/summary` | Get financial summary and smart insight |
| GET | `/transactions/:id` | Get one transaction |
| PATCH | `/transactions/:id` | Update a transaction |
| DELETE | `/transactions/:id` | Delete a transaction |

---

# Authentication Flow

## Registration

```text
User enters name, email, and password
        |
        v
Frontend sends POST /auth/register
        |
        v
Backend validates request
        |
        v
Backend checks duplicate email
        |
        v
Password is hashed
        |
        v
User is stored in PostgreSQL
        |
        v
JWT access token is returned
        |
        v
Frontend stores token
        |
        v
User is redirected to /transactions
```

## Login

```text
User enters email and password
        |
        v
Frontend sends POST /auth/login
        |
        v
Backend finds user by email
        |
        v
Password hash is verified
        |
        v
JWT token is generated
        |
        v
Frontend stores token
        |
        v
User enters protected dashboard
```

## Protected Request

```text
Frontend sends Authorization header
Authorization: Bearer <token>
        |
        v
JWT guard validates token
        |
        v
Authenticated user is attached to request
        |
        v
Controller receives current user
        |
        v
Service scopes query by userId
```

---

# Transaction Flow

## Create Transaction

```text
User completes transaction form
        |
        v
Frontend validates required fields
        |
        v
Amount is converted to minor units
        |
        v
POST /transactions
        |
        v
Backend validates DTO
        |
        v
Backend verifies safe integer amount
        |
        v
Prisma stores transaction
        |
        v
Frontend reloads list and summary
```

## Update Transaction

```text
User selects Edit
        |
        v
Existing transaction data fills form
        |
        v
PATCH /transactions/:id
        |
        v
Backend verifies ownership
        |
        v
Backend validates changed fields
        |
        v
Database record is updated
        |
        v
Frontend refreshes transaction list and summary
```

## Delete Transaction

```text
User selects Delete
        |
        v
Confirmation dialog appears
        |
        v
DELETE /transactions/:id
        |
        v
Backend verifies ownership
        |
        v
Transaction is deleted
        |
        v
Frontend recalculates valid page
        |
        v
Frontend refreshes list and summary
```

---

# Summary and Insight Flow

```text
Frontend requests GET /transactions/summary
        |
        v
Backend receives authenticated user ID
        |
        v
PostgreSQL aggregation queries calculate:
  - total income
  - total expenses
  - transaction count
  - current-month expenses
  - previous-month expenses
  - category totals
        |
        v
Backend calculates:
  - current balance
  - percentage spent
  - month-over-month change
  - top expense category
        |
        v
Insight engine builds readable message
        |
        v
Frontend renders cards and smart insight
```

The summary is independent of:

- current page
- active search
- active filters
- visible transaction count

This ensures the user's actual account summary stays accurate.

---

# Important Engineering Decisions

## 1. Money Stored as Minor Units

Financial values are not stored as floating-point numbers.

Example:

```text
₹1,200.50
```

is stored as:

```text
120050
```

This avoids floating-point precision errors.

For example, JavaScript floating-point arithmetic can produce unexpected results:

```text
0.1 + 0.2 !== 0.3
```

Using integer minor units is safer for financial applications.

## 2. PostgreSQL BigInt

The database stores transaction amounts using `BigInt`.

Before converting values to JavaScript numbers, the backend verifies they remain inside JavaScript's safe-integer range.

This prevents silent precision loss.

## 3. User-Level Data Isolation

Every transaction query includes `userId`.

A user cannot:

- view another user's transaction
- edit another user's transaction
- delete another user's transaction
- include another user's data in their summary

## 4. Backend Aggregation

The financial summary is calculated in the backend using database aggregation.

It is not calculated from the visible frontend transaction page.

This matters because a paginated page may contain only 10 records while the user may have hundreds.

## 5. Static Route Before Dynamic Route

The route:

```text
GET /transactions/summary
```

is declared before:

```text
GET /transactions/:id
```

This prevents `summary` from being interpreted as a transaction ID.

## 6. Query Parameter Normalization

URL query parameters arrive as strings.

Pagination values such as `page` and `limit` are explicitly converted to numbers before being passed to Prisma.

This prevents Prisma errors involving `skip` and `take`.

## 7. Safe Delete Pagination

When the user deletes the final transaction on a page greater than page 1, the frontend returns to the previous valid page.

This prevents the UI from remaining on an empty invalid page.

## 8. Centralized API Client

Frontend API communication is handled by a shared API utility.

This centralizes:

- API base URL
- authorization header
- JSON parsing
- network failure messages
- backend error handling
- unauthorized behavior

## 9. Centralized Error Responses

The backend uses a global exception filter.

This creates consistent API error structures for:

- validation failure
- unauthorized requests
- forbidden requests
- missing records
- conflicts
- internal errors

## 10. Backend-Owned Insight Logic

The smart insight is generated by the backend rather than the frontend.

Benefits:

- consistent output across clients
- reusable by future mobile applications
- complete dataset access
- easier testing
- avoids frontend duplication

---

# Validation and Error Handling

## Backend Validation

The backend validates:

- email format
- password requirements
- UUID parameters
- transaction type
- category
- amount
- title
- description
- transaction date
- pagination
- sorting fields
- sorting order
- empty update payloads

## Frontend Validation

The frontend prevents invalid submissions such as:

- missing title
- missing amount
- zero amount
- missing type
- missing category
- missing date

## Network Failure Handling

When the backend is unavailable, the frontend displays a readable message rather than crashing.

Example:

```text
Unable to connect to the server.
```

## Authentication Failure Handling

When an API request returns `401 Unauthorized`:

- the stored access token is removed
- the user is redirected to login

## Duplicate Email Handling

Attempting to register an existing email returns a controlled conflict response.

## Missing Transaction Handling

Attempting to access an invalid or deleted transaction returns a not-found error.

---

# Security Considerations

## Implemented

- Password hashing
- JWT authentication
- Protected transaction endpoints
- User-level transaction ownership checks
- UUID validation
- DTO validation
- Environment-based secrets
- CORS configuration
- Safe integer validation
- No database access from the frontend
- Local environment files excluded from Git
- Duplicate account prevention

## Authentication Limitation

For this assignment, the frontend stores the access token in browser storage.

For a larger production FinTech system, stronger authentication would include:

- HTTP-only secure cookies
- short-lived access tokens
- refresh-token rotation
- CSRF protection
- token revocation
- device management
- session history
- account lockout
- suspicious-login detection

---

# Edge Cases Handled

- Empty ledger
- No income transactions
- No expense transactions
- Expenses with no income
- Income with no expenses
- Zero previous-month expenses
- Negative current balance
- Missing description
- Invalid amount
- Zero amount
- Unsafe integer amount
- Invalid UUID
- Missing transaction
- Unauthorized request
- Duplicate registration
- Attempted cross-user access
- Empty update payload
- Invalid pagination values
- Deleting the final item on a later page
- Empty filtered result
- Backend unavailable
- Invalid access token
- Expired access token
- Category without expense data
- No top expense category
- No previous-month comparison available

---

# Local Development Setup

## Prerequisites

Install:

- Node.js 20 or newer
- pnpm
- Docker Desktop
- Git

## Clone Repository

```bash
git clone https://github.com/akshaychavan23031998/smart-ledger.git
cd smart-ledger
```

## Install Dependencies

```bash
pnpm install
```

---

# Environment Variables

## Backend Environment

Create:

```text
apps/api/.env
```

Example:

```env
NODE_ENV=development
PORT=4000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smart_ledger?schema=public

JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d

WEB_ORIGIN=http://localhost:3000

REDIS_URL=redis://localhost:6379
```

## Frontend Environment

Create:

```text
apps/web/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

A safe frontend example is included in:

```text
apps/web/.env.example
```

Do not commit real secrets.

---

# Database and Docker Setup

The local infrastructure uses Docker Compose.

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

Check running services:

```bash
docker compose ps
```

Expected services:

```text
smart-ledger-postgres
smart-ledger-redis
```

Stop services:

```bash
docker compose down
```

Stop services and remove stored volumes:

```bash
docker compose down -v
```

Use the volume-removal command carefully because it deletes local database data.

---

# Prisma Setup

Generate the Prisma client:

```bash
pnpm --filter @smart-ledger/api prisma:generate
```

Run database migrations using the migration script defined in the API package.

Typical development command:

```bash
pnpm --filter @smart-ledger/api prisma:migrate
```

Open Prisma Studio when needed:

```bash
pnpm --filter @smart-ledger/api prisma:studio
```

---

# Running the Application

## Start Backend

From the repository root:

```bash
pnpm --filter @smart-ledger/api start:dev
```

Backend URL:

```text
http://localhost:4000
```

API base URL:

```text
http://localhost:4000/api/v1
```

Swagger:

```text
http://localhost:4000/api/v1/docs
```

## Start Frontend

In another terminal:

```bash
pnpm --filter @smart-ledger/web dev
```

Frontend URL:

```text
http://localhost:3000
```

---

# Testing

## Backend Typecheck

```bash
pnpm --filter @smart-ledger/api typecheck
```

## Backend Unit Tests

```bash
pnpm --filter @smart-ledger/api test -- --runInBand
```

## Backend End-to-End Tests

```bash
pnpm --filter @smart-ledger/api test:e2e -- --runInBand
```

## Backend Build

```bash
pnpm --filter @smart-ledger/api build
```

## Frontend Typecheck

```bash
pnpm --filter @smart-ledger/web typecheck
```

## Frontend Build

```bash
pnpm --filter @smart-ledger/web build
```

## Full Verification Sequence

```bash
pnpm install

docker compose up -d

pnpm --filter @smart-ledger/api typecheck
pnpm --filter @smart-ledger/api test -- --runInBand
pnpm --filter @smart-ledger/api test:e2e -- --runInBand
pnpm --filter @smart-ledger/api build

pnpm --filter @smart-ledger/web typecheck
pnpm --filter @smart-ledger/web build

git diff --check
git status
```

## Verified Test Results

The completed test suite passed:

```text
Backend unit tests: 14 passed
Backend end-to-end tests: 8 passed
Backend typecheck: passed
Backend build: passed
Frontend typecheck: passed
Frontend build: passed
```

The financial summary and smart insight were also verified manually through Swagger and the frontend dashboard.

---

# Manual Verification Flow

The application was manually tested using the following flow.

## Authentication

1. Register a new user.
2. Confirm successful redirect to transactions.
3. Log out.
4. Log in again.
5. Attempt login with the wrong password.
6. Attempt duplicate registration.
7. Confirm protected routes reject unauthorized users.

## Transactions

1. Create an income transaction.
2. Create an expense transaction.
3. Confirm both appear in the list.
4. Confirm amount formatting.
5. Edit the income transaction.
6. Edit the expense transaction.
7. Delete a transaction.
8. Cancel a delete confirmation.
9. Confirm successful delete.
10. Confirm transaction data persists after login.

## Filters

1. Search by title.
2. Search by description.
3. Filter by income.
4. Filter by expense.
5. Filter by category.
6. Filter by date range.
7. Change sorting field.
8. Change sorting direction.
9. Reset filters.

## Summary

1. Confirm total income.
2. Confirm total expenses.
3. Confirm balance.
4. Confirm transaction count.
5. Confirm top expense category.
6. Confirm smart insight.
7. Edit a transaction and confirm summary updates.
8. Delete a transaction and confirm summary updates.
9. Create a second user and confirm separate summary values.

## Error Handling

1. Stop the backend.
2. Refresh the frontend.
3. Confirm readable connection error.
4. Restart backend.
5. Confirm data loads normally.

## Data Isolation

1. Register user A.
2. Create transactions for user A.
3. Log out.
4. Register user B.
5. Confirm user B cannot see user A's transactions.
6. Confirm user B receives a separate financial summary.

---

# AI-Assisted Development

AI tools were used deliberately as development assistants rather than autonomous decision-makers.

## AI Tools Used

- ChatGPT
- Claude

## How AI Accelerated Development

AI helped with:

- initial architecture planning
- monorepo structure suggestions
- NestJS boilerplate
- Next.js component scaffolding
- DTO drafting
- API client structure
- TypeScript interface suggestions
- test-case brainstorming
- debugging possible causes
- documentation organization
- repetitive code generation

This reduced time spent on routine scaffolding.

More time was then spent on:

- architecture
- correctness
- security
- data ownership
- financial precision
- edge cases
- testing
- user experience

---

# Where AI Fell Short

AI-generated output was never accepted without review.

Several issues required manual investigation and correction.

## 1. Prisma Pagination String Issue

Query parameters such as `page` and `limit` arrived as strings.

An early implementation passed them directly into Prisma.

This caused Prisma validation errors for:

```text
skip
take
```

### Human Fix

Pagination values were explicitly converted to numbers before database queries.

---

## 2. Incorrect Frontend Category

An AI-generated frontend constant included a transaction category that was not defined in the Prisma enum.

### Human Fix

The Prisma schema was treated as the source of truth.

Frontend category options were corrected to match backend-supported values.

---

## 3. Incomplete Transaction Types

Initial generated frontend types omitted fields such as:

```text
category
amountMinor
```

### Human Fix

The API response, Prisma model, and frontend usage were compared.

The frontend transaction types were completed manually.

---

## 4. Unsafe API Assumptions

Initial API-client suggestions relied on type assertions without enough error handling.

### Human Fix

A centralized API utility was implemented to handle:

- bearer token attachment
- JSON parsing
- API errors
- network errors
- unauthorized responses

---

## 5. UTF-8 BOM in package.json

A PowerShell file rewrite added a UTF-8 byte-order mark to `package.json`.

TypeScript commands still worked, but Jest rejected the JSON file.

The error appeared as:

```text
"... is not valid JSON"
```

### Human Fix

The file was rewritten using UTF-8 without BOM.

After that, Jest passed successfully.

---

## 6. Prisma GroupBy Type Error

The first summary implementation omitted the `orderBy` field required by the generated Prisma groupBy type.

It also assumed `_sum` was always defined.

### Human Fix

The query was updated with deterministic ordering.

Optional aggregate output was handled safely.

---

## 7. Static Route Collision

The summary endpoint could conflict with the dynamic route:

```text
/transactions/:id
```

The string `summary` could be interpreted as an ID.

### Human Fix

The static route:

```text
/transactions/summary
```

was placed before:

```text
/transactions/:id
```

UUID validation was retained on ID-based routes.

---

## 8. Incorrect Summary Calculation Risk

A simple frontend-only implementation could calculate summary values from the currently visible paginated page.

That would produce incorrect totals.

### Human Fix

A dedicated backend summary endpoint was created.

The backend performs aggregation across all transactions owned by the authenticated user.

---

## 9. Incomplete Generated Files

Some AI-generated files were incomplete or stopped mid-generation.

### Human Fix

Each file was reviewed manually.

Incomplete files were rebuilt in smaller verified steps.

---

## 10. Unnecessary Tooling

Generated setup introduced linting and formatting configuration that created maintenance noise without helping the challenge.

### Human Fix

Unused ESLint and Prettier tooling was removed.

The project retained meaningful validation through:

- TypeScript
- unit tests
- E2E tests
- production builds
- manual verification

---

# How Human Engineering Judgment Improved the Project

The final implementation was manually reviewed for:

- financial data precision
- ownership boundaries
- authentication flow
- enum consistency
- database query correctness
- Prisma behavior
- pagination safety
- route ordering
- safe integer conversion
- error response consistency
- responsive layout
- user feedback
- build stability
- test reliability
- Git history

AI accelerated implementation, but final architecture and correctness remained human-controlled.

---

# Current Limitations

The current project intentionally remains lightweight.

It does not currently include:

- password reset
- email verification
- refresh-token rotation
- HTTP-only cookie authentication
- multiple currencies
- exchange-rate conversion
- recurring transactions
- bank account integration
- transaction import
- CSV export
- PDF export
- monthly budgets
- notifications
- mobile application
- production deployment
- Redis caching in the request path
- full frontend automated tests
- GitHub Actions CI

Redis is included in local Docker infrastructure but is not presented as an active completed feature.

---

# Future Improvements

## Authentication

- HTTP-only secure cookies
- refresh-token rotation
- session revocation
- password reset
- email verification
- account lockout
- login audit history

## Financial Features

- monthly budgets
- recurring transactions
- category limits
- savings goals
- cash-flow forecasting
- multi-currency support
- CSV export
- PDF reports
- transaction attachments

## Analytics

- category charts
- monthly trends
- income-versus-expense visualization
- anomaly detection
- budget warnings
- custom time-range reports

## Backend

- Redis summary caching
- cache invalidation after mutations
- rate limiting
- structured logging
- metrics
- audit events
- background jobs

## DevOps

- API Dockerfile
- frontend Dockerfile
- CI/CD workflow
- automated migration pipeline
- production deployment
- monitoring
- alerting

## Testing

- summary-specific unit tests
- summary E2E tests
- frontend component tests
- browser automation
- accessibility tests
- performance tests

---

# Repository Structure

```text
smart-ledger/
│
├── apps/
│   │
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   └── schema.prisma
│   │   │
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── filters/
│   │   │   │
│   │   │   ├── database/
│   │   │   │   └── prisma.service.ts
│   │   │   │
│   │   │   ├── generated/
│   │   │   │
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── decorators/
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── guards/
│   │   │   │   │   ├── strategies/
│   │   │   │   │   └── types/
│   │   │   │   │
│   │   │   │   └── transactions/
│   │   │   │       ├── dto/
│   │   │   │       ├── types/
│   │   │   │       ├── transactions.controller.ts
│   │   │   │       ├── transactions.module.ts
│   │   │   │       └── transactions.service.ts
│   │   │   │
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   │
│   │   └── test/
│   │
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── login/
│       │   │   ├── register/
│       │   │   ├── transactions/
│       │   │   └── page.tsx
│       │   │
│       │   ├── components/
│       │   │   ├── auth/
│       │   │   ├── transactions/
│       │   │   └── ui/
│       │   │
│       │   ├── lib/
│       │   │   ├── api.ts
│       │   │   ├── auth.ts
│       │   │   ├── constants.ts
│       │   │   ├── currency.ts
│       │   │   └── date.ts
│       │   │
│       │   └── types/
│       │       ├── auth.ts
│       │       └── transaction.ts
│       │
│       └── package.json
│
├── docs/
│   └── screenshots/
│
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

# Git Workflow

Development was divided into focused commits.

Examples:

```text
feat(api): add transaction CRUD
fix(api): normalize transaction pagination params
chore: remove Prettier tooling
chore(web): remove ESLint tooling
fix(api): restore HTTP exception status labels
feat(web): add authentication and transaction management
feat: add financial summary and smart insights
docs: add complete project documentation
```

Before final submission:

```bash
git status
```

Expected output:

```text
nothing to commit, working tree clean
```

Review recent commits:

```bash
git log --oneline --decorate -10
```

Push final changes:

```bash
git push
```

---

# Assignment Completion Status

| Requirement | Status |
|---|---|
| Full-stack application | Complete |
| Add transactions | Complete |
| View transactions | Complete |
| Categorize income and expenses | Complete |
| Basic financial summary | Complete |
| Unique feature | Complete |
| Clean UI | Complete |
| Proper error handling | Complete |
| Structured code | Complete |
| Authentication | Complete |
| User data isolation | Complete |
| PostgreSQL | Complete |
| Docker infrastructure | Complete |
| Swagger documentation | Complete |
| Unit tests | Complete |
| E2E tests | Complete |
| AI usage explanation | Complete |
| AI failure explanation | Complete |
| Human engineering decisions | Complete |
| Public GitHub repository | Complete |
| Production deployment | Not included |
| React Native application | Not required |
| AWS infrastructure | Not required |
| Kubernetes | Not required |
| Terraform | Not required |
| Jenkins | Not required |

---

# Author

**Akshay Chavan**

GitHub:

```text
https://github.com/akshaychavan23031998
```

Project repository:

```text
https://github.com/akshaychavan23031998/smart-ledger
```

---

# License

This project was created for the ByteX Financial Ltd. Junior Full Stack Engineer Challenge and portfolio evaluation.

It is intended for educational, evaluation, and demonstration purposes.