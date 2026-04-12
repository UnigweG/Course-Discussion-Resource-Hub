# Course Discussion and Resource Hub

A MERN-stack web app for COSC 360 where university students can post course discussions, share academic resources, and organize study meetups.

Built as a final project by Jeet Vaidya and Gabriel Unigwe.

## Status

**Complete** — full site delivered for the 50% milestone (April 2026). All baseline objectives are implemented: accounts, discussions, comments with async updates, resources with upvotes, meetups with RSVPs and feedback, search, and an admin dashboard. The project is dockerized and can be brought up with a single command.

## Repo layout

```text
client/             React + Vite + Tailwind frontend
server/             Express + MongoDB backend
docker-compose.yml  Mongo + API + frontend, one-shot startup
```

## Features

### Accounts
- Register (with optional avatar upload), login, logout, session restore
- Signed HTTP-only JWT cookie auth
- Roles: `user` and `admin`; statuses: `active` and `disabled`
- Profile page with avatar and activity summary

### Discussions
- Full CRUD, each tagged with a course code (e.g. `COSC 360`)
- Hot list, search, nested comments
- MongoDB text index on title, body, and course

### Comments
- Nested under a discussion at `/api/discussions/:id/comments`
- Async posting — new comments appear without a page reload

### Resources
- Types: `link`, `pdf`, `video`, `note`, `other`
- Upvoting with live count updates
- Text-indexed search on title, description, and course

### Meetups
- Create, RSVP, and leave 1–5 star feedback with a comment
- Organizer sees the full RSVP list

### Admin
- Admin-only dashboard gated by `requireAuth` + `requireRole("admin")`
- Stats, user management (enable/disable), discussion moderation

### Search
- `GET /api/search` queries discussions, resources, and meetups
- Navbar search bar returns grouped results

## Running it

### With Docker (recommended)

```bash
cp server/.env.example server/.env   # set JWT_SECRET and COOKIE_SECRET
docker compose up --build
```

- Frontend: http://localhost:3000
- API health: http://localhost:5001/api/health

### Locally

```bash
# Terminal 1 — backend
cd server
npm install
cp .env.example .env                 # set JWT_SECRET and COOKIE_SECRET
npm run seed                         # creates the test accounts below
npm run dev                          # Express on :5000

# Terminal 2 — frontend
cd client
npm install
npm run dev                          # Vite on :5173
```

## Test accounts

The seed script (`npm run seed` in `server/`) inserts these into an empty database:

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@university.edu     | Admin123!   |
| Student | jeet@university.edu      | Student123! |
| Student | gabriel@university.edu   | Student123! |
| Student | demo@university.edu      | password123 |

The seed is a no-op if the `users` collection already has data.

## Tech stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Context API
- **Backend:** Node.js, Express, Mongoose, bcryptjs, JSON Web Tokens, multer
- **Database:** MongoDB (local or Atlas)
- **Infra:** Docker, docker-compose

## Security

- Passwords hashed with bcrypt
- Signed HTTP-only JWT cookie (`Secure` + `SameSite` in production)
- Client and server validation on every form / endpoint
- Parameterized Mongoose queries — no string-built queries
- CORS restricted to `CLIENT_URL`
- Role-based middleware for admin routes
- Secrets from environment variables, never in the repo
- Central error handler — no stack traces in responses

## Authors

- **Jeet Vaidya** — Student #40955866 — [@JeetVaidya1](https://github.com/JeetVaidya1)
- **Gabriel Unigwe** — Student #71577399 — [@UnigweG](https://github.com/UnigweG)
