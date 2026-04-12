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
- Home page CTA adapts to auth state — shows a personalised welcome and "Post a Discussion" button when logged in; shows "Create Account" when logged out

### Discussions
- Full CRUD, each tagged with a course code (e.g. `COSC 360`)
- Hot list, search, nested comments
- MongoDB text index on title, body, and course

### Comments
- Nested under a discussion at `/api/discussions/:id/comments`
- Live polling every 5 s — new comments appear without a page reload
- `useReducer` manages comment list state (ADD / REMOVE / SET actions)

### Resources
- Types: `link`, `pdf`, `video`, `note`, `other`
- Upvoting with live count updates (toggles on repeat click)
- Filter by course code; text-indexed search on title, description, and course

### Meetups
- Create, RSVP (join / leave), and leave 1–5 star feedback with a comment
- Feedback button only shown to users who attended (RSVP'd) a past meetup
- Average star rating displayed on each card

### Admin
- Admin-only dashboard gated by `requireAuth` + `requireRole("admin")`
- Stats, user management (enable/disable), discussion moderation

### Search
- `GET /api/search` queries discussions, resources, and meetups in one request
- Returns grouped results `{ discussions, resources, meetups }`
- Navbar search bar navigates to `/search` with the query pre-filled

### UI & Theming
- **Dark mode** (default) and **light mode** with a pill-style sliding toggle in the navbar
- Light mode uses a distinct design: slate-50 page background, white cards with a 3 px brand-colour top accent stripe, and a brand-coloured navbar bottom border
- Dark mode uses a near-black background with gray-800 cards
- CSS custom properties (`--surface-*`, `--text-*`, `--border-*`) drive both themes from a single token table
- WCAG AA contrast compliant — all readable text meets 4.5:1 ratio in both modes
- Flash-of-unstyled-content (FOUC) prevented by a blocking `<script>` in `<head>` that reads `localStorage` before React mounts

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
npm run dev                          # Express on :5001

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

- **Frontend:** React (Vite), React Router, Tailwind CSS, Context API (`useReducer`, `useCallback`, `useMemo`)
- **Backend:** Node.js, Express, Mongoose, bcryptjs, JSON Web Tokens, multer
- **Database:** MongoDB (local or Atlas)
- **Infra:** Docker, docker-compose

## API summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account (multipart for avatar) |
| POST | `/api/auth/login` | — | Login, sets signed cookie |
| POST | `/api/auth/logout` | — | Clears cookie |
| GET | `/api/auth/me` | ✓ | Current session user |
| PATCH | `/api/auth/profile` | ✓ | Update username / avatar |
| GET | `/api/discussions` | — | All discussions |
| GET | `/api/discussions/hot` | — | Top 5 by comment count (last 7 days) |
| GET | `/api/discussions/:id` | — | Single discussion |
| POST | `/api/discussions` | ✓ | Create discussion |
| PUT | `/api/discussions/:id` | ✓ | Edit (author or admin) |
| DELETE | `/api/discussions/:id` | ✓ | Delete (author or admin) |
| GET | `/api/discussions/:id/comments` | — | Comments on a thread |
| POST | `/api/discussions/:id/comments` | ✓ | Add comment |
| DELETE | `/api/discussions/:id/comments/:cid` | ✓ | Delete comment (author or admin) |
| GET | `/api/resources` | — | All resources (optional `?course=`) |
| POST | `/api/resources` | ✓ | Share a resource |
| DELETE | `/api/resources/:id` | ✓ | Delete (author or admin) |
| POST | `/api/resources/:id/upvote` | ✓ | Toggle upvote |
| GET | `/api/meetups` | — | All meetups |
| POST | `/api/meetups` | ✓ | Create meetup |
| POST | `/api/meetups/:id/rsvp` | ✓ | Join or leave (`{ action: "join"\|"leave" }`) |
| POST | `/api/meetups/:id/feedback` | ✓ | Rate a past meetup (1–5 stars) |
| GET | `/api/search?q=` | — | Grouped search across all content |
| GET | `/api/admin/stats` | admin | Site statistics |
| GET | `/api/admin/users` | admin | All users |
| PATCH | `/api/admin/users/:id/status` | admin | Enable / disable account |
| DELETE | `/api/admin/discussions/:id` | admin | Moderate any discussion |

## Security

- Passwords hashed with bcrypt (10 rounds)
- Signed HTTP-only JWT cookie (`Secure` + `SameSite` in production)
- Client and server validation on every form / endpoint
- Parameterized Mongoose queries — no string-built queries
- CORS restricted to `CLIENT_URL`
- Role-based middleware for admin routes (`requireAuth` + `requireRole`)
- Secrets from environment variables, never in the repo
- Central error handler — no stack traces leaked in production responses

## Authors

- **Jeet Vaidya** — Student #40955866 — [@JeetVaidya1](https://github.com/JeetVaidya1)
- **Gabriel Unigwe** — Student #71577399 — [@UnigweG](https://github.com/UnigweG)
