# Job Application Tracker

A full-stack job application tracker: a Node/Express REST API with JWT authentication, a PostgreSQL (Supabase) database, and a React frontend that consumes the API. Built as the most complete project in this portfolio — it's the one that best mirrors a real job's architecture: a backend service, a database, and a frontend, talking to each other over HTTP rather than living in one process.

## Features

- **Authentication**: register/login with hashed passwords (bcrypt) and JWT-based sessions — no plaintext passwords anywhere, ever
- **Job applications**: add, edit status, delete — company, role, status, date applied, job posting link, notes
- **Every application is scoped to its owner** — the API checks `user_id` on every query, so one user can never read or modify another user's data, even by guessing an id
- **Filtering** by status (Applied / Interview / Offer / Rejected)
- **A stats bar** showing counts per status
- Backend unit tests (Jest) for the authentication logic

## Architecture

```
job-tracker/
├── server/          # Node/Express REST API
│   ├── src/
│   │   ├── config/db.js            # Postgres connection pool
│   │   ├── middleware/auth.js       # JWT verification middleware
│   │   ├── controllers/             # Request handling + validation
│   │   ├── routes/                  # Express route definitions
│   │   ├── services/authService.js  # Password hashing, JWT signing
│   │   └── index.js                 # App entry point
│   ├── sql/schema.sql
│   └── tests/
└── client/          # React (Vite) frontend
    └── src/
        ├── api/client.js             # All fetch calls to the API, in one place
        ├── context/AuthContext.jsx    # Stores the JWT + user across the app
        ├── components/                 # Form, table, stats bar, route guard
        └── pages/                      # Login, Register, Dashboard
```

**Why a separate backend and frontend, instead of one combined app?** This is how most real production systems are actually built — a stateless API that any client (a web app, a future mobile app, another service) could call, rather than server-rendered pages tightly coupled to one frontend. It's also just a more accurate demonstration of REST API design: routes, status codes, and JWT auth are exactly what you'd be asked about in a backend-focused interview.

## Setup

### 1. Database (Supabase)

Same pattern as your other Postgres projects:
1. Create a Supabase project (or reuse one).
2. Open the SQL Editor and run `server/sql/schema.sql`.
3. Get your **Session pooler** connection string from Connect → Session pooler.

### 2. Backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and fill in:
```
DATABASE_URL=postgres://postgres.<project-ref>:<password>@<pooler-host>:5432/postgres
JWT_SECRET=<any long random string>
PORT=4000
```

If environment variables have given you trouble before, it's also fine to paste these two values directly into `src/config/db.js` and `src/services/authService.js` instead — just don't push real secrets to a public repo either way.

Run it:
```bash
npm run dev
```

### 3. Frontend

```bash
cd client
npm install
```

Copy `.env.example` to `.env` (the default `http://localhost:4000/api` is correct if you didn't change the backend's port).

Run it:
```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`), register an account, and start tracking applications.

## Running backend tests

```bash
cd server
npm test
```

Tests cover the authentication service (password hashing, JWT signing/verification) without needing a real database connection — they test the pure logic in isolation.

## API endpoints

| Method | Path | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in, get a JWT |
| GET | `/api/applications` | Yes | List your applications (optional `?status=` filter) |
| GET | `/api/applications/stats` | Yes | Counts per status |
| POST | `/api/applications` | Yes | Create an application |
| PUT | `/api/applications/:id` | Yes | Update an application |
| DELETE | `/api/applications/:id` | Yes | Delete an application |

## Security decisions worth knowing (good interview material)

- **Passwords are hashed with bcrypt**, never stored or compared in plaintext.
- **The login endpoint returns the same error** ("Invalid email or password") whether the email doesn't exist or the password is wrong — a different message for each would let an attacker discover which emails have accounts.
- **Every application query filters by `user_id`**, not just the requested `id` — this is what stops one logged-in user from reading or editing another user's data via the API directly (not just hiding it in the UI).
- **JWT payloads are readable, not encrypted** — only non-sensitive data (`id`, `email`) goes in the token.

## Possible extensions

- Deploy the backend (Render/Railway) and frontend (Vercel/Netlify) so there's a live demo link, not just local setup
- Password reset flow
- CSV export of applications
- Reminder emails for applications with no update in N days

## License

MIT
