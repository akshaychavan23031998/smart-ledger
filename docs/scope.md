# Assignment Scope

## Objective

Build a lightweight full-stack financial ledger where authenticated users
can add, view, edit, delete, search, filter, and categorize income and
expense transactions.

## Core Features

- User registration, login, logout, and session restoration
- User-specific transaction ownership
- Create, read, update, and delete transactions
- Income and expense categorization
- Search and server-side pagination
- Type, category, date, and amount filters
- Financial summary dashboard
- Total income, total expenses, balance, and savings rate
- Monthly income-versus-expense chart
- Expense category breakdown
- Recent transaction list

## Standout Features

### Spending anomaly detection

Detect expenses that are significantly higher than the user's historical
average for the same category.

The result must be deterministic, explainable, and supported by sufficient
historical data.

### Duplicate transaction warning

Warn users when a newly submitted transaction resembles an existing
transaction, while still allowing an intentional duplicate to be saved.

### Monthly spending projection

Estimate the current month's total expenses using the user's spending rate
and clearly label the result as a projection.

### Redis dashboard caching

Cache derived dashboard data and invalidate it after successful transaction
mutations.

## Engineering Requirements

- Store monetary values using integer minor units
- Validate requests on the frontend and backend
- Protect all user-owned resources
- Use consistent API error responses
- Provide loading, empty, and error states
- Include automated unit, integration, and end-to-end tests
- Provide Swagger documentation
- Provide Docker-based local infrastructure
- Run linting, tests, and builds in GitHub Actions

## Explicitly Excluded

The assessment version will not include:

- Bank integrations
- Payment processing
- Multi-currency conversion
- Multiple financial accounts
- Recurring transactions
- Budget management
- CSV imports
- Shared workspaces
- Mobile applications
- Microservices
- Kubernetes
- LLM-generated financial advice
