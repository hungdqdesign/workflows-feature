# Workflows Feature

DSL-based workflow management system for company procedures.

## Tech Stack

- **Server**: Node.js/Express with Drizzle ORM
- **Database**: PostgreSQL
- **UI**: React + TypeScript
- **Monorepo**: npm workspaces

## Structure

```
.
├── server/          # Express API server
│   ├── src/
│   │   ├── routes/     # API route handlers
│   │   └── services/   # Business logic
│   └── db/          # Database schema & migrations
└── ui/              # React frontend
    └── src/
        └── pages/      # Page components
```

## Setup

```bash
# Install dependencies
npm install

# Run migrations
npm run db:migrate

# Start dev server
npm run dev
```
